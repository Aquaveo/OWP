import React, { Fragment,useState } from 'react';

import NwmChartModalView from './modals/NwmChartModalView';
import { StreamAnomalyArcgisMapServerLegend } from 'features/MapLegend/components/streamAnomaly/StreamAnomalyArcgisMapServerLegend';
import { GaugesMapServerLegend } from 'features/MapLegend/components/gauges/GaugesMapServerLegend';
import { MapProvider } from 'features/Map/providers/MapProvider';
import NwmProvider from 'features/Nwm/providers/NwmProvider';
import { WebSocketProvider } from 'features/WebSocket/providers/WebSocketProvider';
import layerData from 'lib/layerData';
import { getWsURL } from 'lib/utils';
import MapView from './MapView';
import { MapLegend } from 'features/MapLegend/MapLegend';
const ws = getWsURL();
const layerDataObject = new layerData();

const StreamLayerURL = layerDataObject.getStreamAnomalyLayer().options.url;
const GaugeLayerURL = layerDataObject.getGaugeLayer().options.url;
const GaugeLayer = layerDataObject.getGaugeLayer();
console.log(GaugeLayerURL)
const OWPView = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  return (
    <Fragment>
      <WebSocketProvider url={ws} >
          <NwmProvider>
            <MapProvider>
                <MapView 
                    isLoading={isLoading} 
                    setIsLoading={setIsLoading} 
                />
                <MapLegend>
                  <StreamAnomalyArcgisMapServerLegend 
                      url={StreamLayerURL}
                      layerIndex={1} 
                      title={'National Stream Analysis Anomaly'} 
                    />

                  <GaugesMapServerLegend 
                    url={GaugeLayerURL}
                    layer={GaugeLayer}
                    layerIndex={15} 
                    title={'NWPS River Gauge System'} 
                    /> 
                </MapLegend>


                <NwmChartModalView />
                {/* {currentProducts.isModalOpen && <ChartModalView />} */}
                {/* <Regions/> */}

            </MapProvider>
          </NwmProvider>
      </WebSocketProvider>
    </Fragment>
  );
};

export default OWPView;
