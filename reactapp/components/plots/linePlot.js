import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useLayoutEffect, useEffect ,useRef } from "react";
import Container from 'react-bootstrap/Container';

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


  const makeSeries = (product,series_ref) => {
    var series = chartRef.current.series.push(
      am5xy.LineSeries.new(rootRef.current, {
        name: props.data[product]['name_product'],
        xAxis: xAxisRef.current,
        yAxis: yaxisRef.current,
        valueYField: "value",
        valueXField: "forecast-time",
        maxDeviation:1,
        stroke: am5.color(props.data[product]['color']),
        tooltip: am5.Tooltip.new(rootRef.current, {
          labelText: `${product}: {valueY}`
        })
      })
    );
    series.strokes.template.setAll({
      strokeWidth: 3,
    });
    series.data.setAll(props.data[product]['data']);
    series.appear(1000);
    series_ref.current = series;
    legendRef.current.data.setAll(chartRef.current.series.values);
  }

  // This code will only run one time
  useEffect(() => {
    console.log("useEffect 1 lineplot")

    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout
      })
    );

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {pan:"zoom"})
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
        var series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: props.data[product]['name_product'],
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "forecast-time",
            maxDeviation:1,
            stroke: am5.color(props.data[product]['color']),
            tooltip: am5.Tooltip.new(root, {
              labelText: `${product}: {valueY}`
            })
          })
        );
        series.strokes.template.setAll({
          strokeWidth: 3,
        });
        series.data.setAll(props.data[product]['data']);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        if (product === 'analysis_assim'){
          seriesAnalysisAssimRef.current = series;
        }
      }

    }
    //Today date line
    var rangeDataItem = xAxis.makeDataItem({
      value: new Date().getTime(),
      above: true
    });
    
    var range = xAxis.createAxisRange(rangeDataItem);
    
    rangeDataItem.get("grid").set("visible", true);
    range.get("grid").setAll({
      stroke: '#88d318',
      strokeOpacity: 1,
      width: 32,
      location: 1
    });
  

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);


    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    xAxisRef.current = xAxis;
    chartRef.current= chart;
    yaxisRef.current =  yAxis;
    rootRef.current = root;
    legendRef.current = legend;

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
          // seriesAnalysisAssimRef.current.data.setAll(props.data[product]['data']);
          if(chartRef.current.series.indexOf(seriesAnalysisAssimRef.current) < 0){
            // chartRef.current.series.push(seriesAnalysisAssimRef.current);

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesAnalysisAssimRef.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
          }
          else{
            seriesAnalysisAssimRef.current.data.setAll(props.data[product]['data']);
          }
        }
        if(product ==='short_range' ){
          if(chartRef.current.series.indexOf(seriesShortermRef.current) < 0){

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesShortermRef.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
          }
          else{
            seriesShortermRef.current.data.setAll(props.data[product]['data']);
          }
        }
        // long term forecasts
        if(product ==='long_range_ensemble_mean' ){
          if(chartRef.current.series.indexOf(seriesLongtermMeanRef.current) < 0){

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesLongtermMeanRef.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
          }
          else{
            seriesLongtermMeanRef.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='long_range_ensemble_member_1' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble1Ref.current) < 0){

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesLongtermEnsemble1Ref.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
          }
          else{
            seriesLongtermEnsemble1Ref.current.data.setAll(props.data[product]['data']);
          }
        }
        if(product ==='long_range_ensemble_member_2' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble2Ref.current) < 0){

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesLongtermEnsemble2Ref.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
          }
          else{
            seriesLongtermEnsemble2Ref.current.data.setAll(props.data[product]['data']);
          }
        }

        if(product ==='long_range_ensemble_member_3' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble3Ref.current) < 0){

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesLongtermEnsemble3Ref.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
          }
          else{
            seriesLongtermEnsemble3Ref.current.data.setAll(props.data[product]['data']);
          }
        }
        if(product ==='long_range_ensemble_member_4' ){
          if(chartRef.current.series.indexOf(seriesLongtermEnsemble4Ref.current) < 0){

            var series = chartRef.current.series.push(
              am5xy.LineSeries.new(rootRef.current, {
                name: props.data[product]['name_product'],
                xAxis: xAxisRef.current,
                yAxis: yaxisRef.current,
                valueYField: "value",
                valueXField: "forecast-time",
                maxDeviation:1,
                stroke: am5.color(props.data[product]['color']),
                tooltip: am5.Tooltip.new(rootRef.current, {
                  labelText: `${product}: {valueY}`
                })
              })
            );
            series.strokes.template.setAll({
              strokeWidth: 3,
            });
            series.data.setAll(props.data[product]['data']);
            series.appear(1000);
            seriesLongtermEnsemble4Ref.current = series;
            legendRef.current.data.setAll(chartRef.current.series.values);
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


      }
      
    }

  }, [props.isUpdatePlot]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;


};