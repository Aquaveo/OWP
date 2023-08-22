import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";


const CHART_ID = 'population_chart';

export const LineChart = ({chartId}) => {
  return <div 
    id={chartId || CHART_ID} 
    style={{ 
      width: '100%', 
      height: '300px', 
      margin: '50px 0' 
    }}
  />
};