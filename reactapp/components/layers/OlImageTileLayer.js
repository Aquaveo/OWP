import {  useContext, useEffect } from "react";
import {Image as ImageLayer } from 'ol/layer.js';
import MapContext from "../map/MapContext";
export const OlImageTileLayer = ({ source, name,zIndex=0,groupLayerName,groupLayers}) => {
    const { map } = useContext(MapContext);
    useEffect(() => {
      if (!map) return;
      let Ilayer = new ImageLayer({
        source,
        name,
        zIndex
      });
      // if (groupLayerName === 'NWM Stream Analysis'){
      //   groupLayers[1].getLayers().array_.push(Ilayer)
      // }
      // else{
    
          map.addLayer(Ilayer);
     
      // }
      // if (groupLayerName === 'HUCS'){
      //   groupLayers[1].getLayers().array_.push(Ilayer)
      // }
      // console.log(map)
      return () => {
        // if (groupLayerName != 'Basemaps' && groupLayerName === 'NWM Stream Analysis'){
        //   groupLayers[1].getLayers().array_ = groupLayers[1].getLayers().array_.filter(function( layer ) {
        //     return layer.get('name') !== name;
        //   });
        // }
        // else{
          map.removeLayer(Ilayer);

        // }
      };
    });
    return null;
  };