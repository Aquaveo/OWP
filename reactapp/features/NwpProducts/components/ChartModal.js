import { useState } from "react";
import Modal from "components/Modal/Modal";

const ChartModal= ({modal, setModal}) => {
  const Toggle = () => setModal(!modal);

  return (
      <Modal show={modal} close={Toggle} title="Dynamic Title">
        This is modal content
      </Modal>
  );
}

export default ChartModal;