import React, { useMemo,useState } from 'react';
import { LegendUtil } from './utils';
import { useMapContext } from 'features/Map/hooks/useMapContext';
const legendUtil = new LegendUtil();

const LegendComponent = ({ layer, layerIndex,title }) => {
    const resource = useMemo(() => legendUtil.createResource(`${layer.options.url}/legend?f=pjson`), [layer.options.url]);
    const [isChecked, setIsChecked] = useState(true);    
    const dataResource = resource.read();
    const legends = useMemo(() => legendUtil.processStreamAnomalyLegendData(dataResource, layerIndex), [dataResource, layerIndex, legendUtil.processStreamAnomalyLegendData]);
    const {state:mapState, actions:mapactions} = useMapContext();

    const handleOnLegendChange = (event) => {
        setIsChecked(event.target.checked);

        if(event.target.checked){
            // console.log('Checkbox checked:', event.target.checked);
            mapactions.addLayer(layer)
        }
        else{
            mapactions.delete_layer_by_name(layer.options.name)
        }
    };
    return (
        <div className="legendBox svelte-1x3cf1v">
                <div className='legendTitle'>
                    <input type="checkbox" onChange={handleOnLegendChange} checked={isChecked} />
                    <h6>{title}</h6>
                </div>
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