import { Fragment, useEffect ,useRef,Suspense, lazy } from "react";
import {useNwpProductsContext} from "../hooks/useNwpProductsContext";


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
const handleUpdate = (key, chartRef, currentProducts, updateSeries) => {
  if (chartRef.current && currentProducts.products[key]) {
    console.log("updating series for", key);
    updateSeries(chartRef.current, currentProducts.products[key]);
  }
};


const LineChart = (
  {
    initializeChart, 
    updateSeries, 
    onClickLegend,
    onPointerOverLegend,
    onPointerOutLegend
  }) => {


  const chartRef = useRef(null);
  // const legendRef = useRef(null);
  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();

  // useEffect(() => {
  //   console.log("LineChart useEffect")
  //   if (chartRef.current) {
  //     console.log("updating series")
  //     updateSeries(chartRef.current,currentProducts.products)
  //   }
  //   else{
  //     console.log("initializeChart")
  //     chartRef.current = initializeChart('chartdiv', currentProducts.products,onClickLegend,onPointerOverLegend,onPointerOutLegend)
  //   }
  //   return () => {
  //     if (chartRef.current && !currentProducts.isModalOpen){
  //       console.log("unmounting chart");
  //       chartRef.current && chartRef.current.dispose();
  //       nwpActions.resetProducts();
  //     }      
  //   }  
  // }, [currentProducts.products]); // Ensure re-run if data changes

  useEffect(() => {

    console.log("initializeChart")
    chartRef.current = initializeChart('chartdiv', currentProducts.products,onClickLegend,onPointerOverLegend,onPointerOutLegend)
    return () => {
      if (chartRef.current && !currentProducts.isModalOpen){
        console.log("unmounting chart");
        chartRef.current && chartRef.current.dispose();
        nwpActions.resetProducts();
      }      
    }  
  }, []);


  // useEffect(() => {
  //   console.log("LineChart useEffect")
  //   if (chartRef.current) {
  //     console.log("updating series")
  //     updateSeries(chartRef.current,currentProducts.products)
  //   }
  //   return () => {
  //     if (chartRef.current && !currentProducts.isModalOpen){
  //       console.log("unmounting chart");
  //       chartRef.current && chartRef.current.dispose();
  //       nwpActions.resetProducts();
  //     }      
  //   }  
  // }, [
  //   currentProducts.products.analysis_assimilation.data,
  //   currentProducts.products.short_range.data,
  //   currentProducts.products.long_range_ensemble_mean.data,
  //   currentProducts.products.long_range_ensemble_member_1.data,
  //   currentProducts.products.long_range_ensemble_member_2.data,
  //   currentProducts.products.long_range_ensemble_member_3.data,
  //   currentProducts.products.long_range_ensemble_member_4.data,
  //   currentProducts.products.medium_range_ensemble_mean.data,
  //   currentProducts.products.medium_range_blend.data,
  //   currentProducts.products.medium_range_ensemble_member_1.data,
  //   currentProducts.products.medium_range_ensemble_member_2.data,
  //   currentProducts.products.medium_range_ensemble_member_3.data,
  //   currentProducts.products.medium_range_ensemble_member_4.data,
  //   currentProducts.products.medium_range_ensemble_member_5.data,
  //   currentProducts.products.medium_range_ensemble_member_6.data,
  // ]); // Ensure re-run if data changes



  useEffect(() => {
    console.log("LineChart useEffect");
  
    productKeys.forEach(key => {
      handleUpdate(key, chartRef, currentProducts, updateSeries);
    });
  
    return () => {
      if (chartRef.current && !currentProducts.isModalOpen) {
        console.log("unmounting chart");
        chartRef.current.dispose();
        nwpActions.resetProducts();
      }
    };
  }, [...productKeys.map(key => currentProducts.products[key])]); // Include isModalOpen in the dependency array

  // needs double check if the modal is close then delete it
  useEffect(() => {
    console.log("LineChart useEffect");
  
    if(chartRef.current && !currentProducts.isModalOpen){
      console.log("unmounting chart");
      chartRef.current.dispose();
      nwpActions.resetProducts();
    }
  
  }, [currentProducts.isModalOpen]) 

 return (
    <div id="chartdiv" style={{ width: "90vh", height: "700px" }}></div>
 )

}
export default LineChart;