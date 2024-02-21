import Modal from "components/UI/Modal/Modal";
import Chart from '../../features/NwpProducts/components/Chart';
import { initializeChart, updateSeries, onPointerOver, onPointerOut} from "lib/chartFunctions";


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
        <Chart 
            data={data}
            metadata={metadata} 
            initializeChart={initializeChart} 
            updateSeries={updateSeries} 
            onClickLegend={onChange} 
            onPointerOverLegend={onPointerOver}
            onPointerOutLegend={onPointerOut}
            />
    </Modal>

  )
}

export default ChartModalView;