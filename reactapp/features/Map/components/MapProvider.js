import React, { useEffect , useRef } from 'react';
import MapContext from 'components/map/MapContext';
import "./Map.css";
import { MapContainer } from './styles/Map.styled';
import { onClickHandler,filterLayersNotInMap,addLayer,removeLayer,getLayerToRemove } from '../lib/mapUtils';
import { useMap } from '../hooks/useMap';
export const MapProvider = ({ children,layers }) => {
  const {state,actions} = useMap();

  const mapRef = useRef();

  useEffect(() => {
    // added the map to the reference
    state.state.mapObject.setTarget(mapRef.current);
    // Define the click handler of the layer
    state.state.mapObject.on('click',onClickHandler)

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
    </MapContext.Provider>
  </MapContainer>

  );
};