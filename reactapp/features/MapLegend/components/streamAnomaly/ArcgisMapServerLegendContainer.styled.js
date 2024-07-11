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


    .svelte-1x3cf1v{
        display: inline-block;
    }    
    .legendBox.svelte-1x3cf1v {
        width: 100%;
        margin-left: 0.1rem
    }

    .nodataPngTile.svelte-1x3cf1v {
        width: 1.8em;
        height: 2.5em;
        margin-left: 1em
    }

    .pngLegend.svelte-1x3cf1v {
        width: 1.8em;
        height: 2.5em
    }

    figcaption.svelte-1x3cf1v {
        display: table;
        font-size: 8px;
        margin-top: -0.8rem
    }

`;