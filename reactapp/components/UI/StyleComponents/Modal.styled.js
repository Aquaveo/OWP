import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  &.show {
    visibility: visible;
    opacity: 1;
  }
`;

const ModalBody = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  height: auto;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  transform: translateY(-600px);
  transition: all 0.4s ease;

  &.show {
    transform: translateY(0);
  }

  header, .modalBody_content, footer {
    position: relative;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    cursor: pointer;

    img {
      width: 1rem;
      height: auto;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .modal_content, .modal_footer {
    border-bottom: 1px solid #dddddd;
    padding: 2rem 0;
  }

  .modal_footer {
    padding-bottom: 0;

    button {
      float: right;
      padding: 0.5rem;
      border-radius: 8px;
      border: none;
      outline: none;
      cursor: pointer;

      &.submit {
        margin-right: 1rem;
        background-color: #364348;
        color: #fff;

        &:hover {
          background-color: rgba(54, 67, 72, 0.8);
        }
      }

      &.modal-close {
        background-color: transparent;
        font-weight: 600;

        &:hover {
          color: rgba(54, 67, 72, 0.8);
        }
      }
    }
  }
`;

export { ModalContainer, ModalBody };