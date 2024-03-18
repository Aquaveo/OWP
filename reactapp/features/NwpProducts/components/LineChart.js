import { Fragment, useEffect ,useRef,Suspense, lazy } from "react";
import {useNwpProductsContext} from "../hooks/useNwpProductsContext";


const LineChart = (
  {
    initializeChart, 
    updateSeries, 
    onClickLegend,
    onPointerOverLegend,
    onPointerOutLegend
  }) => {


  const chartRef = useRef(null);
  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();

  useEffect(() => {
    console.log("LineChart useEffect")
    if (chartRef.current) {
      console.log("updating series")
      updateSeries(chartRef.current,currentProducts.products)
    }
    else{
      console.log("initializeChart")
      chartRef.current = initializeChart('chartdiv', currentProducts.products,onClickLegend,onPointerOverLegend,onPointerOutLegend)
    }
    return () => {
      if (chartRef.current && !currentProducts.isModalOpen){
        console.log("unmounting chart");
        chartRef.current && chartRef.current.dispose();
        nwpActions.resetProducts();
      }      
    }  
  }, [currentProducts.products]); // Ensure re-run if data changes

 return (
    <div id="chartdiv" style={{ width: "90vh", height: "700px" }}></div>
 )

}
export default LineChart;