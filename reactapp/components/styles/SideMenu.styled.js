import styled from "styled-components";

export const SideMenu = styled.div`
    display:  ${props => props.isVisible ? "block" : "none"};
    height: fit-content;
    flex:1 1 20%;
    order: 1;
    overflow-y: hidden;
    padding:5px;
    position:absolute;
    z-index:300;
    bottom:0px;

    .Myhamburguer{
        display: flex;
        justify-content: end;
    }

    p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }
    
    .wrapper_absolute{
        width: fit-content;
        height: fit-content;
        padding: 10px;
        background-color:rgba(12, 74, 110, 0.5);
        border-color: blue;
        color:#e0f2fe;
        font-size:1rem;
    }

    input[type=range] {
        margin: 10px 0;
        -webkit-appearance: none;
        width: 100%;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 0px #000000;
        background: #086654;
        border-radius: 1px;
        border: 0px solid #000000;
      }
      input[type=range]::-webkit-slider-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid #086654;
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #A1D0FF;
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -7px;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        background: #086654;
      }
      input[type=range]::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 0px #000000;
        background: #086654;
        border-radius: 1px;
        border: 0px solid #000000;
      }
      input[type=range]::-moz-range-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid #086654;
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #A1D0FF;
        cursor: pointer;
      }
      input[type=range]::-ms-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      input[type=range]::-ms-fill-lower {
        background: #086654;
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
      }
      input[type=range]::-ms-fill-upper {
        background: #086654;
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
      }
      input[type=range]::-ms-thumb {
        margin-top: 1px;
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid #086654;
        height: 18px;
        width: 18px;
        border-radius: 25px;
        background: #A1D0FF;
        cursor: pointer;
      }
      input[type=range]:focus::-ms-fill-lower {
        background: #086654;
      }
      input[type=range]:focus::-ms-fill-upper {
        background: #086654;
      }

`;