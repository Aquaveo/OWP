import React, { Suspense } from 'react';
import {ArcgisMapServerLegendContainer} from './ArcgisMapServerLegendContainer.styled';  // CSS module
import { LegendComponent } from './BaseLegend';  // BaseLegend.js

const ArcgisMapServerLegend = ({ url, layerIndex, title }) => {
    return (
        <ArcgisMapServerLegendContainer>
            <Suspense fallback={<div>Loading legends...</div>}>
                <LegendComponent url={url} layerIndex={layerIndex} title={title} /> 
            </Suspense>
        </ArcgisMapServerLegendContainer>
    );
};


export {ArcgisMapServerLegend};