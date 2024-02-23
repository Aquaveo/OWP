import React, { Fragment, useEffect,Suspense } from 'react';
import Modal from "components/UI/Modal/Modal";
// import LineChart from '../../features/NwpProducts/components/LineChart';
import { initializeChart, updateSeries, onPointerOver, onPointerOut} from "lib/chartFunctions";

const LineChart = React.lazy(() => import('../../features/NwpProducts/components/LineChart'));

const ChartModalView = ({
  modal, 
  setModal, 
  data,
  metadata,
  onChange 
}) => {
  const Toggle = () => setModal(!modal);


  return (
    <Modal show={modal} close={Toggle} title="">
        <Suspense fallback={<div>LOADING.....</div>}>
          <LineChart 
              data={data}
              metadata={metadata} 
              initializeChart={initializeChart} 
              updateSeries={updateSeries} 
              onClickLegend={onChange} 
              onPointerOverLegend={onPointerOver}
              onPointerOutLegend={onPointerOut}
          />
        </Suspense>
    </Modal>

  )
}

export default ChartModalView;