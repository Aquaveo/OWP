import { OlImageTileLayer, OlTileLayer, VectorLayer } from '../components/layers/layers';
import { ArcGISRestTile, OSMWMSTile, TileImageArcGISRest, WMSTile, VectorSourceLayer } from '../components/source/sources';

/**
 * Custom hook to create OpenLayers layer based on the given type and options.
 * 
 * @param {string} layerType - Type of the layer ('OlImageTileLayer', 'OlTileLayer', or 'VectorLayer').
 * @param {Object} options - Options for the layer creation.
 * @returns {Object} - The created OpenLayers layer.
 */
export const useLayerFactory = ({layerType, options}) => {
    
    const layer = () => {
      let source = null;
      // Determine the source based on options.type and create it
      switch (options.sourceType) {
          case 'ArcGISRestTile':
              source = ArcGISRestTile(options.url, options.params);
              break;
          case 'OSMWMSTile':
              source = OSMWMSTile();
              break;
          case 'TileImageArcGISRest':
              source = TileImageArcGISRest(options.url, options.params);
              break;
          case 'WMSTile':
              source = WMSTile(options.url, options.params);
              break;
          case 'VectorSourceLayer':
              source = VectorSourceLayer(options.features);
              break;
          default:
              console.error('Unsupported source type');
              return;
      }

      // Based on layerType, create the corresponding layer
      switch (layerType) {
          case 'OlImageTileLayer':
              return OlImageTileLayer({ ...options, source });
              break;
          case 'OlTileLayer':
              return OlTileLayer({ ...options, source });
              break;
          case 'VectorLayer':
              return VectorLayer({ ...options, source });
              break;
          default:
              console.error('Unsupported layer type');
              return null;
      }
    }
    return layer();
};
