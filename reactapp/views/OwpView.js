import React, { Fragment, useEffect,useState } from 'react';
import Map from '../features/Map/components/Map';
import { onClickStreamFlowLayerHandler } from "lib/mapEvents"
import { useNwpProducts } from 'features/NwpProducts/hooks/useNWPProducts';
import ChartModal from 'features/NwpProducts/components/ChartModal';
import appAPI from 'services/api/app';

import useMessages from 'components/webSocket/useMessages';
import reconnectingSocket from 'components/webSocket/clientws'
import {handleMessage} from 'lib/consumerMessages'
import {useWebSocket} from 'components/webSocket/useWebSocket'

const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';
const WbdMapLayerURL = 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer'


const webSocketHost = process.env.TETHYS_WEB_SOCKET_HOST
const prefix_url = process.env.TETHYS_PREFIX_URL ? `/${process.env.TETHYS_PREFIX_URL.replace(/^\/|\/$/g, '')}/` : '';
const app_root_relative_path = process.env.TETHYS_APP_ROOT_URL_RELATIVE ? `${process.env.TETHYS_APP_ROOT_URL_RELATIVE.replace(/^\/|\/$/g, '')}` : '';


// const ws = 'ws://' + 'localhost:8000/apps/owp' + '/data-notification/notifications/ws/';
const ws = 'ws://' + webSocketHost + prefix_url + app_root_relative_path + '/data-notification/notifications/ws/';
const client = reconnectingSocket(ws);


const OWPView = () => {

  const { 
    currentProducts, 
    updateProductsState, 
    resetProducts, 
    updateCurrentGeometry, 
    updateCurrentMetadata,
    handleModalState,
  } = useNwpProducts();

  const clientWrapper = useWebSocket(client);
  
  const messages = useMessages(client, (event)=>{
    handleMessage(event,updateProductsState)
  });

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
            LAYERS:"show:1,2,3,4,5,6,21"
          },
          // the rest of the attributes are for the definition of the layer
          zIndex: 3,
          name: "StreamFlowMapLayer"
        },
        extraProperties: {
            events: [{'type': 'click', 'handler': (layer,event)=>{
              onClickStreamFlowLayerHandler(
                layer,
                event,
                currentProducts,
                resetProducts,
                updateCurrentGeometry,
                updateCurrentMetadata,
                handleModalState,
                appAPI.getForecastData
              )
            }}],
            priority: 1      
        }
    }
  ]


  useEffect(() => {
    console.log(currentProducts);
  }, [currentProducts.state.products]);


  return (
    <Fragment>
        <Map layers={layersArray} />
        <ChartModal modal={currentProducts.state.isModalOpen} setModal={handleModalState} data={currentProducts.state.products}/>
    </Fragment>
  );
};

export default OWPView;
