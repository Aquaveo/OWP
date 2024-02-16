import { useLayer } from "features/Map/hooks/useManageLayers";
import { Fragment } from "react";
import { useMapContext } from "features/Map/hooks/useMapContext";
// import { onClickStreamFlowLayerHandler } from "features/Map/lib/mapEvents";

// const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
// const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
// const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';
// const WbdMapLayerURL = 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer'

const Layers= ({ layers }) => {
  const {state} = useMapContext();
  
  layers.forEach(layer => {
    useLayer(layer);
  });
 

  return (
    <Fragment>
      {state.layers.map((layer, index) => {
        return (
          <>
            {layer}
          </>
        );
      })}
    </Fragment>
  );
};
export default Layers;