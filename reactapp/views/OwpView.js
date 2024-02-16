import React, { Fragment, useEffect } from 'react';

import Map from '../features/Map/components/Map';

import { onClickStreamFlowLayerHandler } from "lib/mapEvents"

import { useNwpProducts } from 'features/NwpProducts/hooks/useNWPProducts';

const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';
const WbdMapLayerURL = 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer'

const OWPView = () => {
  const { currentProducts, 
    updateProductsState, 
    resetProducts, 
    updateCurrentGeometry, 
    updateCurrentMetadata 
  } = useNwpProducts();
  

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
                updateCurrentMetadata
              )
            }}],
            priority: 1      
        }
    }
  ]

  useEffect(() => {
    console.log(currentProducts);
  }, [currentProducts]);

  return (
    <Fragment>
        <Map layers={layersArray} />
    </Fragment>
  );
};

export default OWPView;
