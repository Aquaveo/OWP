import React, { useEffect , useRef } from 'react';
import MapContext from 'components/map/MapContext';
import { MapContainer } from './styles/Map.styled';
import { onClickHandler,filterLayersNotInMap,addLayer,removeLayer,getLayerToRemove,getClickEventLayers } from '../lib/mapUtils';
import { useMap } from '../hooks/useMap';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
export const MapProvider = ({ children,layers }) => {
  const {state,actions} = useMap();

  const mapRef = useRef();

  useEffect(() => {
    // added the map to the reference
    state.state.mapObject.setTarget(mapRef.current);
    // Define the click handler of the layer
    state.state.mapObject.on('click',onClickHandler)

    // Define the loading handler of the map object
    state.state.mapObject.on('loadstart', function () {
      actions.toggle_loading_layers();
    });
    state.state.mapObject.on('loadend', function () {
      actions.toggle_loading_layers();
    });
    // state.state.mapObject.on('pointermove', (e) => {
    //   console.log("pointer move");
    //   // const pixel = state.state.mapObject.getEventPixel(e.originalEvent);
    //   let layers = []
    //   state.state.mapObject.forEachLayerAtPixel(
    //     e.pixel,
    //     layer => {
    //       if(layer.get('events').length > 0 && layer.get('events').findIndex(event => event.type === 'click') > -1){
    //         state.state.mapObject.getTargetElement().style.cursor = 'pointer'
    //         layers.push(layer);
            
    //       }
    //     }
    //   )
    //   console.log("layers",layers.length);
    // });

    // adding layers 
    layers.forEach(layer => {
      console.log("adding layer to store", layer);
      actions.addLayer(layer);
    });

  }, []);

  useEffect(() => {
    if (state.state.layers.length === 0 ) return;
    console.log("layers changed", state.state.layers);
    const layersToRemove = getLayerToRemove(state.state.mapObject, state.state.layers);
    if (layersToRemove.length > 0){
      layersToRemove.forEach(layer => {
        removeLayer(state.state.mapObject,layer);
      });
    }
    else{
      const layersToAdd = filterLayersNotInMap(state.state.mapObject, state.state.layers);
      layersToAdd.forEach(layerInfo => {
        addLayer(state.state.mapObject,layerInfo);
      });
    }


    return () => {

    };
  // Ensures the hook re-runs only if the map or layer reference changes
  }, [state.state.layers]);



  return (
  <MapContainer>
    <MapContext.Provider value={{ ...state, actions }}>
        <div ref={mapRef} className="ol-map" >
          {children}
        </div>
        {
          state.state.toggle_loading_layers 
          ?
            <LoadingText id="progress">
              Loading ...
            </LoadingText>
          : <> </>
        }

    </MapContext.Provider>
  </MapContainer>

  );
};