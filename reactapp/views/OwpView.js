import React, { Fragment, useEffect,useState } from 'react';
import Map from '../features/Map/components/Map';
import { onClickStreamFlowLayerHandler } from "lib/mapEvents"
import { useNwpProducts } from 'features/NwpProducts/hooks/useNWPProducts';
import ChartModalView from './modals/ChartModalView';

import appAPI from 'services/api/app';

import {handleMessage} from 'lib/consumerMessages'
// import { AddRegionForm } from 'features/RegionsForms/components/AddRegionForm';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { Regions } from 'features/Regions/components/Regions';
import { useMapContext } from 'features/Map/hooks/useMapContext'; //be careful with the import






const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';


const OWPView = () => {

  const { 
    currentProducts, 
    updateProductsState, 
    resetProducts, 
    updateCurrentGeometry, 
    updateCurrentMetadata,
    handleModalState,
    toggleProduct,
    updateCurrentStationID
  } = useNwpProducts();

  
  const {state,actions} = useWebSocketContext();
  const { state:mapState, actions: mapActions } = useMapContext();

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
            events: [
              {
                'type': 'click', 
                'handler': (layer,event)=>{
                  onClickStreamFlowLayerHandler(
                    layer,
                    event,
                    currentProducts,
                    resetProducts,
                    updateCurrentGeometry,
                    updateCurrentMetadata,
                    handleModalState,
                    appAPI.getForecastData,
                    updateCurrentStationID,
                    mapActions
                  )}
              }
            ],
            priority: 1      
        }
    }
  ]




  useEffect(() => {
    // console.log("changing messages");
    console.log(state);
    actions.addMessageHandler(
      (event)=>{handleMessage(event,updateProductsState,handleModalState)}
    )
    layersArray.forEach(layer => {
      mapActions.addLayer(layer);
    })
  }, []);

  //useEffect to request data from the API based on the requested products
  useEffect(() => {
    // send the api data here
    // console.log(currentProducts.state.products);
    const requestedProducts = {}
    if(currentProducts.state.currentStationID){
      for (const key in currentProducts.state.products) {
        const nestedObject = currentProducts.state.products[key];
        if (nestedObject['is_requested'] === true && nestedObject['data'].length === 0) {
          requestedProducts[key] = nestedObject;
        }
      }
      let dataRequest = {
        station_id: currentProducts.state.currentStationID,
        products: requestedProducts
      }
      // console.log("requesting getForecastData")
      appAPI.getForecastData(dataRequest);
    }
  }, [currentProducts.state.products.analysis_assim.is_requested,
      currentProducts.state.products.short_range.is_requested,
      currentProducts.state.products.long_range_ensemble_mean.is_requested,
      currentProducts.state.products.long_range_ensemble_member_1.is_requested,
      currentProducts.state.products.long_range_ensemble_member_2.is_requested,
      currentProducts.state.products.long_range_ensemble_member_3.is_requested,
      currentProducts.state.products.long_range_ensemble_member_4.is_requested,
      currentProducts.state.products.medium_range_ensemble_mean.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_1.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_2.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_3.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_4.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_5.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_6.is_requested,
      currentProducts.state.products.medium_range_ensemble_member_7.is_requested    
    ]);

  
  return (
    <Fragment>
          <ChartModalView 
            modal={currentProducts.state.isModalOpen} 
            setModal={handleModalState} 
            data={currentProducts.state.products}
            metadata={currentProducts.state.currentMetadata}
            onChange={toggleProduct}
          />
          <Regions/>
    </Fragment>
  );
};

export default OWPView;
