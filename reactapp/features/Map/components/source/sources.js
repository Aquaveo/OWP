
import TileArcGISRest from "ol/source/TileArcGISRest";
import OSM from 'ol/source/OSM';
import ImageArcGISRest from "ol/source/ImageArcGISRest";
import TileWMS from "ol/source/TileWMS";
import VectorSource from 'ol/source/Vector.js';

const ArcGISRestTile = (url, params) => {
  return new TileArcGISRest({
    url,
    params
  });
};


const OSMWMSTile = (url, params) => {
  return new OSM();
};


const TileImageArcGISRest = (url, params) => {
  return new ImageArcGISRest({
    url,
    params
  });
};

const WMSTile = (url, params) => {
  return new TileWMS({
    url,
    params,
  });
};


const VectorSourceLayer = (features) => {
  return new VectorSource({
    features  
  });
};


export { ArcGISRestTile, OSMWMSTile, TileImageArcGISRest, WMSTile, VectorSourceLayer }