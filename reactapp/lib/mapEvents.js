import axios from 'axios';
import {getDistanceByZoom,processStreamServiceQueryResult} from '../features/Map/lib/esriMapServerUtils'
import Point from "@arcgis/core/geometry/Point.js";



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
    updateCurrentStationID
    ) => {
    let mapServerInfo = []
    let mapObject = event.map;
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

        axios.get(url).then((response) => {
            const filteredArray = response.data['features'][0]
            const actual_zoom = mapObject.getView().getZoom()
            var esriMapPoint = new Point({
                longitude: clickCoordinate[0],
                latitude: clickCoordinate[1],
                spatialReference: spatialReference,
            });
            let currentStreamFeature = processStreamServiceQueryResult(actual_zoom, esriMapPoint, response.data, mapObject)
            var stationID = currentStreamFeature.properties['id']
            console.log(stationID)
            updateCurrentGeometry(currentStreamFeature.geometry);
            resetProducts();

            // this ones are commented needs to be uncommented
            // handleShow();
            let dataRequest = {
                station_id: stationID,
                products: currentProducts.state.products
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
                
                const metadataArray = [
                    `${stationName} - ${cityName}, ${regionName}`,
                    `streamflow for Reach ID: ${stationID} (lat: ${lat} , lon: ${lon})`
                ]
                
                // this ones are commented needs to be uncommented  
                // setMetadata(metadataArray);

                updateCurrentMetadata(metadataArray);
            });

        }).catch((error) => {
            handleModalState(false);
            //try to fix the error or
            //notify the users about somenthing went wrong
            // this ones are commented needs to be uncommented 
            // handleHideLoading();

        });


    } else {
        mapServerInfo.find(server => server.url === url).layers.push(id) // if so, add the ID of this layer for query
    }
}


const onClickHucRegion = (layer, event) =>{
    console.log("HUC region clicked")
}

const onClickPreviewFile = (layer, event) =>{
    console.log("HUC region clicked")
}

export {onClickStreamFlowLayerHandler,onClickHucRegion,onClickPreviewFile}