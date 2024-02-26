import { OlImageTileLayer, OlTileLayer, VectorLayer } from './layers/layers';
import { ArcGISRestTile, OSMWMSTile, TileImageArcGISRest, WMSTile, VectorSourceLayer } from './source/sources';

//get the clickable layers: this works for image layers
// more info here https://gist.github.com/xemoka/cb4cf95018fdc2cebac4da8f0c308723
// an issue in this: https://github.com/openlayers/openlayers/issues/9721
const getClickEventLayers = (event, mapObject) => {
    let layers = []
    mapObject.forEachLayerAtPixel(
        event.pixel,
        layer => {
            layers.push(layer)
        },
        {
            layerFilter: layer => {
                return (
                    // for the following events: [{'type': 'click', 'handler': onClickHandler}] please filter to only get elements that have type click please
                   
                    layer.get('events') && layer.get('events').length > 0 && layer.get('events').findIndex(event => event.type === 'click') > -1
                )
            },
            hitTolerance: 0
        }
    )

    return layers
}

const findKeyWithMaxValue = (obj) => {
    let maxValue = -Infinity; // Initialize with a very low value
    let maxKey = null;
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] > maxValue) {
          maxValue = obj[key];
          maxKey = key;
        }
      }
    }
  
    return maxKey;
}

// according to the weight of the layer, we will find the priority layer
// the priority layer is the one with the highest weight, and it is given by the priority attribute
// the priority attribute is set in the layer object

const findPriorityLayerForOnClickEvent = (layers) => {
    let layerWeight={}
    let priorityLayer = layers[0]

    layers.forEach(function(layer,index){
        layerWeight[index] = layer.get('priority');
    });

    let priorityLayerIndex = findKeyWithMaxValue(layerWeight);
    priorityLayer = layers[priorityLayerIndex]
    return priorityLayer
}


// onClickHandler will call the click event handler for the layer with the highest priority
// the click event handler is set in the layer object
const onClickHandler = async (event) => {
    event.preventDefault();
    // console.log(event);
    const clickedCoordinate = event.map.getCoordinateFromPixel(event.pixel);
    let layers = getClickEventLayers(event,event.map)
    if (layers.length > 0) {
        // let layer = layers[0]
        let layer = findPriorityLayerForOnClickEvent(layers)
        let clickHandler = layer.get('events').find(event => event.type === 'click').handler
        clickHandler(layer, event)
    }

}

const infoClickHandler = async (event) =>{

    event.preventDefault();
    // get pixel click location
    const pixel = mapObject.getEventPixel(event.originalEvent)

    // generate list of layers
    let layers = []
    mapObject.forEachLayerAtPixel(
        pixel,
        layer => {
            layers.push(layer)
        },
        {
            layerFilter: layer => {
            return (
                layer.get('ignoreInfo') !== true && // give your non-infoable layers a property to filter by, when creating the OpenLayersObject for the layer, make sure you `layer.set('ignoreInfo', true)` 
                !layer.get('name').includes('basemap') &&
                !layer.get('name').includes('empty_vector_layer') &&
                !(layer instanceof VectorTileLayer) // only if the layer is not a vector layer do we want to query
                // !(layer instanceof VectorLayer)     // the ${mapServer}/identify endpoint;
            )
            },
            hitTolerance: 0
        }
    )

    // only if there are layers to query
    if ( layers.length > 0 ) {

        const clickCoordinate = mapObject.getCoordinateFromPixel(pixel)
        console.log(clickCoordinate)
        let mapServerInfo = []
        let promises = [];

        let layer = findPriorityLayerForOnClickEvent(layers)

                handleShowLoading();

                if(layer.get('name') ==='streams_layer'){
                    setCurrentReachGeometry(null);
                    setCurrentReachGeometryOnClick(null);
                    setLoadingText("Loading Timeseries ...");
                    const urlService = layer.getSource().getUrl() // collect mapServer URL
                    const id = layer
                        .getSource()
                        .getParams()
                        .LAYERS.replace('show:', '') // remove the visible component to just get the raw url
                    const server = mapServerInfo.find(server => server.url === urlService) // see if server already exists in mapServerInfo
                    /* Here need to do MapExport request in order to get the data of the layer */
                    
                    if (!server) {
                        // Query Layer 5 
                        const spatialReference= {"latestWkid":3857,"wkid":102100}
                        const geometry = {"spatialReference":spatialReference ,"x":clickCoordinate[0],"y":clickCoordinate[1]}
                        
                        // var lonlat = olProj.transform(clickCoordinate, 'EPSG:3857', 'EPSG:4326');
                        // var lon = lonlat[0];
                        // var lat = lonlat[1];
                        const queryLayer5 = {
                            geometry: JSON.stringify(geometry),
                            // layer: {"id":"5"},
                            outFields:'*',
                            geometryType: 'esriGeometryPoint',
                            spatialRel: "esriSpatialRelIntersects",
                            units:'esriSRUnit_Meter',
                            distance: getDistanceByZoom(mapObject.getView().getZoom()),
                            sr: `${mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop()}`,
                            // layers: `all:${server.layers}`, // query all the layer ids for htis map server built above
                            returnGeometry: true, // I don't want geometry, but you might want to display it on a 'selection layer'
                            f: 'json',
                            inSR:102100,
                            outSR:4326
                        }
                        const url = new URL(`${urlService}/5/query`);
                        url.search = new URLSearchParams(queryLayer5);

                        axios.get(url).then((response) => {


                            console.log(response.data);

                            const filteredArray = response.data['features'][0]
                            console.log(filteredArray)

                            const actual_zoom = mapObject.getView().getZoom()
                            var esriMapPoint = new Point({
                                longitude: clickCoordinate[0],
                                latitude: clickCoordinate[1],
                                spatialReference: spatialReference,
                            });
                            
                            // processStreamServiceQueryResult(zoom,esriMapPoint,response.data)
                            processStreamServiceQueryResult(actual_zoom,esriMapPoint, 'streams_layer', response.data, mapObject)
                            setCurrentProducts({type: "reset"});
                            handleShow();
                            let dataRequest = {
                                station_id: stationID,
                                products: currentProducts
                            }
                            appAPI.getForecastData(dataRequest);

                            // GeoReverse API to get the name of the river
                            const urlSGeoReverseService = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode'
                            const queryGeoReverse ={
                                f: 'json',
                                sourceCountry: 'USA',
                                location:JSON.stringify(geometry),
                                distance: 8000,	
                            }
                            
                            const urlGeo = new URL(`${urlSGeoReverseService}`);
                            urlGeo.search = new URLSearchParams(queryGeoReverse);
                            axios.get(urlGeo).then((response) => {
                                //MOVE IT LATER, When only clicking on layer
                                handleShow();

                                console.log(response.data);
                                var lat = response.data['location']['x'];
                                var lon = response.data['location']['y'];
                                var regionName = response.data['address']['Region'];
                                var cityName = response.data['address']['City']
                                const metadataArray = [
                                    `${stationName} - ${cityName}, ${regionName}`,
                                    `streamflow for Reach ID: ${stationID} (lat: ${lat} , lon: ${lon})`
                                ]
                                setMetadata(metadataArray);

                            });

                        }).catch((error) => {
                            //try to fix the error or
                            //notify the users about somenthing went wrong
                            handleHideLoading();

                        });


                    } else {
                        mapServerInfo.find(server => server.url === url).layers.push(id) // if so, add the ID of this layer for query
                    }
                }
                if(layer.get('name') === 'huc_levels'){


                    const urlService = layer.getSource().getUrl() // collect mapServer URL
                    console.log(urlService)
                    const id = layer
                        .getSource()
                        .getParams()
                        .LAYERS['selectedHucs'].replace('show:', '') // remove the visible component to just get the raw url
                    const server = mapServerInfo.find(server => server.url === urlService) // see if server already exists in mapServerInfo
                    /* Here need to do MapExport request in order to get the data of the layer */
                    
                    if (!server) {
                        // Query Layer 5 
                        const spatialReference= {"latestWkid":3857,"wkid":102100}
                        const geometry = {"spatialReference":spatialReference ,"x":clickCoordinate[0],"y":clickCoordinate[1]}

                        const queryIdentify = {
                            f: 'json',
                            geometryType: 'esriGeometryPoint',
                            layers:'visible',
                            tolerance: 1,
                            geometry: clickCoordinate,
                            mapExtent: mapObject.getView().calculateExtent(), // get map extent
                            imageDisplay: `${mapObject.getSize()},96`,  // get map size/resolution
                            sr: mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop() // this is because our OL map is in this SR

                        }
                        console.log(queryIdentify)
                        const url = new URL(`${urlService}/identify`);
                        url.search = new URLSearchParams(queryIdentify);
                        // here we can grab the last layer and then run the query for that layer at that point for the geometry :)

                        let response = await axios.get(url);
                        
                        
                        // .then((response) => {
                            console.log(response.data);
                            let layerId = response.data['results'][response.data['results'].length -1]['layerId']

                            const queryLayer = {
                                geometry: JSON.stringify(geometry),
                                outFields:'*',
                                geometryType: 'esriGeometryPoint',
                                spatialRel: "esriSpatialRelIntersects",
                                units:'esriSRUnit_Meter',
                                distance: 100,
                                sr: `${mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop()}`,
                                returnGeometry: true, // I don't want geometry, but you might want to display it on a 'selection layer'
                                f: 'geojson',
                                inSR:102100,
                                outSR:102100
                            }
                            const urlQuery = new URL(`${urlService}/${layerId}/query`);
                            urlQuery.search = new URLSearchParams(queryLayer);
                            console.log(`${mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop()}`)
                            let responseQuery = await axios.get(urlQuery)
                            console.log(responseQuery.data);
                            const layer_name = `${responseQuery.data['features'][0]['id']}_huc_vector_selection}`;
                            setCurrentRegion({name:layer_name, data:responseQuery.data, url: urlQuery.href, mapExtent: queryIdentify['mapExtent'], imageDisplay:queryIdentify['imageDisplay'] });

        

                    }
                }

    }

}


const drawCurrentReachOnClick = (esriPaths) =>{
    // Transform ESRI paths into coordinates array for LineString
    const coordinates = esriPaths.map(path => path.map(point =>[point[0], point[1]]))[0];
    const geojsonObject = 
        {
            'type': 'LineString',
            'coordinates': coordinates
        }

    console.log(geojsonObject)
    // setCurrentReachGeometryOnClick(geojsonObject);
}


const useLayerFactory = (layerType, options) => {
    
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


const getAllLayerNames = (map) => {
    return map.getLayers().getArray()
      .filter(layer => layer.get('name')) // Ensure the layer has a 'name' property
      .map(layer => layer.get('name')); // Extract the 'name' property
}


const getLayerToRemove = (map, layersArray) => {
    // Get all layers from the map
    const allLayers = map.getLayers().getArray();
    
    // Extract the names from layersArray for comparison
    const predefinedLayerNames = layersArray.map(layer => layer.options.name);

    // Filter out layers that are present in allLayers but not in predefinedLayerNames
    const layersToRemove = allLayers.filter(layer => {
        const layerName = layer.get('name'); // Assuming each layer has a 'name' property
        return !predefinedLayerNames.includes(layerName);
    });

    return layersToRemove;
}

const filterLayersNotInMap = (map, layersArray) => {
    const existingLayerNames = getAllLayerNames(map);

    return layersArray.filter(layer => {
        // Check if the layer's name is not in the existingLayerNames array
        return !existingLayerNames.includes(layer.options.name);
    });
}


const addLayer = (map, layerInfo) => {
    const layer = useLayerFactory(layerInfo.layerType, layerInfo.options);
    let {events, priority} = layerInfo.extraProperties;
    layer.set('events', events);
    layer.set('priority', priority);
    map.addLayer(layer);
  };

const removeLayer = (map,layer) => {
    console.log("Layer removed");
    map.removeLayer(layer);
};  




export {onClickHandler, filterLayersNotInMap,addLayer,removeLayer,getLayerToRemove}