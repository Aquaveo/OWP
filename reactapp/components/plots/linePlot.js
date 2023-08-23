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
        maxDeviation:1,
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
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: props.data[product]['name_product'],
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "forecast-time",
          maxDeviation:1,

          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
          })
        })
      );

      if (props.data[product]['is_requested'] && props.data[product]['name_product'] === 'analysis_assim'){
        series.data.setAll(props.data[product]['data']);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        seriesAnalysisAssimRef.current = series;
      }
      if (props.data[product]['is_requested'] && props.data[product]['name_product'] === 'short_range'){
        series.data.setAll(props.data[product]['data']);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        seriesShortermRef.current = series;
      }

    }


    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    xAxisRef.current = xAxis;
    // series1Ref.current = series1;
    // series2Ref.current = series2;
    return () => {
      root.dispose();
    };
  }, []);

  // This code will only run when props.data changes
  useEffect(() => {
    console.log("useEffect 2 lineplot")

    for (const product in  props.data){
      if(props.data[product]['is_requested'] && props.data[product]['name_product']==='analysis_assim'){
        seriesAnalysisAssimRef.current.data.setAll(props.data['analysis_assim']['data']);
      }
      if(props.data[product]['is_requested'] && props.data[product]['name_product']==='short_range'){
        seriesShortermRef.current.data.setAll(props.data['short_range']['data']);
      }

    }


    // props.data.forEach(function(product){
    //   if(props.data[product]['is_requested'] && props.data[product]['name_product']==='analysis_assim'){
    //     seriesAnalysisAssimRef.current.data.setAll(props.data['analysis_assim']['data']);
    //   }
    //   if(props.data[product]['is_requested'] && props.data[product]['name_product']==='short_range'){
    //     seriesShortermRef.current.data.setAll(props.data['short_range']['data']);
    //   }
    // })
    xAxisRef.current.data.setAll(props.data['analysis_assim']['data']);
    // seriesAnalysisAssimRef.current.data.setAll(props.data['analysis_assim']['data']);
    // seriesShortermRef.current.data.setAll(props.data['short_range']['data']);

  }, [props.data]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
























  // const chartRef = useRef(null);
  // useEffect(() => {
  //   let root = am5.Root.new(CHART_ID);
  //   console.log("maklA")
  //   // Set themes
  //   // https://www.amcharts.com/docs/v5/concepts/themes/
  //   root.setThemes([
  //     am5themes_Animated.new(root)
  //   ]);

  //   // Create chart
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/
  //   var chart = root.container.children.push(
  //     am5xy.XYChart.new(root, {
  //       panX: true,
  //       panY: true,
  //       wheelX: "panX",
  //       wheelY: "zoomX",
  //     pinchZoomX:true
  //     })
  //   );

  //   // Add cursor
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  //   var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  //     behavior: "none"
  //   }));
  //   cursor.lineY.set("visible", false);

  //   // Create axes
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  //   var xAxis = chart.xAxes.push(
  //     am5xy.DateAxis.new(root, {
  //       baseInterval: { timeUnit: "day", count: 1 },
  //       renderer: am5xy.AxisRendererX.new(root, {}),
  //       tooltip: am5.Tooltip.new(root, {}),
  //       tooltipDateFormat: "yyyy-MM-dd"
  //     })
  //   );

  //   var yAxis = chart.yAxes.push(
  //     am5xy.ValueAxis.new(root, {
  //       maxDeviation:1,
  //       renderer: am5xy.AxisRendererY.new(root, {pan:"zoom"})
  //     })
  //   );

  //   // Add series
  //   data.forEach(element => {
  //     // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  //     var series = chart.series.push(
  //       am5xy.LineSeries.new(root, {
  //         name: "Series",
  //         xAxis: xAxis,
  //         yAxis: yAxis,
  //         valueYField: "value",
  //         valueXField: "forecast-time",
  //         tooltip: am5.Tooltip.new(root, {
  //           labelText: "{valueY}"
  //         })
  //       })
  //     );
  //     series.data.setAll(element);

  //     // Make stuff animate on load
  //     // https://www.amcharts.com/docs/v5/concepts/animations/
  //     series.appear(1000);
    
  //   });

  //   // Add scrollbar
  //   // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  //   var scrollbar = chart.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
  //     orientation: "horizontal",
  //     height: 60
  //   }));

  //   var sbDateAxis = scrollbar.chart.xAxes.push(
  //     am5xy.DateAxis.new(root, {
  //       baseInterval: {
  //         timeUnit: "day",
  //         count: 1
  //       },
  //       renderer: am5xy.AxisRendererX.new(root, {})
  //     })
  //   );

  //   var sbValueAxis = scrollbar.chart.yAxes.push(
  //     am5xy.ValueAxis.new(root, {
  //       renderer: am5xy.AxisRendererY.new(root, {})
  //     })
  //   );

  //   var sbSeries = scrollbar.chart.series.push(
  //     am5xy.LineSeries.new(root, {
  //       valueYField: "price0",
  //       valueXField: "date0",
  //       xAxis: sbDateAxis,
  //       yAxis: sbValueAxis
  //     })
  //   );

  //   // series0.data.setAll(data);
  //   // series1.data.setAll(data);
  //   // sbSeries.data.setAll(data[0]);

  //   chart.appear(1000, 100);

  //   chartRef.current = chart;
  //   return () => {
  //     root.dispose();
  //   };
  // }, []);
  // // When the paddingRight prop changes it will update the chart
  // useEffect(() => {
  //   chartRef.current.set("paddingRight", paddingRight);
  // }, [paddingRight]);


  // return (
  //   <Container className="py-5 h-100 d-flex justify-content-center">
  //     <div id="default_ID" style={{ width: "100%", height: "500px" }}></div>;
  //   </Container>
  // );
};