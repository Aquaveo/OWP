import {  useContext, useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import LayerGroup from 'ol/layer/Group';

import MapContext from "../map/MapContext";

export const OlTileLayer = ({ source, name, groupLayerName,groupLayers}) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    let Tlayer = new TileLayer({
      source,
      name,
    });
    console.log(map);

    // if (groupLayers.length < 1){
    if (groupLayerName === 'Basemaps'){
        groupLayers[0].getLayers().array_.push(Tlayer)
    }


    return () => {
      if (groupLayerName === 'Basemaps'){
        groupLayers[0].getLayers().array_ = groupLayers[0].getLayers().array_.filter(function( layer ) {
          return layer.get('name') !== name;
        });
      }
    };
  });
  return null;
};