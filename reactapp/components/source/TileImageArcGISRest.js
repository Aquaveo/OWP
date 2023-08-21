
import ImageArcGISRest from "ol/source/ImageArcGISRest";
export const TileImageArcGISRest = (url, params) => {
  return new ImageArcGISRest({
    url,
    params
  });
};