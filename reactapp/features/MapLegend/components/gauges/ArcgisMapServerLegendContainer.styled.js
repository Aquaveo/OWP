import styled from "styled-components";

export const ArcgisMapServerLegendContainer = styled.div`

    z-index: 1000;
    position: absolute;
    bottom: 0.5rem;
    left:0.5rem;
    background-color: white;
    opacity: 0.8;
    padding: 0.5rem;
    border-radius: 0.5rem;

    .legendBox {
        padding: 10px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .legendTitle {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .legendTitle h6 {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
    }


    .legendBox figure {
        display: flex;
        align-items: center;
        margin: 5px 0;
    }

    .legendBox img {
        margin-right: 10px;
    }

    .legendBox figcaption {
        font-size: 14px;
        color: #333;
    }
`;