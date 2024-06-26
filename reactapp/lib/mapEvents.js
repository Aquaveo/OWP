import axios from 'axios';
import {getDistanceByZoom,processStreamServiceQueryResult} from '../features/Map/lib/esriMapServerUtils'
import Point from "@arcgis/core/geometry/Point.js";
import {Stroke, Style} from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON';
import { getLayerbyName } from '../features/Map/lib/mapUtils';

// some info about the function here:https://gist.github.com/xemoka/cb4cf95018fdc2cebac4da8f0c308723
// an issue in this: https://github.com/openlayers/openlayers/issues/9721
const onClickStreamFlowLayerHandler = (
    layer,
    event,
    currentProducts,
    resetProducts,
    updateCurrentGeometry, 
    updateCurrentMetadata,
    handleModalState,
    getForecastData,
    updateCurrentStationID,
    setProductsLoading,
    mapActions
    ) => {
    // make function to get the layer, and if there is then execute.
    let mapServerInfo = []
    let mapObject = event.map;
    // remove the reach layer if it exists
    if (getLayerbyName(mapObject,`reach_on_click_from_region`)){
        //only if there is a layer already
        mapActions.delete_layer_by_name(`reach_on_click_from_region`);
    }

    let clickCoordinate = event.coordinate;
    // const pixel = mapObject.getEventPixel(event.originalEvent)
    // const clickCoordinate = mapObject.getCoordinateFromPixel(pixel)
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
        mapActions.toggle_loading_layers();
        setProductsLoading(true);
        axios.get(url).then((response) => {
            // handleModalState(true);

            const filteredArray = response.data['features'][0]
            const actual_zoom = mapObject.getView().getZoom()
            var esriMapPoint = new Point({
                longitude: clickCoordinate[0],
                latitude: clickCoordinate[1],
                spatialReference: spatialReference,
            });
            let currentStreamFeature = processStreamServiceQueryResult(actual_zoom, esriMapPoint, response.data, mapObject)
            var stationID = currentStreamFeature.properties['id']
            // //console.log(stationID)
          
            //updated current geometry
            updateCurrentGeometry(currentStreamFeature.geometry);
            //create the reach layer
            const reach_layer = createClickedReachLayer(`reach_on_click_from_region`,currentStreamFeature.geometry);
            mapActions.addLayer(reach_layer);


            //reset the products
            resetProducts();

            // this ones are commented needs to be uncommented
            // handleShow();
            let dataRequest = {
                station_id: stationID,
                products: currentProducts.products
            }
            // appAPI.getForecastData(dataRequest);
            getForecastData(dataRequest);
            updateCurrentStationID(stationID);

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
                // this ones are commented needs to be uncommented  
                // handleShow();

                var lat = response.data['location']['x'];
                var lon = response.data['location']['y'];
                var regionName = response.data['address']['Region'];
                var cityName = response.data['address']['City']
                var stationName = currentStreamFeature.properties['name']
                //console.log(stationName)
                const metadataArray = [
                    `${stationName} - ${cityName}, ${regionName}`,
                    `streamflow for Reach ID: ${stationID} (lat: ${lat} , lon: ${lon})`
                ]
                
                // this ones are commented needs to be uncommented  
                // setMetadata(metadataArray);
                setTimeout(() => {
                    mapActions.toggle_loading_layers();
                }, 1000);
                updateCurrentMetadata(metadataArray);
            });

        }).catch((error) => {
            //console.log(error);
            setProductsLoading(false);

            handleModalState(false);
            mapActions.toggle_loading_layers();
            //try to fix the error or
            //notify the users about somenthing went wrong
            // this ones are commented needs to be uncommented 
            // handleHideLoading();

        });


    } else {
        mapServerInfo.find(server => server.url === url).layers.push(id) // if so, add the ID of this layer for query
    }
}


const onClickHucRegion = (layer, event, mapActions,setIsLoading) =>{
    //console.log("HUC region clicked")
    setIsLoading(true);
    let mapServerInfo = []
    let clickCoordinate = event.coordinate;
    let mapObject = event.map;
    const urlService = layer.getSource().getUrl() // collect mapServer URL
    //console.log(urlService)
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
        //console.log(queryIdentify)
        const url = new URL(`${urlService}/identify`);
        url.search = new URLSearchParams(queryIdentify);
        // here we can grab the last layer and then run the query for that layer at that point for the geometry :)

        axios.get(url).then((response) => {
            //console.log(response.data);
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
            //console.log(`${mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop()}`)
            axios.get(urlQuery).then((responseQuery) => {
                //console.log(responseQuery.data);
                const layer_name = `${responseQuery.data['features'][0]['id']}_huc_vector_selection}`;
                const vector_layer = createHUCVectorLayer(layer_name,urlQuery.href,mapActions,responseQuery.data);
                mapActions.addLayer(vector_layer);
                setIsLoading(false);

                // setCurrentRegion({name:layer_name, data:responseQuery.data, url: urlQuery.href, mapExtent: queryIdentify['mapExtent'], imageDisplay:queryIdentify['imageDisplay'] });
            }).catch((error) => {
                setIsLoading(false);

                //console.log(error);
            })
        }).catch((error) => {
            setIsLoading(false);
            //console.log(error);
        })

            

        }
    




}

const createHUCVectorLayer = (name,url,mapActions,data) =>{

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
        extraProperties: {
            events: [{'type': 'click', 'handler': ()=>{
                mapActions.delete_layer_by_name(name)
            }}],
            priority: 3,
            data: data
        }
    
      }
      return layerFile
}


const createClickedReachLayer = (name, features) =>{
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
        extraProperties: {
            events: [{'type': 'click', 'handler': ()=>{
                //console.log("clicked on reach")
            }}],
            priority: 0,
        }
    
      }
      return layerReach
}



const onClickPreviewFile = (layer, event) =>{
    //console.log("Preview Regions clicked")
}




export {onClickStreamFlowLayerHandler,onClickHucRegion,onClickPreviewFile,createClickedReachLayer}