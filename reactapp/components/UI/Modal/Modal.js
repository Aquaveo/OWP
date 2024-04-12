// for more information please:
//https://github.com/codebucks27/React-reusable-components
//live demo of that at  https://react-reusable-components.vercel.app/
// article explaining: https://dev.to/codebucks/how-to-create-an-efficient-modal-component-in-react-using-hooks-and-portals-360p
import "./modal.css";
import Close from "./times-solid.svg";
import { createPortal } from "react-dom";
import { ModalBody, ModalContainer } from "../StyleComponents/Modal.styled";

//make footer optional

const Modal = ({ show, close, title, children }) => {
  return createPortal(
    <>
      <div
        className={`modalContainer ${show ? "show" : ""} `}
        onClick={() => close()}
      >
        <div className="modalBody" onClick={(e) => e.stopPropagation()}>
          <header className="modal_header">
            <h2 className="modal_header-title">{title}</h2>
            <button className="close" onClick={() => close()}>
              <img src={Close} alt="close" />
            </button>
          </header>
          <main className="modal_content">{children}</main>
          {/* <footer className="modal_footer">
            <button className="modal-close" onClick={() => close()}>
              Cancel
            </button>
            <button className="submit">Submit</button>
          </footer> */}
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default Modal;