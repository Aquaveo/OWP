const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';


class layerData {
  constructor() {
    this.initialLayers = {
      "baseMapLayer":{
          layerType: 'OlTileLayer',
          options: {
            sourceType: 'ArcGISRestTile',
            url: baseMapLayerURL,
            // all the params for the source goes here
            params: {
                LAYERS: 'topp:states',
                Tiled: true,
            },
            // the rest of the attributes are for the definition of the layer
            name: "baseMapLayer",
          }
      },
      "streamFlowAnomalyMapLayer":{
          layerType: 'OlImageTileLayer',
          options: {
            sourceType: 'TileImageArcGISRest',
            url: StreamLayerURL,
            // all the params for the source goes here
            params: {
              LAYERS:"show:0,7,14,21"
            },
            // the rest of the attributes are for the definition of the layer
            zIndex: 3,
            name: "StreamFlowMapLayer"
          }
      }
    }
  }
  getLayersArray() {
      return Object.values(this.initialLayers);
  }
  getBaseMapLayer() {
      return this.initialLayers.baseMapLayer;
  }
  getStreamAnomalyLayer() {
    return this.initialLayers.streamFlowAnomalyMapLayer;
}

}


export { layerData }