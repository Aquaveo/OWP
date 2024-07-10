import React from 'react';
import { MapLegendsContainer } from './MapLegendsContainer.styled'; // Adjust the import path as needed


const MapLegend = ({children}) => {
    return (
        <MapLegendsContainer>
            { children }
        </MapLegendsContainer>
    );
};

export { MapLegend };