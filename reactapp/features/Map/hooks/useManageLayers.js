import { useEffect } from "react";
import { useMapContext } from '../hooks/useMapContext'; // Adjust the import path as needed
import { useLayerFactory } from "./useLayerFactory";
// import MapContext from "components/map/MapContext";
// Custom hook for managing a specific layer in an OpenLayers map using useEffect
// Now expecting the entire layer to be passed as a prop
export const useLayer = ({layerType, options}) => {

  const { state, actions } = useMapContext();
  const map = state.mapObject;
  const layer = useLayerFactory({layerType, options});
  
  const addLayer = (layer) => {    
    console.log("Layer added");
    map.addLayer(layer);
    actions.addLayer(layer);
  };

  const removeLayer = (layer) => {
    console.log("Layer removed");
    map.removeLayer(layer);
    actions.removeLayer(layer);
  };  

  useEffect(() => {
    if (!map) return;
    addLayer(layer);
    return () => {
      removeLayer(layer);
    };
  // Ensures the hook re-runs only if the map or layer reference changes
  }, [map]);

  return layer;
  
};