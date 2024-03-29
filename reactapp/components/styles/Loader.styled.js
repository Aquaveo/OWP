
import styled from "styled-components";

export const LoaderContainer = styled.div`
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: ${props => props.isVisible ? "flex" : "none"};
        flex-direction: column;
        color: white;
        justify-content: center;
        align-items: center;
        z-index: 9999999; /* Adjust the z-index as needed */
    }
    .loading-tex-span{
        width: fit-content;
        font-weight: bold;
        height: fit-content;
        color: #16a085;        
        font-size: 15px;
        padding: 10px;
        animation: blinker 2s linear infinite;
    }
    @keyframes blinker {
        50% {
          opacity: 0.5;
        }
      }
    /* Style for the loading spinner or indicator */
    .loading-spinner {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #16a085;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        animation: spin 1s linear infinite; /* Add a spinning animation */
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }


`;