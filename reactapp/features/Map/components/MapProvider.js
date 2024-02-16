import React, { useReducer, useContext, useEffect , useRef } from 'react';
import { mapReducer, mapInitialStore } from '../store/reducers/mapReducer';
import MapContext from 'components/map/MapContext';
import { MapActionsTypes } from '../store/actions/actionsTypes';
import "./Map.css";
import { MapContainer } from './styles/Map.styled';
import { onClickHandler } from '../lib/mapUtils';

export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, mapInitialStore);
  const mapRef = useRef();
  // The actions can be defined here if you plan to include them in the initial state,
  // but typically, actions are dispatched directly using the dispatch function.
  const actions = {
    addLayer: (layer) => dispatch({ type: MapActionsTypes.add_layer, layer: layer }),
    removeLayer: (layer) => dispatch({ type: MapActionsTypes.removeLayer, layer: layer }),
    // Define other actions here
  };

  useEffect(() => {
    // added the map to the reference
    state.state.mapObject.setTarget(mapRef.current);
    // Define the click handler of the layer
    state.state.mapObject.on('click',onClickHandler)
  }, []);

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