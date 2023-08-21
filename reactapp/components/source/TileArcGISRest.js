import TileArcGISRest from "ol/source/TileArcGISRest";
export const ArcGISRestTile = (url, params) => {
  return new TileArcGISRest({
    url,
    params
  });
};