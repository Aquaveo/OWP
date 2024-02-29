import {  useContext, useEffect } from "react";
import {Image as ImageLayer } from 'ol/layer.js';
import MapContext from "../../features/Map/contexts/MapContext";
export const OlImageTileLayer = ({ source, name,zIndex=0}) => {
    const { map } = useContext(MapContext);
    useEffect(() => {
      if (!map) return;
      let Ilayer = new ImageLayer({
        source,
        name,
        zIndex
      });

      map.addLayer(Ilayer);
      console.log("add")
      return () => {
          console.log("remove")

          map.removeLayer(Ilayer);
      };
    },[map]);
    return null;
  };