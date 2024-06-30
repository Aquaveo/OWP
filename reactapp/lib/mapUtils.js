import {Stroke, Style} from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON';

// Map Utils
class MapUtils {

    // Filter function to exclude base map layers
    _customForEachLayerAtPixelLayerFilter(layer) {
        return layer.get('name') !== 'baseMapLayer';
        // Uncomment and adjust the following line to include layers with specific events
        // return layer.get('events') && layer.get('events').length > 0 && layer.get('events').findIndex(event => event.type === 'click') > -1;
    }

    // Get all layers at the clicked pixel, excluding base map layers
    getClickEventLayers(event, mapObject) {
        let layers = [];
        mapObject.forEachLayerAtPixel(
            event.pixel, 
            layer => {
                layers.push(layer);
            },
            {
                layerFilter: this._customForEachLayerAtPixelLayerFilter.bind(this),
                hitTolerance: 0
            }
        );
      
        return layers;
    }

    createHUCVectorLayer (name,url){

        const layerFile = {
            layerType: 'VectorLayer',
            options: {
              sourceType: 'VectorSourceLayer',
              // all the params for the source goes here
              params: {
                format: new GeoJSON(),
                url: url
              },
              // the rest of the attributes are for the definition of the layer
              zIndex: 2,
              name: name,
              style:
                new Style({
                  stroke: new Stroke({
                    color: 'green',
                    width: 3,
                  })
                })
              
            },

          }
          return layerFile
    }

    createClickedReachLayer (name, features) {
        const layerReach = {
            layerType: 'VectorLayer',
            options: {
              sourceType: 'VectorSourceLayer',
              // all the params for the source goes here
              params: {
                format: new GeoJSON(),
                features: new GeoJSON(
                    {
                      dataProjection: 'EPSG:4326',
                      featureProjection: 'EPSG:3857'
                    }
                  ).readFeatures(features)
              },
              // the rest of the attributes are for the definition of the layer
              zIndex: 3,
              name: name,
              style:
                new Style({
                  stroke: new Stroke({
                    color: '#f5e154',
                    width: 3,
                  })
                })
              
            },
        
          }
          return layerReach
    }

}



export default MapUtils