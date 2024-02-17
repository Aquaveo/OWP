import { useState } from "react";
import Modal from "components/Modal/Modal";

const ChartModal= ({modal, setModal}) => {
  const Toggle = () => setModal(!modal);

  return (
    <div className="App">
      <button className="clickMe" onClick={() => Toggle()}>
        Modal
      </button>

      <Modal show={modal} close={Toggle} title="Dynamic Title">
        This is modal content
      </Modal>
    </div>
  );
}

export default ChartModal;