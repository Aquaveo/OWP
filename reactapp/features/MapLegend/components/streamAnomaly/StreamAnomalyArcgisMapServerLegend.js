import React, { Suspense } from 'react';
import { LegendComponent } from './BaseLegend';  // BaseLegend.js
import {ArcgisMapServerLegendContainer} from './ArcgisMapServerLegendContainer.styled';

const StreamAnomalyArcgisMapServerLegend = ({ url, layerIndex, title }) => {
    return (
        <ArcgisMapServerLegendContainer>
            <Suspense fallback={<div></div>}>
                <LegendComponent url={url} layerIndex={layerIndex} title={title} /> 
            </Suspense>
        </ArcgisMapServerLegendContainer>
    );
};


export {StreamAnomalyArcgisMapServerLegend};