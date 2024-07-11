import React, { useMemo,useState } from 'react';
import { LegendUtil } from './utils';
import { useMapContext } from 'features/Map/hooks/useMapContext';
const legendUtil = new LegendUtil();

const LegendComponent = ({ layer, layerIndex,title }) => {
    const resource = useMemo(() => legendUtil.createResource(`${layer.options.url}/legend?f=pjson`), [layer.options.url]);
    const [isChecked, setIsChecked] = useState(false);   
    const dataResource = resource.read();
    const legends = useMemo(() => legendUtil.processGaugeLegendData(dataResource, layerIndex), [dataResource, layerIndex, legendUtil.processStreamAnomalyLegendData]);
    const {state:mapState, actions:mapctions} = useMapContext();

    const handleOnLegendChange = (event) => {
        setIsChecked(event.target.checked);
        if(event.target.checked){
            // console.log('Checkbox checked:', event.target.checked);
            mapctions.addLayer(layer)
        }
        else{
            mapctions.delete_layer_by_name(layer.options.name)
        }
    };

    return (
        <div className='legendBox'>
            <div className='legendTitle'>
                <input type="checkbox" onChange={handleOnLegendChange} checked={isChecked} />
                <h6>{title}</h6>
            </div>
                {legends.map((legend, index) => (
                    <figure key={index} >
                        <img src={legend.src} alt={`Legend of Observed Guages: ${legend.label}`} />
                        <figcaption >{legend.label}</figcaption>
                    </figure>
                ))}
        </div>

    );
};

export { LegendComponent }