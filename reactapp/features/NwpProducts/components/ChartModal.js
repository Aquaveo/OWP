import Modal from "components/Modal/Modal";
import Chart from './Chart';


const ChartModal= ({modal, setModal, data }) => {
  const Toggle = () => setModal(!modal);

  return (
    <Modal show={modal} close={Toggle} title="Dynamic Title">
      <Chart data={data} />
    </Modal>

  )
}

export default ChartModal;