import {  useContext, useEffect } from "react";
import OLVectorLayer from "ol/layer/Vector";
import { getVectorSourceExtent } from 'ol/extent';

import MapContext from "../../features/Map/contexts/MapContext";

export const VectorLayer = ({ name,source, style, zIndex=0 }) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    let vectorLayer = new OLVectorLayer({
      name,
      source,
      style,
      zIndex
    });
    // map.addLayer(vectorLayer);
    map.getLayers().insertAt(1, vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map]);


  // useEffect(() => {
  //   if (!map) return;

  //   // map.getAllLayers().filter(function( layer ) {
  //   //   if(layer.get('name') === name){
  //   //     // map.removeLayer(layer);

  //   //     console.log("jeu")
  //   //     let sourceLayer = layer.getSource();
  //   //     // sourceLayer.clear();
  //   //     // layer.setSource(source);
  //   //     // layer.getSource().refresh();

  //   //     // const extent = source.getExtent();
  //   //     // map.getView().fit(extent, {
  //   //     //   padding: [10, 10, 10, 10], // Optional padding around the extent
  //   //     //   duration: 1000, // Optional animation duration in milliseconds
  //   //     // });

  //   //     sourceLayer.clear();
  //   //     sourceLayer.addFeatures(source.getFeatures());
  //   //     console.log(sourceLayer);

  //   //     // layer.getSource().addFeatures(features);
  //   //     // layer.getSource().refresh();
  //   //     // map.getView().fit(layer.getSource().getExtent());

  //   //   }
  //   // });


  //   return () => {

  //   };
  // },[source]);


  return null;
};