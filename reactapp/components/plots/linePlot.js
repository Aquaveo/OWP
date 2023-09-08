import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

import { useLayoutEffect, useEffect ,useRef } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const CHART_ID = 'default_ID';


export const LineChart = (props) => {
  
  const seriesAnalysisAssimRef = useRef(null);
  
  const seriesShortermRef = useRef(null);
  
  const seriesLongtermMeanRef = useRef(null);
  const seriesLongtermEnsemble1Ref = useRef(null);
  const seriesLongtermEnsemble2Ref = useRef(null);
  const seriesLongtermEnsemble3Ref = useRef(null);
  const seriesLongtermEnsemble4Ref = useRef(null);
  
  const seriesMidtermMeanRef = useRef(null);
  const seriesMidtermEnsemble1Ref = useRef(null);
  const seriesMidtermEnsemble2Ref = useRef(null);
  const seriesMidtermEnsemble3Ref = useRef(null);
  const seriesMidtermEnsemble4Ref = useRef(null);
  const seriesMidtermEnsemble5Ref = useRef(null);
  const seriesMidtermEnsemble6Ref = useRef(null);
  const seriesMidtermEnsemble7Ref = useRef(null);

  const xAxisRef = useRef(null);
  const yaxisRef = useRef(null);
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const legendRef = useRef(null);
  const legendRootRef = useRef(null);
  const labelTitleRef = useRef(null);
  const labelSubtitleRef = useRef(null);

  const makeExportData = () =>{
    var seriesData = [];
    chartRef.current.series.each(function (s) {
      for (var i = 0; i < s.dataItems.length; i++) {
        var dataItem = s.dataItems[i];
        var seriesName = s.get('name');
        const date = new Date(dataItem.get('valueX'));
        // Get the date string in the desired format (YYYY-MM-DD HH:MM:SS)
        const dateString = date.toISOString().slice(0, 19).replace('T', ' ');
        var dataItemObject = {};
        dataItemObject['forecastTime'] = dateString,
        dataItemObject[seriesName] = dataItem.get('valueY'),
        seriesData.push(dataItemObject);
      }
    });
    // Create an object to store the merged values
    const mergedData = {};

    // Iterate through the data array
    seriesData.forEach((item) => {
      const { forecastTime, ...values } = item;

      if (!mergedData[forecastTime]) {
        mergedData[forecastTime] = { forecastTime, ...values };
      } else {
        mergedData[forecastTime] = { forecastTime, ...mergedData[forecastTime], ...values };
      }
    });

    // Convert the mergedData object back to an array
    const mergedDataArray = Object.values(mergedData);

    var exporting = am5plugins_exporting.Exporting.new(rootRef.current, {
      menu: am5plugins_exporting.ExportingMenu.new(rootRef.current, {}),
      dataSource: mergedDataArray
    });
    var annotator = am5plugins_exporting.Annotator.new(rootRef.current, {});

    var menuitems = exporting.get("menu").get("items");

    menuitems.push({
        type: "separator"
    });

    menuitems.push({
        type: "custom",
        label: "Annotate",
        callback: function () {
            this.close();
            annotator.toggle();            
        }
    });
  }


  const makeSeries = (product,series_ref) => {

    var tooltip = am5.Tooltip.new(rootRef.current, {
      labelText: `${props.data[product]['tooltip_text']}: {valueY}`,
      // getFillFromSprite: true,
      // getLabelFillFromSprite: true
    })
    // tooltip.get('background').setAll({
    //   fill: am5.color(props.data[product]['color']),
    //   strokeWidth: 0,
    // });
    // tooltip.label.setAll({
    //   fill: am5.color(props.data[product]['color'])
    // });
    var series = chartRef.current.series.push(
      am5xy.LineSeries.new(rootRef.current, {
        name: props.data[product]['name_product'],
        xAxis: xAxisRef.current,
        yAxis: yaxisRef.current,
        valueYField: "value",
        valueXField: "forecast-time",
        maxDeviation:1,
        // stroke: am5.color(props.data[product]['color']),
        tooltip: tooltip,
        legendLabelText: "[{stroke}]{name}[/]: [bold #888]{categoryX}[/]",
        legendRangeLabelText: "[{stroke}]{name}[/]",
        legendValueText: "[bold {stroke}]{valueY}[/]",
        legendRangeValueText: "[{stroke}]{valueYClose}[/]"
      })
    );

    let strokeWidth = 1
    if(product.includes("mean") || product === "analysis_assim" || product === "short_range"){
      strokeWidth = 3
    }
    series.strokes.template.setAll({
      strokeWidth: strokeWidth,
    });
    series.data.setAll(props.data[product]['data']);
    series.appear(1000,500);
        // series.appear(1000);
    series_ref.current = series;
    legendRef.current.data.setAll(chartRef.current.series.values);
  }

  const addLabels = () =>{

      // labelTitleRef.current.set('text', props.metadata[0])
      // chartRef.current.children.unshift(am5.Label.new(rootRef.current, {
      //   text: props.metadata[0],
      //   fontSize: 14,
      //   textAlign: "center",
      //   x: am5.percent(50),
      //   centerX: am5.percent(50),
      //   height: "100"
      // }));
    
    labelSubtitleRef.current.set('text', props.metadata[1])

  }
  // This code will only run one time
  useEffect(() => {
    console.log("useEffect 1 lineplot")

    let root = am5.Root.new("chartdiv");
    var legendRoot = am5.Root.new("legenddiv");

    root.setThemes([am5themes_Animated.new(root)]);
    legendRoot.setThemes([
      am5themes_Animated.new(root),
      am5xy.DefaultTheme.new(root)
    ]);
    
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX:true
        // layout: "gridLayout"
      })
    );

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {pan:"zoom"}),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "hour", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: "MM/dd HH:mm"
      })
    );
    for (const product in  props.data){
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      if(props.data[product]['is_requested']){

        var tooltip = am5.Tooltip.new(root, {
          labelText: `${props.data[product]['tooltip_text']}: {valueY}`,
          // getFillFromSprite: true,
          // getLabelFillFromSprite: true
        })
        // tooltip.get('background').set({
        //   fill: am5.color(props.data[product]['color']),
        //   strokeWidth: 0,
        // });
        // tooltip.label.set({
        //   fill: am5.color(props.data[product]['color'])
        // });
        
        var series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: props.data[product]['name_product'],
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "forecast-time",
            maxDeviation:1,
            // stroke: am5.color(props.data[product]['color']),
            tooltip: tooltip,
            legendLabelText: "[{stroke}]{name}[/]: [bold #888]{categoryX}[/]",
            legendRangeLabelText: "[{stroke}]{name}[/]",
            legendValueText: "[bold {stroke}]{valueY}[/]",
            legendRangeValueText: "[{stroke}]{valueYClose}[/]"
          })
        );
        series.strokes.template.setAll({
          strokeWidth: 2,
        });
        series.data.setAll(props.data[product]['data']);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000,500);

        if (product === 'analysis_assim'){
          seriesAnalysisAssimRef.current = series;
          var seriesData = [];
          for (var i = 0; i < seriesAnalysisAssimRef.current.dataItems.length; i++) {
            var dataItem = seriesAnalysisAssimRef.current.dataItems[i];
            var seriesName = s.get('name');
            const date = new Date(dataItem.get('valueX'));
            // Get the date string in the desired format (YYYY-MM-DD HH:MM:SS)
            const dateString = date.toISOString().slice(0, 19).replace('T', ' ');
            var dataItemObject = {};
            dataItemObject['forecastTime'] = dateString,
            dataItemObject[seriesName] = dataItem.get('valueY'),
            seriesData.push(dataItemObject);
          }
          // Create an object to store the merged values
          const mergedData = {};
      
          // Iterate through the data array
          seriesData.forEach((item) => {
            const { forecastTime, ...values } = item;
      
            if (!mergedData[forecastTime]) {
              mergedData[forecastTime] = { forecastTime, ...values };
            } else {
              mergedData[forecastTime] = { forecastTime, ...mergedData[forecastTime], ...values };
            }
          });
      
          // Convert the mergedData object back to an array
          const mergedDataArray = Object.values(mergedData);
      
          var exporting = am5plugins_exporting.Exporting.new(root, {
            menu: am5plugins_exporting.ExportingMenu.new(root, {}),
            dataSource: mergedDataArray
          });
        }
      }

    }

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

    // Add legend
    let legend = legendRoot.container.children.push(am5.Legend.new(legendRoot, {
      width: am5.percent(100),
      centerX: am5.percent(50),
      x: am5.percent(50),
      useDefaultMarker: true,
      layout: legendRoot.verticalLayout
      // layout: am5.GridLayout.new(root, {
      //   maxColumns: 3,
      //   fixedWidthGrid: true
      // })
    }));

    legend.markerRectangles.template.setAll({});


    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on("pointerover", function(e) {
      var itemContainer = e.target;

      // As series list is data of a legend, dataContext is series
      var series = itemContainer.dataItem.dataContext;

      chart.series.each(function(chartSeries) {
        if (chartSeries != series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.5,
            // stroke: am5.color(props.data[chartSeries.get('name')]['color'])
          });
        } else {
          
          chartSeries.strokes.template.setAll({
            strokeWidth: 3,
            // stroke: am5.color(props.data[chartSeries.get('name')]['color'])
          });
        }
      })
    })

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on("pointerout", function(e) {
      var itemContainer = e.target;
      var series = itemContainer.dataItem.dataContext;

      chart.series.each(function(chartSeries) {
        let strokeWidth = 1
        if(chartSeries.get('name').includes("mean") || chartSeries.get('name') === "analysis_assim" || chartSeries.get('name') === "short_range"){
          strokeWidth = 2
        }
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: strokeWidth,
          // stroke: am5.color(props.data[chartSeries.get('name')]['color'])
        });
      });
    })

    legend.itemContainers.template.set("width", am5.p100);
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: "right"
    });



    legend.data.setAll(chart.series.values);
    // Resize legend to actual height of its content
    legend.events.on("boundschanged", function() {
      document.getElementById("legenddiv").style.height = legend.height() + "px"
    });

    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("forceHidden", true);
    cursor.lineY.set("forceHidden", true);


    // add title and subtitle

    var title = am5.Label.new(root, {
      text: props.metadata[0],
      fontSize: 16,
      textAlign: "center",
      x: am5.percent(50),
      // y:am5.percent(-20),
      centerX: am5.percent(50),
      // height: "100"
    })
    var subtitle = am5.Label.new(root, {
      text: `${props.metadata[1]}`,
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
    })
    // let titleChart = chart.children.unshift(title);
    let subtitleChart = chart.topAxesContainer.children.push(subtitle);


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

    xAxisRef.current = xAxis;
    chartRef.current= chart;
    yaxisRef.current =  yAxis;
    rootRef.current = root;
    legendRootRef.current = legendRoot;
    legendRef.current = legend;
    // labelTitleRef.current = titleChart;
    labelSubtitleRef.current = subtitleChart;

    return () => {
      root.dispose();
    };
  }, []);

  // This code will only run when props.data changes
  useEffect(() => {
    console.log("useEffect 2 lineplot")

    for (const product in  props.data){
      if(!props.data[product]['is_requested']){
        if(product ==='analysis_assim' && chartRef.current.series.indexOf(seriesAnalysisAssimRef.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesAnalysisAssimRef.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);

        }
        if(product ==='short_range' && chartRef.current.series.indexOf(seriesShortermRef.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesShortermRef.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        // Long term forecast
        if(product ==='long_range_ensemble_mean' && chartRef.current.series.indexOf(seriesLongtermMeanRef.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesLongtermMeanRef.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='long_range_ensemble_member_1' && chartRef.current.series.indexOf(seriesLongtermEnsemble1Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesLongtermEnsemble1Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='long_range_ensemble_member_2' && chartRef.current.series.indexOf(seriesLongtermEnsemble2Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesLongtermEnsemble2Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='long_range_ensemble_member_3' && chartRef.current.series.indexOf(seriesLongtermEnsemble3Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesLongtermEnsemble3Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='long_range_ensemble_member_4' && chartRef.current.series.indexOf(seriesLongtermEnsemble4Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesLongtermEnsemble4Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_mean' && chartRef.current.series.indexOf(seriesMidtermMeanRef.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermMeanRef.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_1' && chartRef.current.series.indexOf(seriesMidtermEnsemble1Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble1Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_2' && chartRef.current.series.indexOf(seriesMidtermEnsemble2Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble2Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_3' && chartRef.current.series.indexOf(seriesMidtermEnsemble3Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble3Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_4' && chartRef.current.series.indexOf(seriesMidtermEnsemble4Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble4Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_5' && chartRef.current.series.indexOf(seriesMidtermEnsemble5Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble5Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_6' && chartRef.current.series.indexOf(seriesMidtermEnsemble6Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble6Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }
        if(product ==='medium_range_ensemble_member_7' && chartRef.current.series.indexOf(seriesMidtermEnsemble7Ref.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesMidtermEnsemble7Ref.current)
          ).dispose();
          // removes the legend when we inactivate the layer
          legendRef.current.data.setAll(chartRef.current.series.values);
        }          
      }
      else{
        if( product ==='analysis_assim'){
          if(chartRef.current.series.indexOf(seriesAnalysisAssimRef.current) < 0){

              makeSeries(product,seriesAnalysisAssimRef);
          }
          else{
            seriesAnalysisAssimRef.current.data.setAll(props.data[product]['data']);

          }

        }
        if(product ==='short_range' ){
          if(chartRef.current.series.indexOf(seriesShortermRef.current) < 0){
            makeSeries(product,seriesShortermRef);
 
          }
          else{
            seriesShortermRef.current.data.setAll(props.data[product]['data']);
          }
        }
        // long term forecasts
        if(product ==='long_range_ensemble_mean' ){
          if(chartRef.current.series.indexOf(seriesLongtermMeanRef.current) < 0){
            makeSeries(product,seriesLongtermMeanRef);
          }
          else{
            seriesLongtermMeanRef.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='long_range_ensemble_member_1' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble1Ref.current) < 0){

            makeSeries(product,seriesLongtermEnsemble1Ref);

          }
          else{
            seriesLongtermEnsemble1Ref.current.data.setAll(props.data[product]['data']);
          }
        }
        if(product ==='long_range_ensemble_member_2' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble2Ref.current) < 0){
            makeSeries(product,seriesLongtermEnsemble2Ref);

          }
          else{
            seriesLongtermEnsemble2Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='long_range_ensemble_member_3' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble3Ref.current) < 0){
            makeSeries(product,seriesLongtermEnsemble3Ref);

          }
          else{
            seriesLongtermEnsemble3Ref.current.data.setAll(props.data[product]['data']);
          }
        }
        if(product ==='long_range_ensemble_member_4' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble4Ref.current) < 0){
            makeSeries(product,seriesLongtermEnsemble4Ref);
          }
          else{
            seriesLongtermEnsemble4Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='medium_range_ensemble_mean' ){
          if(chartRef.current.series.indexOf(seriesMidtermMeanRef.current) < 0){
            makeSeries(product,seriesMidtermMeanRef);
          }
          else{
            seriesMidtermMeanRef.current.data.setAll(props.data[product]['data']);
          }
        }
        if(product ==='medium_range_ensemble_member_1' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble1Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble1Ref);
          }
          else{
            seriesMidtermEnsemble1Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='medium_range_ensemble_member_2' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble2Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble2Ref);
          }
          else{
            seriesMidtermEnsemble2Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='medium_range_ensemble_member_3' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble3Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble3Ref);
          }
          else{
            seriesMidtermEnsemble3Ref.current.data.setAll(props.data[product]['data']);
          }
        }        
        if(product ==='medium_range_ensemble_member_4' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble4Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble4Ref);
          }
          else{
            seriesMidtermEnsemble4Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='medium_range_ensemble_member_5' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble5Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble5Ref);
          }
          else{
            seriesMidtermEnsemble5Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='medium_range_ensemble_member_6' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble6Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble6Ref);
          }
          else{
            seriesMidtermEnsemble6Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='medium_range_ensemble_member_7' ){
          if(chartRef.current.series.indexOf(seriesMidtermEnsemble7Ref.current) < 0){
            makeSeries(product,seriesMidtermEnsemble7Ref);
          }
          else{
            seriesMidtermEnsemble7Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        makeExportData();
      }
      
    }
    props.handleHideLoading()
  }, [props.isUpdatePlot]);

  /*
    When metadata is changed
  */
  useEffect(() => {
    addLabels();
    console.log("s2")
  
    return () => {
    }
  }, [props.metadata])
  
  return(
    <Container>
      <Row>
        <Col sm={10}>
            <div id="chartdiv" style={{ width: "100%", height: "600px"}}></div>
        </Col>
        <Col sm={2}>
        <div id="legenddiv" style={{ width: "100%", height: "300px"}}></div>
        </Col>
      </Row>

    </Container>  
  )
  
        
};


    // if(props.data[product]['name_product']=='analysis_assim'){
    //   chartRef.current.series.data.insert(0, series);
    // }

    // if(props.data[product]['name_product']=='short_range'){
    //   chartRef.current.series.data.insert(1, series);
    // }
    // if(props.data[product]['name_product']=='medium_range_ensemble_mean'){
    //   chartRef.current.series.insert(2, series);
    // }
    
    // if(props.data[product]['name_product']=='medium_range_ensemble_member_1'){
    //   chartRef.current.series.insert(3, series);
    // }

    // if(props.data[product]['name_product']=='medium_range_ensemble_member_2'){
    //   chartRef.current.series.insert(4, series);
    // }
    // if(props.data[product]['name_product']=='medium_range_ensemble_member_3'){
    //   chartRef.current.series.insert(5, series);
    // }
    // if(props.data[product]['name_product']=='medium_range_ensemble_member_4'){
    //   chartRef.current.series.insert(6, series);
    // }

    // if(props.data[product]['name_product']=='medium_range_ensemble_member_5'){
    //   chartRef.current.series.insert(7, series);
    // }
    // if(props.data[product]['name_product']=='medium_range_ensemble_member_6'){
    //   chartRef.current.series.insert(8, series);
    // }

    // if(props.data[product]['name_product']=='medium_range_ensemble_member_7'){
    //   chartRef.current.series.insert(9, series);
    // }
    // if(props.data[product]['name_product']=='long_range_ensemble_mean'){
    //   chartRef.current.series.insert(10, series);
    // }

    // if(props.data[product]['name_product']=='long_range_ensemble_member_1'){
    //   chartRef.current.series.insert(11, series);
    // }

    // if(props.data[product]['name_product']=='long_range_ensemble_member_2'){
    //   chartRef.current.series.insert(12, series);
    // }

    // if(props.data[product]['name_product']=='long_range_ensemble_member_3'){
    //   chartRef.current.series.insert(13, series);
    // }

    // if(props.data[product]['name_product']=='long_range_ensemble_member_4'){
    //   chartRef.current.series.insert(14, series);
    // }