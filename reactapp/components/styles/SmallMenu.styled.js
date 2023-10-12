import styled from "styled-components";

export const SmallMenu = styled.div`
    // display: block;
    display:  ${props => props.isVisible ? "block" : "none"};

    height: fit-content;
    flex:1 1 20%;
    order: 1;
    overflow-y: hidden;
    padding:5px;
    position:absolute;
    z-index:300;
    right: 10px;
    margin-top: 56px;
    // ${props => `${props.position}: 60px`};

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
        background-color: rgba(22, 160, 133, 0.5608);
        // background-color:rgba(12, 74, 110, 0.5);
        // border-color: blue;
        color:#e0f2fe;
        font-size:1rem;
        border-radius: 10px;

    }
    .buttons-menu{
      display: flex;
      justify-content: end;
    }
    .row-form-menu{
      padding-bottom: 10px;
    }
`;