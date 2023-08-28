import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useLayoutEffect, useEffect ,useRef } from "react";
import Container from 'react-bootstrap/Container';

const CHART_ID = 'default_ID';

export const LineChart = (props) => {
  
  const seriesAnalysisAssimRef = useRef(null);
  const seriesShortermRef = useRef(null);
  
  const xAxisRef = useRef(null);
  const yaxisRef = useRef(null);
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const legendRef = useRef(null);
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
        // if (product === 'short_range'){
        //   seriesShortermRef.current = series;
        // }
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
          // props.setCurrentProducts({type: product, is_requested: props.data[product]['is_requested'], data:[] })
        }
        if(product ==='short_range' && chartRef.current.series.indexOf(seriesShortermRef.current) > -1){
          chartRef.current.series.removeIndex(
            chartRef.current.series.indexOf(seriesShortermRef.current)
          )
          // props.setCurrentProducts({type: product, is_requested: props.data[product]['is_requested'], data:[] })

        }
      }
      else{
        if( product ==='analysis_assim'){
          seriesAnalysisAssimRef.current.data.setAll(props.data[product]['data']);
          if(chartRef.current.series.indexOf(seriesAnalysisAssimRef.current) < 0){
            // props.setCurrentProducts({type: product, is_requested: props.data[product]['is_requested'], data:[] })
            chartRef.current.series.push(seriesAnalysisAssimRef.current);
          }
          // else{
          //   seriesAnalysisAssimRef.current.data.setAll(props.data[product]['data']);

          // }
        }
        if(product ==='short_range' ){
          // seriesShortermRef.current.data.setAll(props.data[product]['data']);
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

            // seriesShortermRef.current.data.setAll(props.data[product]['data']);
            // chartRef.current.series.push(seriesShortermRef.current);
          }
          else{
            seriesShortermRef.current.data.setAll(props.data[product]['data']);
          }
        }
      }
      
    }

  }, [props.isUpdatePlot]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;


};