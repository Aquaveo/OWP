import { useContext, useEffect } from "react";
import { FullScreen } from "ol/control";
import MapContext from "../../features/Map/contexts/MapContext";
import {Control, defaults as defaultControls} from 'ol/control.js';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import 'ol/ol.css';
import LayerSwitcher from 'ol-layerswitcher';


export const SwitchLayerControl = (layers) => {
  const { map } = useContext(MapContext);


  useEffect(() => {
    if (!map) return;
    let switchLayerControl = new LayerSwitcher({
        reverse: true,
        groupSelectStyle: 'group'
    });
    map.addControl( switchLayerControl );
    return () => map.controls.remove(switchLayerControl);
  }, [map]);
  return null;
};
