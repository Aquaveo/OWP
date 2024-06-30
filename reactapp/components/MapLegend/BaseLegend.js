import React, { useMemo } from 'react';
import { LegendUtil } from './utils';

const legendUtil = new LegendUtil();

const LegendComponent = ({ url, layerIndex,title }) => {
    const resource = useMemo(() => legendUtil.createResource(`${url}/legend?f=pjson`), [url]);
    const dataResource = resource.read();

    const legends = dataResource.layers[layerIndex].legend
        .filter(portion => portion.label.includes('Stream Order: 10'))
        .map(portion => ({
            src: `data:image/png;base64,${portion.imageData}`,
            label: legendUtil.matcherDict[portion.label.split('Stream Order: 10').join('').trim()]
        }));   
    return (
        <div className="legendBox svelte-1x3cf1v">
            <h6>{title}</h6>
            {legends.map((legend, index) => (
                <figure key={index} className='svelte-1x3cf1v'>
                    <img className='pngLegend svelte-1x3cf1v' src={legend.src} alt={`Legend of Stream flow anomaly: ${legend.label}`} />
                    <figcaption className="svelte-1x3cf1v">{legend.label}</figcaption>
                </figure>
            ))}
        </div>
    );
};

export { LegendComponent }