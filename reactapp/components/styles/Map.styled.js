import styled from "styled-components";

export const MapContainer = styled.div`
    & .ol-map{
        width: 100%;
        height: 100%;
        width: 100%;
    }
    flex:1 1 60%;
    order: 1;

    width: 100%;
    overflow-y: hidden;
    position:absolute;
    
    height: ${props => (props.isFullMap ? '100%' : '60%')};

    #progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 0;
        box-shadow: 0px 0px 1px 2px rgb(255,204,0);
        width: 0;
        transition: width 250ms;
    }
    .wrapper {
        position: relative;
    }
`;