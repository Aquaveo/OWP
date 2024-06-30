import React, { useEffect , useRef } from 'react';
import './map.css';
import MapContext from 'features/Map/contexts/MapContext';
import { filterLayersNotInMap,addLayer,removeLayer,getLayerToRemove } from '../lib/utils';
import { useMap } from '../hooks/useMap';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
export const MapProvider = ({ children,layers }) => {
  const {state,actions} = useMap();

  const mapRef = useRef();

  useEffect(() => {
    // added the map to the reference
    state.state.mapObject.setTarget(mapRef.current);
    // adding layers 
    layers.forEach(layer => {
      ////console.log("adding layer to store", layer);
      actions.addLayer(layer);
    });
    return  () => {
      //console.log("unmounting map");
      actions.reset_map();
    }

  }, []);

  useEffect(() => {
    if (state.state.layers.length === 0 ) return;
    //console.log("layers changed", state.state.layers);
    const layersToRemove = getLayerToRemove(state.state.mapObject, state.state.layers);
    const layersToAdd = filterLayersNotInMap(state.state.mapObject, state.state.layers);
    if (layersToRemove.length > 0){
      layersToRemove.forEach(layer => {
        //console.log("removing layer", layer);
        removeLayer(state.state.mapObject,layer);
      });
    }
    else{
      layersToAdd.forEach(layerInfo => {
        //console.log("adding layer", layerInfo);
        addLayer(state.state.mapObject,layerInfo,actions);

      });
    }


    return () => {
      if (state.state.mapObject) return
      // remove all layers if map was unmounted
      actions.delete_all_layers();
      state.state.mapObject.getAllLayers().forEach(layer => {
        state.state.mapObject.removeLayer(layer);
      })

    };
  // Ensures the hook re-runs only if the map or layer reference changes
  }, [state.state.layers]);

  useEffect(() => {
    if (!state.state.extent) return;
    state.state.mapObject.getView().fit(state.state.extent, {duration: 1300, padding: [50, 50, 50, 50]});
  }, [state.state.extent]);


  return (
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

  );
};