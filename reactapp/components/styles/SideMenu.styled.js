import styled from "styled-components";

export const SideMenu = styled.div`

    p {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    .accordeon-body-custom{
      background-color: rgba(22, 160, 133, 0.5608);
      color: #e0f2fe;
    }
    .accordion-header button{
      background-color: rgba(22, 160, 133, 0.5608);
      color: #e0f2fe;

    }
    .wrapper_absolute{
        display:  ${props => props.isVisible ? "block" : "none"};
        z-index:300;
        position:absolute;
        padding:5px;
        width: 100% !important;;
        // background-color:rgba(12, 74, 110, 0.5);
        // border-color: blue;
        // color:#e0f2fe;
        font-size:1rem;
        border-radius: 10px;
        overflow-x: hidden;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
        margin-top: 10px;
        filter: opacity(0.8);
        
    }
    /* 30% width on medium, large, and extra-large screens */
    @media (min-width: 768px) {
      .wrapper_absolute {
        width: 35% !important;
      }
    }
    /* Style for Webkit-based browsers (Chrome, Safari) */
    .wrapper_absolute::-webkit-scrollbar {
      width: 0; /* Hide the scrollbar in Webkit-based browsers */
    }
    .buttons-menu{
      display: flex;
      justify-content: end;
    }
    .row-form-menu{
      padding-bottom: 10px;
    }
`;