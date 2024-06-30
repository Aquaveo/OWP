import React, { Fragment,useState } from 'react';

import NwpStreamsChartModalView from './modals/NwpStreamsModalView';
import { ArcgisMapServerLegend } from 'components/MapLegend/ArcgisMapServerLegend';
import { MapProvider } from 'features/Map/providers/MapProvider';
import NwpProductsProvider from 'features/NwpProducts/providers/NwpProductsProvider';
import { WebSocketProvider } from 'features/WebSocket/providers/WebSocketProvider';
import layerData from 'lib/layerData';
import { getWsURL } from 'lib/utils';

import MapView from './MapView';
const ws = getWsURL();
const layerDataObject = new layerData();

const StreamLayerURL = layerDataObject.getStreamAnomalyLayer().options.url;

const OWPView = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  return (
    <Fragment>
      <WebSocketProvider url={ws} >
          <NwpProductsProvider>
            <MapProvider>
                <MapView 
                    isLoading={isLoading} 
                    setIsLoading={setIsLoading} 
                />
                <ArcgisMapServerLegend 
                  url={StreamLayerURL}
                  layerIndex={1} 
                  title={'National Stream Analysis Anomaly'} 
                />
                <NwpStreamsChartModalView />
                {/* {currentProducts.isModalOpen && <ChartModalView />} */}
                {/* <Regions/> */}

            </MapProvider>
          </NwpProductsProvider>
      </WebSocketProvider>
    </Fragment>
  );
};

export default OWPView;
