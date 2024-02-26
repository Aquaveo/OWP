import React, { useEffect , useRef } from 'react';
// import { mapReducer, mapInitialStore } from '../store/reducers/mapReducer';
import MapContext from 'components/map/MapContext';
// import { MapActionsTypes } from '../store/actions/actionsTypes';
import "./Map.css";
import { MapContainer } from './styles/Map.styled';
import { onClickHandler,filterLayersNotInMap,addLayer,removeLayer } from '../lib/mapUtils';
import { useMap } from '../hooks/useMap';
export const MapProvider = ({ children,layers }) => {
  const {state,actions} = useMap();
  // const [state, dispatch] = useReducer(mapReducer, mapInitialStore);
    // const actions = {
  //   addLayer: (layer) => dispatch({ type: MapActionsTypes.add_layer, payload: layer }),
  //   removeLayer: (layer) => dispatch({ type: MapActionsTypes.removeLayer, payload: layer }),
  //   // Define other actions here
  // };
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
    console.log("adding layer to map")

    const layersToAdd = filterLayersNotInMap(state.state.mapObject, state.state.layers);
    layersToAdd.forEach(layerInfo => {
      addLayer(state.state.mapObject,layerInfo);
    });
    return () => {
      // layersToAdd.forEach(layerInfo => {
      //   removeLayer(state.state.mapObject,layerInfo);
      // });
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