import { Fragment, useEffect ,useRef,Suspense, lazy } from "react";
import {useNwmContext} from "../hooks/useNwmContext";
import { NWMReachChart } from "../lib/ReachChartUtils"

const nwmReachChart = new NWMReachChart();
const productKeys = nwmReachChart.getforecastNames();

const ReachChart = ({}) => {
  const chartRef = useRef(null);
  const legendContainerRef = useRef(null);
  const {state:nwmState, actions:nwpActions} = useNwmContext();

  useEffect(() => {
    if (chartRef.current && nwmState.isModalOpen) return 
    
    const title = nwmState.reaches.currentMetadata[0]    
    const subtitle = nwmState.reaches.currentMetadata[1]
    
    chartRef.current = nwmReachChart.initializeChart(
      'chartdiv',
      title, 
      subtitle
    )
    
    nwmReachChart.initializeLegend(
      chartRef.current.root,
      chartRef.current,
      nwpActions.toggleReachProduct
    )

    legendContainerRef.current = nwmReachChart.getLegendContainer(chartRef.current.root)
    
    return () => {
    
      if (chartRef.current && !nwmState.isModalOpen){
        chartRef.current && chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetReaches();
      }      
    }  
  }, []);

  useEffect(() => {

    productKeys.forEach(key => {
      nwmReachChart.handleUpdate(key, chartRef, nwmState.reaches,legendContainerRef.current,nwpActions.toggleReachProduct);
    });
    return () => {
      if (chartRef.current && !nwmState.isModalOpen) {
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();

        nwpActions.resetReaches();
      }
    };
  }, [...productKeys.map(key => nwmState.reaches.products[key])]);

  // commented out because cleans the tab
  useEffect(() => {
    return () => {
      if (!nwmState.isModalOpen) {
        console.log("cleaning modal reach chart")
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetReaches();
      }
    };
  }, [nwmState.isModalOpen]);
  

 return (  
    <div id="chartdiv" style={{ width: "100vh", height: "600px" }}></div>
 )

}
export default ReachChart;