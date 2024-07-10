import styled from "styled-components";

export const ArcgisMapServerLegendContainer = styled.div`


    .legendBox {
        padding: 10px;
        background-color: #f9f9f9;
        // border: 1px solid #ccc;
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