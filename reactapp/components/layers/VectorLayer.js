import {  useContext, useEffect } from "react";
import OLVectorLayer from "ol/layer/Vector";

import MapContext from "../map/MapContext";

export const VectorLayer = ({ name,source, style, zIndex }) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    console.log("here")
    if (!map) return;
    let vectorLayer = new OLVectorLayer({
      name,
      source,
      style
    });
    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source]);

  return null;
};