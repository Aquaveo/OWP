import React, { Fragment, useEffect, useCallback } from 'react';
// import ChartModalView from './modals/NwpStreamsModalView';
// import {handleMessage} from 'lib/consumerMessages'
// import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
// import { Regions } from 'features/Regions/components/Regions';
// import { useNwpProductsContext } from 'features/NwpProducts/hooks/useNwpProductsContext';
import NwpStreamsChartModalView from './modals/NwpStreamsModalView';
import { ArcgisMapServerLegend } from 'components/MapLegend/ArcgisMapServerLegend';
import { MapProvider } from 'features/Map/providers/MapProvider';
import NwpProductsProvider from 'features/NwpProducts/providers/NwpProductsProvider';
import { WebSocketProvider } from 'features/WebSocket/providers/WebSocketProvider';
import { layerData } from 'lib/layerData';
import { getWsURL } from 'lib/utils';

import MapView from 'features/Map/views/MapView';

const ws = getWsURL();
const layerDataObject = new layerData();

const StreamLayerURL = layerDataObject.getStreamAnomalyLayer().options.url;

const OWPView = () => {
  // const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();
  // const {state:webSocketState,  actions:webSocketActions} = useWebSocketContext();

  
  // const updateProductsMessageListener = useCallback((event) => {
  //   handleMessage(event, nwpActions.updateProductsState, nwpActions.handleModalState,nwpActions.setProductsLoading);
  // }, []);


  // useEffect(() => {

  //   webSocketActions.addMessageHandler(
  //     updateProductsMessageListener
  //   )

  //   // remove the layers wheen the component unmounts
  //   return () => {
  //     webSocketState.client.off(updateProductsMessageListener)
  //   }


  // }, []);


  
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
