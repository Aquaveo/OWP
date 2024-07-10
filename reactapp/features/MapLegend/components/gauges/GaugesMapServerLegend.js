import React, { Suspense } from 'react';
import { LegendComponent } from './BaseLegend';  // BaseLegend.js
import {ArcgisMapServerLegendContainer} from './ArcgisMapServerLegendContainer.styled';

const GaugesMapServerLegend = ({ 
    layer, 
    layerIndex, 
    title 
}) => {

    return (
        <ArcgisMapServerLegendContainer>
            <Suspense fallback={<div>Loading legends...</div>}>
                <LegendComponent layer={layer} layerIndex={layerIndex} title={title} /> 
            </Suspense>
        </ArcgisMapServerLegendContainer>
    );
};


export {GaugesMapServerLegend};