import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

import { Fragment, useEffect ,useRef,Suspense, lazy } from "react";


const LineChart = (
  {
    data,
    metadata, 
    initializeChart, 
    updateSeries, 
    onClickLegend,
    onPointerOverLegend,
    onPointerOutLegend
  }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    
    if (!chartRef.current) {
      chartRef.current = initializeChart('chartdiv', data,onClickLegend,onPointerOverLegend,onPointerOutLegend)
    }

    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      // chartRef.current.children.values.find(child => child.get("layer") === 1000).show()
      updateSeries(chartRef.current,data)
    }

  }, [data]); // Ensure re-run if data changes

  // useEffect(() => {
  //   console.log(metadata)
  //   if (chartRef.current && metadata.length > 0) {
  //     var title = am5.Label.new(root, {
  //       text:  metadata[0],
  //       fontSize: 16,
  //       textAlign: "center",
  //       x: am5.percent(50),
  //       centerX: am5.percent(50),
  //     })
    
  //     var subtitle = am5.Label.new(root, {
  //       text: metadata[1],
  //       fontSize: 12,
  //       fontWeight: "bold",
  //       textAlign: "center",
  //       x: am5.percent(50),
  //       centerX: am5.percent(50),
  //     })
  //     chartRef.current.children.unshift(title);
  //     chartRef.current.topAxesContainer.children.push(subtitle);
  //   }

  // }, [metadata]); // Ensure re-run if data changes

 return (
  <Fragment>
    <Suspense fallback={<div>LOADING.....</div>}>
      <div id="chartdiv" style={{ width: "90vh", height: "700px" }}></div>
    </Suspense>
  </Fragment>
 )

}
export default LineChart;