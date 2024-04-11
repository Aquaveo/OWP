import React, { Fragment, useEffect,useState, lazy, Suspense,useCallback } from 'react';
import { onClickStreamFlowLayerHandler } from "lib/mapEvents"
import ChartModalView from './modals/ChartModalView';

import appAPI from 'services/api/app';

import {handleMessage} from 'lib/consumerMessages'
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { Regions } from 'features/Regions/components/Regions';
import { useMapContext } from 'features/Map/hooks/useMapContext'; //be careful with the import 
import { useNwpProductsContext } from 'features/NwpProducts/hooks/useNwpProductsContext';




const StreamLayerURL = 'https://mapservices.weather.noaa.gov/vector/rest/services/obs/NWM_Stream_Analysis/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';


const OWPView = () => {
  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();
  const {state:webSocketState,  actions:webSocketActions} = useWebSocketContext();
  const {actions: mapActions } = useMapContext();

  
  const updateProductsMessageListener = useCallback((event) => {
    handleMessage(event, nwpActions.updateProductsState, nwpActions.handleModalState,nwpActions.setProductsLoading);
  }, []);

  // add more layers here if needed
  const layersArray = [
    {
        layerType: 'OlTileLayer',
        options: {
        sourceType: 'ArcGISRestTile',
        url: baseMapLayerURL,
        // all the params for the source goes here
        params: {
            LAYERS: 'topp:states',
            Tiled: true,
        },
        // the rest of the attributes are for the definition of the layer
        name: "baseMapLayer",
        },
        extraProperties: {
        events: [],
        priority: 1      
        }    
    },
    {
        layerType: 'OlImageTileLayer',
        options: {
          sourceType: 'TileImageArcGISRest',
          url: StreamLayerURL,
          // all the params for the source goes here
          params: {
            LAYERS:"show:0,7,14,21"
          },
          // the rest of the attributes are for the definition of the layer
          zIndex: 3,
          name: "StreamFlowMapLayer"
        },
        extraProperties: {
            events: [
              {
                'type': 'click', 
                'handler': (layer,event)=>{
                  onClickStreamFlowLayerHandler(
                    layer,
                    event,
                    currentProducts,
                    nwpActions.resetProducts,
                    nwpActions.updateCurrentGeometry,
                    nwpActions.updateCurrentMetadata,
                    nwpActions.handleModalState,
                    appAPI.getForecastData,
                    nwpActions.updateCurrentStationID,
                    nwpActions.setProductsLoading,
                    mapActions
                  )}
              }
            ],
            priority: 1      
        }
    }
  ]


  useEffect(() => {

    webSocketActions.addMessageHandler(
      updateProductsMessageListener
    )

    //adding layers
    layersArray.forEach(layer => {
      mapActions.addLayer(layer);
    })
    // remove the layers wheen the component unmounts
    return () => {
      webSocketState.client.off(updateProductsMessageListener)  

      //delete added layers when unmounting
      layersArray.forEach(layer => {
        mapActions.delete_layer_by_name(layer.options.name)
      })
    }


  }, []);


  
  return (
    <Fragment>
        {currentProducts.isModalOpen && <ChartModalView />}
        <Regions/>
    </Fragment>
  );
};

export default OWPView;
