import { useEffect ,useRef} from "react";
import {useNwmContext} from "../hooks/useNwmContext";
import { NWMGaugeChart } from "../lib/GaugeChartUtils";

const nmwGaugeChart = new NWMGaugeChart();

const GaugeChart = ({}) => {
  const chartRef = useRef(null);
  const legendContainerRef = useRef(null);
  const {state:nwmState, actions:nwpActions} = useNwmContext();

  useEffect(() => {
    if (chartRef.current && nwmState.isModalOpen) return 
    
    const title = nwmState.gauges.currentGaugeID    
    const subtitle = nwmState.reaches.currentMetadata['location']
    
    chartRef.current = nmwGaugeChart.initializeChart(
      'chart-gauges-div',
      title, 
      subtitle
    )
    
    nmwGaugeChart.initializeLegend(
      chartRef.current.root,
      chartRef.current,
      nwpActions.toggleGaugeData
    )

    legendContainerRef.current = nmwGaugeChart.getLegendContainer(chartRef.current.root)
    
    return () => {
    
      if (chartRef.current && !nwmState.isModalOpen){
        chartRef.current && chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetGauges();
      }      
    }  
  }, []);

  useEffect(() => {
    console.log(nwmState.gauges.gauge_forecast)
    nmwGaugeChart.handleUpdate('gauge_forecast', chartRef, nwmState.gauges,legendContainerRef.current,nwpActions.toggleGaugeData);
    return () => {
      if (chartRef.current && !nwmState.isModalOpen) {
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetGauges();
      }
    };
  }, [nwmState.gauges.gauge_forecast]);

  useEffect(() => {
    console.log(nwmState.gauges.gauge_observed)

    nmwGaugeChart.handleUpdate('gauge_observed', chartRef, nwmState.gauges,legendContainerRef.current,nwpActions.toggleGaugeData);
    return () => {
      if (chartRef.current && !nwmState.isModalOpen) {
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetGauges();
      }
    };
  }, [nwmState.gauges.gauge_observed]);

  // commented out because cleans the tab
  useEffect(() => {
    return () => {
      if (!nwmState.isModalOpen) {
        console.log("cleaning modal gauge chart because modal has closed")
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetGauges();
      }
    };
  }, [nwmState.isModalOpen]);

  // commented out because cleans the tab
  useEffect(() => {
    return () => {
      if (!nwmState.gauges.display) {
        console.log("cleaning modal gauge chart because display is false")
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetGauges();
      }
    };
  }, [nwmState.gauges.display]);


 return (  
    <div id='chart-gauges-div' style={{ width: "100vh", height: "600px" }}></div>
 )

}
export default GaugeChart;