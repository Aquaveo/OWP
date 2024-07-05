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

    return () => {
      if (chartRef.current && !nwmState.isModalOpen) {
        chartRef.current.dispose();
        legendContainerRef.current && legendContainerRef.current.dispose();
        nwpActions.resetGauges();
      }
    };
  }, []);

  // commented out because cleans the tab
  useEffect(() => {
    return () => {
      if (!nwmState.isModalOpen) {
        chartRef.current.dispose();
        nwpActions.resetGauges();
      }
    };
  }, [nwmState.isModalOpen]);

 return (  
    <div id='chart-gauges-div' style={{ width: '90vh', height: '900px' }}></div>
 )

}
export default GaugeChart;