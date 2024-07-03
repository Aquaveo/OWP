import { Fragment, useEffect ,useRef,Suspense, lazy } from "react";
import {useNwpProductsContext} from "../hooks/useNwpProductsContext";
import { productKeys, handleUpdate,updateSeries, initializeChart } from "../lib/chartAuxiliary";
import { initializeLegend, createLegendContainer, createIndividualLegend } from "../lib/legendAuxiliary";


const StreamsChart = ({}) => {
  const chartRef = useRef(null);
  const legendContainerRef = useRef(null);
  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();

  useEffect(() => {
    if (chartRef.current && currentProducts.isModalOpen) return 
    const title = currentProducts.currentMetadata[0]
    console.log(title)
    const subtitle = currentProducts.currentMetadata[1]
    chartRef.current = initializeChart('chartdiv',title, subtitle) // initialize the chart
    legendContainerRef.current = createLegendContainer(chartRef.current.root,chartRef.current)
    
  
    initializeLegend(chartRef.current.root,chartRef.current,nwpActions.toggleProduct) // add a legend
    return () => {
      console.log("cleaning chart useeffect 1")
      if (chartRef.current && !currentProducts.isModalOpen){
        chartRef.current && chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetProducts();
      }      
    }  
  }, []);

  useEffect(() => {
    // console.log(...productKeys.map(key => currentProducts.products[key]))

    productKeys.forEach(key => {
      handleUpdate(key, chartRef, currentProducts, updateSeries,legendContainerRef.current,nwpActions.toggleProduct);
    });
    return () => {
      console.log("cleaning chart useeffect 2")
      if (chartRef.current && !currentProducts.isModalOpen) {
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();

        nwpActions.resetProducts();
      }
    };
  }, [...productKeys.map(key => currentProducts.products[key])]);

  // useEffect(() => {
  //   console.log(...productKeys.map(key => currentProducts.products[key]))

  //   productKeys.forEach(key => {
  //     handleUpdate(key, chartRef, currentProducts, updateSeries,legendContainerRef.current,nwpActions.toggleProduct);
  //   });
  //   return () => {
  //     if (chartRef.current && !currentProducts.isModalOpen) {
  //       chartRef.current.dispose();
  //       nwpActions.resetProducts();
  //     }
  //   };
  // }, [currentProducts.products.analysis_assimilation]);

  // commented out because cleans the tab
  useEffect(() => {
    console.log("MODAL OPEN")
   if(!currentProducts.isModalOpen){
    console.log("MODAL FALSE")
   }
    return () => {
      
      if (!currentProducts.isModalOpen) {
        console.log("cleaning chart MODAL FALSE")
        chartRef.current.dispose();
        nwpActions.resetProducts();
      }
    };
  }, [currentProducts.isModalOpen]);

 return (  
    <div id="chartdiv" style={{ width: "90vh", height: "900px" }}></div>
 )

}
export default StreamsChart;