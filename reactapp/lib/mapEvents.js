import axios from 'axios';
import Point from "@arcgis/core/geometry/Point.js";
import { getLayerbyName } from '../features/Map/lib/utils';
import MapUtils from './mapUtils';
import EsriUtils from './esriUtils';


class MapEvents {
    constructor() {
        this.esriUtils = new EsriUtils();
        this.mapUtils = new MapUtils();
    }

    onClickPreviewFile(layer, event) {
        
    }
    
    // some info about the function here:https://gist.github.com/xemoka/cb4cf95018fdc2cebac4da8f0c308723
    // an issue in this: https://github.com/openlayers/openlayers/issues/9721
    _onClickStreamFlowLayerHandler(
        event,
        layer,
        nwmState,
        nwmActions,
        appAPI,
        mapActions
    ) {
        // make function to get the layer, and if there is then execute.
        let mapServerInfo = []
        let mapObject = event.map;
        // remove the reach layer if it exists
        if (getLayerbyName(mapObject,`reach_on_click_from_region`)){
            //only if there is a layer already
            mapActions.delete_layer_by_name(`reach_on_click_from_region`);
        }
    
        let clickCoordinate = event.coordinate;
    
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
                distance: this.esriUtils.getDistanceByZoom(mapObject.getView().getZoom()),
                sr: `${mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop()}`,
                // layers: `all:${server.layers}`, // query all the layer ids for hits map server built above
                returnGeometry: true, // I don't want geometry, but you might want to display it on a 'selection layer'
                f: 'json',
                inSR:102100,
                outSR:4326
            }
            const url = new URL(`${urlService}/5/query`);
            url.search = new URLSearchParams(queryLayer5);
            mapActions.toggle_loading_layers();
            nwmActions.setProductsLoading(true);
            axios.get(url).then((response) => {
                // handleModalState(true);
                const actual_zoom = mapObject.getView().getZoom()
                var esriMapPoint = new Point({
                    longitude: clickCoordinate[0],
                    latitude: clickCoordinate[1],
                    spatialReference: spatialReference,
                });
                let currentStreamFeature = this.esriUtils.processStreamServiceQueryResult(actual_zoom, esriMapPoint, response.data, mapObject)
                var stationID = currentStreamFeature.properties['id']
                // //console.log(stationID)
              
                //updated current geometry
                nwmActions.updateCurrentGeometry(currentStreamFeature.geometry);
                //create the reach layer
                const reach_layer = this.mapUtils.createClickedReachLayer(`reach_on_click_from_region`,currentStreamFeature.geometry);
                mapActions.addLayer(reach_layer);
    
    
                //reset the products
                nwmActions.resetProducts();
    
                // this ones are commented needs to be uncommented
                // handleShow();
                let dataRequest = {
                    station_id: stationID,
                    products: nwmState.products
                }
                // appAPI.getForecastData(dataRequest);
                appAPI.getForecastData(dataRequest);
                nwmActions.updateCurrentStationID(stationID);
    
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
                    nwmActions.updateCurrentMetadata(metadataArray);
                });
    
            }).catch((error) => {
                //console.log(error);
                nwmActions.setProductsLoading(false);
    
                nwmActions.handleModalState(false);
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
    _onClickHucRegion (
        event,
        layer, 
        mapActions,
        setIsLoading
    ) {
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
                    const vector_layer = this.mapUtils.createHUCVectorLayer(layer_name,urlQuery.href);
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
    
    async _getInfoFromLayers (
        event, 
        clickable_layers, 
        nwmActions,
        nwmState,
        appAPI,
        mapActions,
        setIsLoading
    ) {
        for (const layer of clickable_layers) {
          const layer_name = layer.get('name');
          if (layer_name === 'StreamFlowMapLayer') {
            this._onClickStreamFlowLayerHandler(
                event, 
                layer, 
                nwmState,
                nwmActions,
                appAPI,
                mapActions
            );
          }
          if (layer_name === 'Catchments Layer') {
            this._onClickHucRegion(
                event, 
                layer, 
                mapActions,
                setIsLoading
            );
          }
          if (layer_name === 'reach_on_click_from_region'){
            console.log('click on reach_on_click_from_region layer')
          }
          if(layer_name.includes('_huc_vector_selection')){
            mapActions.delete_layer_by_name(layer_name)
          }
        }
    };

    async onClickLayersEvent (
        event,
        nwmActions,
        nwmState,
        appAPI,
        mapActions,
        setIsLoading
    ) {
        event.preventDefault();
        // console.log('click event', event);
        let layers = this.mapUtils.getClickEventLayers(event, event.map);
        _getInfoFromLayers(
            event, 
            layers, 
            nwmActions,
            nwmState,
            appAPI,
            mapActions,
            setIsLoading
        )
      }

    async onStartLoadingLayersEvent (evt, setIsLoading) {
        setIsLoading(true);
    }

    async onEndLoadingLayerEvent (evt, setIsLoading) {
        setIsLoading(false);
    }

    async onPointerMoveLayersEvent (e,layer) {
        if (e.dragging) {
            return;
        }
        var map = e.map;
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        // map.getViewport().style.cursor = hit ? 'pointer' : '';
    
        this.mapUtils.getClickEventLayers(e, map).forEach(layer => {
    
            // if (layer.get('name') === 'Catchments Layer') {
            //     const data = layer.getData(pixel);
            //     hit = data && data[3] > 0; // transparent pixels have zero for data[3]
            //     map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            // }
            // else{
            //     map.getViewport().style.cursor = hit ? 'pointer' : '';
            // }
    
        })
    }

}

export default MapEvents;



