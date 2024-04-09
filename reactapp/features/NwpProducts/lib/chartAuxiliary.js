import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import {createIndividualLegend} from './legendAuxiliary'

const productKeys = [
    'analysis_assimilation',
    'short_range',
    'medium_range_ensemble_mean',
    'medium_range_ensemble_member_1',
    'medium_range_ensemble_member_2',
    'medium_range_ensemble_member_3',
    'medium_range_ensemble_member_4',
    'medium_range_ensemble_member_5',
    'medium_range_ensemble_member_6',
    'medium_range_blend',
    'long_range_ensemble_mean',
    'long_range_ensemble_member_1',
    'long_range_ensemble_member_2',
    'long_range_ensemble_member_3',
    'long_range_ensemble_member_4',
  ];
  
// Define handleUpdate outside of the useEffect
const handleUpdate = (key, chartRef, currentProducts, updateSeries, legendContainer, toggleProduct) => {
    if (chartRef.current && currentProducts.products[key]) {
        updateSeries(chartRef.current, currentProducts.products[key],legendContainer,toggleProduct);
    }
};


const initializeChart = (containerId, title, subtitle) => {
    // console.log(containerId,data, onClickLegend);
    const root = am5.Root.new(containerId);
    
    root.setThemes([am5themes_Animated.new(root)]);
    
    // Create chart
    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: 'panX',
      wheelY: 'zoomX',
      pinchZoomX:true,
      layout: root.verticalLayout
    }));
  
    // Create axes
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "hour", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: "MM/dd HH:mm"
      })
    );
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {pan:"zoom"}),
        tooltip: am5.Tooltip.new(root, {})
      })
    );
  
  
    //Today date line
    var rangeDataItem = xAxis.makeDataItem({
      value: new Date().setHours(20),
      above: false
    });

    var range = xAxis.createAxisRange(rangeDataItem);
    
    rangeDataItem.get("grid").set("visible", true);
    
    range.get("grid").setAll({
      stroke: '#88d318',
      strokeOpacity: 1,
      strokeWidth:2,
      width: 40,
      location: 1
    });
  
    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal",
      
    }));
  
    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("forceHidden", true);
    cursor.lineY.set("forceHidden", true);
  
  
    chart.events.on("datavalidated", function(ev) {
      // Get objects of interest
      var chart = ev.target;
      var categoryAxis = chart.yAxes.getIndex(0);
    
      // Calculate how we need to adjust chart height
      var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
    
      // get current chart height
      var targetHeight = chart.pixelHeight + adjustHeight;
    
      // Set it on chart's container
      chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
      
    // add title and subtitle
    chart.children.unshift(am5.Label.new(root, {
      text: subtitle,
      fontSize: 14,
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50)
    }));

    chart.children.unshift(am5.Label.new(root, {
      text: title,
      fontSize: 25,
      fontWeight: "500",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));

    return chart; // Return the chart,root, and legend for further manipulation if needed
  };
  


const updateSeries = (chart,item,legendContainer,toggleProduct) => {
  const series = chart.series.values.find(s => s.get('name') === item.name_product);

  var tooltip = am5.Tooltip.new(chart.root, {
    labelText: `${item['tooltip_text']}: {valueY}`
  })
  
  // if we have data in the nwm product then create the serie, and added it to the legend.
  if(item.data.length > 0){
    if (!series) {
      const series = chart.series.push(am5xy.LineSeries.new(chart.root, {
        name: item.name_product,
        xAxis: chart.xAxes.values[0],
        yAxis: chart.yAxes.values[0],
        valueYField: "value",
        valueXField: "forecast-time",
        stroke: am5.color(item.color),
        fill: am5.color(item.color),
        maxDeviation:1,
        tooltip: tooltip,
        legendLabelText: `[{stroke}]${item['tooltip_text']}[/]`,
        legendRangeLabelText: `[{stroke}]${item['tooltip_text']}[/]`,
      }));
  
      defineSeries(item,series)
      // chart.children.values[chart.children.values.length-1].data.push(series)
      createOrAddLegend(legendContainer,chart.root,chart,item, toggleProduct,series)
      // createIndividualLegend(legendContainer,chart.root,chart,item.name_product, toggleProduct)
      
      // legendContainer.children.values.forEach(element => {
      //   if(element.get('name') === item.name_product){
      //     element.data.push(series)
      //   }
      // });

    }
    // if the product data is already in the chart, then update the data and show or hide the serie.
    else{
      defineSeries(item,series)
    }
  }

}

const createOrAddLegend = (legendContainer,root,chart,item,toggleProduct,series ) =>{
  console.log(legendContainer.children.values)

  // Determine the legend name based on the product name.
  let nameLegend;
  if (['analysis_assimilation', 'short_range', 'medium_range_blend'].includes(item.name_product)) {
    nameLegend = 'National Water Model';
  } else {
    nameLegend = `${item.name_product.split('_')[0]} Range Ensembles`;
  }

  const legend = legendContainer.children.values.find(s => s.get('name','').includes(nameLegend) || s.get('name','') === nameLegend);

  if(legend){
    legend.data.push(series)
  }
  else{
    let new_legend = createIndividualLegend(legendContainer, root, chart,nameLegend,toggleProduct)
    new_legend.data.push(series)
  }

}

const defineSeries = (item,series) =>{
  if (item.is_visible) {
    if (series) {
      setTimeout(() => {
        series.data.setAll(item.data);
      }, 100);
      series.show();
      series.strokes.template.setAll({
        strokeWidth: 2
      });
    }
  }
  else{
    if (series) {
      series.hide();
      series.data.setAll([]);
    }
  }
}




  
export { productKeys, handleUpdate, initializeChart, updateSeries}




