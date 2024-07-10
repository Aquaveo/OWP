import React, { Suspense } from 'react';
import { LegendComponent } from './BaseLegend';  // BaseLegend.js
import {ArcgisMapServerLegendContainer} from './ArcgisMapServerLegendContainer.styled';

const StreamAnomalyArcgisMapServerLegend = ({ layer, layerIndex, title }) => {
    return (
        <ArcgisMapServerLegendContainer>
            <Suspense fallback={<div></div>}>
                <LegendComponent layer={layer} layerIndex={layerIndex} title={title} /> 
            </Suspense>
        </ArcgisMapServerLegendContainer>
    );
};


export {StreamAnomalyArcgisMapServerLegend};