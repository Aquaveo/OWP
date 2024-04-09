import { Fragment, useEffect ,useRef,Suspense, lazy } from "react";
import {useNwpProductsContext} from "../hooks/useNwpProductsContext";
import { productKeys, handleUpdate,updateSeries, initializeChart } from "../lib/chartAuxiliary";
import { initializeLegend, createLegendContainer, createIndividualLegend } from "../lib/legendAuxiliary";


const LineChart = ({}) => {
  const chartRef = useRef(null);
  const legendContainerRef = useRef(null);
  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();

  useEffect(() => {
    const title = currentProducts.currentMetadata[0]
    const subtitle = currentProducts.currentMetadata[1]
    chartRef.current = initializeChart('chartdiv',title, subtitle) // initialize the chart
    legendContainerRef.current = createLegendContainer(chartRef.current.root,chartRef.current)
    
  
    initializeLegend(chartRef.current.root,chartRef.current,nwpActions.toggleProduct) // add a legend
    return () => {
      if (chartRef.current && !currentProducts.isModalOpen){
        chartRef.current && chartRef.current.dispose();
        nwpActions.resetProducts();
      }      
    }  
  }, []);

  useEffect(() => {  
    productKeys.forEach(key => {
      handleUpdate(key, chartRef, currentProducts, updateSeries,legendContainerRef.current,nwpActions.toggleProduct);
    });
    return () => {
      if (chartRef.current && !currentProducts.isModalOpen) {
        chartRef.current.dispose();
        nwpActions.resetProducts();
      }
    };
  }, [...productKeys.map(key => currentProducts.products[key])]); // Include isModalOpen in the dependency array

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        nwpActions.resetProducts();
      }
    };
  }, [currentProducts.isModalOpen]);

 return (
    <div id="chartdiv" style={{ width: "90vh", height: "700px" }}></div>
 )

}
export default LineChart;