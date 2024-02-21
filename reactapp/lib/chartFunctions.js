import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";




const onPointerOver = (event,chart) => {
  var itemContainer = event.target;
  // As series list is data of a legend, dataContext is series
  var currentSeries = itemContainer.dataItem.dataContext;

  chart.series.each(function(chartSeries) {
    if (chartSeries != currentSeries) {
      chartSeries.strokes.template.setAll({
        strokeOpacity: 0.5,
      });
    } else {
      chartSeries.strokes.template.setAll({
        strokeWidth: 3,

      });
    }
  })
}

const onPointerOut = (event,chart) => {
  // As series list is data of a legend, dataContext is series
  chart.series.each(function(chartSeries) {
    let strokeWidth = 1
    if(chartSeries.get('name').includes("mean") || chartSeries.get('name') === "analysis_assim" || chartSeries.get('name') === "short_range"){
      strokeWidth = 2
    }
    chartSeries.strokes.template.setAll({
      strokeOpacity: 1,
      strokeWidth: strokeWidth,
    });
  });
}

const initializeLegend = (root,chart,onClick,onPointerOver,onPointerOut) => {
  // create legend
  var legend = chart.children.push(am5.Legend.new(root, {
    width: am5.percent(100),
    centerY: am5.percent(50),
    useDefaultMarker: true,
    centerX: am5.percent(50),
    x: am5.percent(50),
    layout: am5.GridLayout.new(root, {
      maxColumns: 7,
      fixedWidthGrid: true
    })

  }));

  legend.markerRectangles.template.setAll({});

  // When legend item container is hovered, dim all the series except the hovered one
  legend.itemContainers.template.events.on("pointerover", function(e) {
    onPointerOver(e,chart);
    // var itemContainer = e.target;

    // // As series list is data of a legend, dataContext is series
    // var series = itemContainer.dataItem.dataContext;

    // chart.series.each(function(chartSeries) {
    //   if (chartSeries != series) {
    //     chartSeries.strokes.template.setAll({
    //       strokeOpacity: 0.5,
    //     });
    //   } else {
    //     chartSeries.strokes.template.setAll({
    //       strokeWidth: 3,

    //     });
    //   }
    // })
  })

  // When legend item container is unhovered, make all series as they are
  legend.itemContainers.template.events.on("pointerout", function(e) {
    onPointerOut(e,chart);

    // chart.series.each(function(chartSeries) {
    //   let strokeWidth = 1
    //   if(chartSeries.get('name').includes("mean") || chartSeries.get('name') === "analysis_assim" || chartSeries.get('name') === "short_range"){
    //     strokeWidth = 2
    //   }
    //   chartSeries.strokes.template.setAll({
    //     strokeOpacity: 1,
    //     strokeWidth: strokeWidth,
    //   });
    // });
  })

  legend.itemContainers.template.events.on("click", function(e) {
    var targetSeries = e.target.dataItem.dataContext;
    var name_series = targetSeries.get('name');
    onClick(name_series);
  });

  legend.data.setAll(chart.series.values);

  return legend
}


const initializeChart = (containerId, data, onClickLegend,onPointerOverLegend,onPointerOutLegend) => {
  console.log(containerId,data, onClickLegend);
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

  // Loop through the data object and add series where is_requested is true
  Object.keys(data).forEach(key => {
    const item = data[key];

    var tooltip = am5.Tooltip.new(root, {
      labelText: `${item['tooltip_text']}: {valueY}`
    })
    const series = chart.series.push(am5xy.LineSeries.new(root, {
      name: item.name_product,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "forecast-time",
      stroke: am5.color(item.color),
      fill: am5.color(item.color),
      maxDeviation:1,
      tooltip: tooltip,
      legendLabelText: `[{stroke}]${item['tooltip_text']}[/]`,
      legendRangeLabelText: `[{stroke}]${item['tooltip_text']}[/]`,
    }));
    series.data.setAll(item.data);
    if (!item.is_requested){
      series.hide();
    }

    // Add a legend if needed
    // chart.set("legend", am5.Legend.new(root, {}));
    series.strokes.template.setAll({
      strokeWidth: 2
    });
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000,500);
  });


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

  // var title = am5.Label.new(root, {
  //   text:  titleProp,
  //   fontSize: 16,
  //   textAlign: "center",
  //   x: am5.percent(50),
  //   centerX: am5.percent(50),
  // })

  // var subtitle = am5.Label.new(root, {
  //   text: subtitleProp,
  //   fontSize: 12,
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   x: am5.percent(50),
  //   centerX: am5.percent(50),
  // })
  //   chart.children.unshift(title);
  //   chart.topAxesContainer.children.push(subtitle);


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


  // Add legend
  initializeLegend(root,chart,onClickLegend,onPointerOverLegend,onPointerOutLegend);

  
  return chart; // Return the chart,root, and legend for further manipulation if needed
};

const updateSeries = (chart,data) => {
    console.log(chart,data);
    Object.keys(data).forEach(key => {
        const item = data[key];
        const series = chart.series.values.find(s => s.get('name') === item.name_product);
        if (item.is_requested) {
          if (series) {
            series.data.setAll(item.data);
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
      });
}

export  { initializeChart,updateSeries,onPointerOver,onPointerOut};