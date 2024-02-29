import React, { useRef, useState, useEffect} from "react"
import axios from 'axios';

//context
import MapContext from "../../features/Map/contexts/MapContext";

//service modules
import appAPI from "services/api/app";

//OL modules
import Map from "ol/Map";
import View from "ol/View";
import VectorTileLayer from 'ol/layer/VectorTile.js';
import LineString from 'ol/geom/LineString.js';

import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { fromLonLat,transform } from 'ol/proj';
import EsriJSON from 'ol/format/EsriJSON.js';

//style modules
import { MapContainer } from 'components/styles/Map.styled'
import "./Map.css";

//esri
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Point from "@arcgis/core/geometry/Point.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";

export const ReMap = (
	{ 
		children, 
		isFullMap, 
		zoom, 
		center, 
		handleShow, 
		setCurrentStation, 
		currentProducts, 
		setCurrentStationID, 
		setCurrentProducts, 
		setCurrentReachIdGeometry,
		handleShowLoading,
		setMetadata,
		selectedRegions,
		setSelectedRegions,
		handleHideLoading,
		setLoadingText,
		setCurrentReachGeometryOnClick,
		setCurrentReachGeometry
	}) => 
	
	{
	
	const mapRef = useRef();
	const [map, setMap] = useState(null);
	const [curentRegion, setCurrentRegion] = useState({});


	function isBlank(str) {
		return (!str || /^\s*$/.test(str) || str === null);
	}

	function drawCurrentReachOnClick(esriPaths,mapObject){
		// Transform ESRI paths into coordinates array for LineString
		const coordinates = esriPaths.map(path => path.map(point =>[point[0], point[1]]))[0];
		const geojsonObject = 
			{
				'type': 'LineString',
				'coordinates': coordinates
			}

		console.log(geojsonObject)
		// setCurrentReachGeometry(null);
		setCurrentReachGeometryOnClick(geojsonObject);
	}
	function getDistanceByZoom(zoom) {
		switch (true) {
			case (zoom > 20):
				return 25;
			case (zoom > 17):
				return 125;
			case (zoom > 14):
				return 250;
			case (zoom > 11):
				return 500;
			case (zoom > 8):
				return 1000;
			case (zoom > 5):
				return 2000;
		}

		return 10000;
	}


	function processStreamServiceQueryResult(zoom,point, name, response,mapObject) {
		console.log(response.features)
		var minStreamOrder = 5;
		var soAttrName = null;
		var fidAttrName = null;
		var nameAttrName = null;

		if (response.features.length === 0) {
			// window.modules.MapFeatureReport.addFeatureContent(name, '<p>No feature information for coordinate selected.</p>');
			return;
		}

		if (zoom >= 5) minStreamOrder--;
		if (zoom >= 6) minStreamOrder--;
		if (zoom >= 8) minStreamOrder--;
		if (zoom >= 10) minStreamOrder--;


		response.fields.forEach(function (field) {
			if (!fidAttrName && /^(reach_id|station_id|feature_id)$/i.test(field.alias)) {
				fidAttrName = field.name;
			}

			if (!soAttrName && /^(stream_?order)$/i.test(field.alias)) {
				soAttrName = field.name;
			}

			if (!nameAttrName && /^((reach|gnis)?_?name)$/i.test(field.alias)) {
				nameAttrName = field.name;
			}
		});

		var validFeatures = [];

		response.features.forEach(function (feature) {
			if (feature.attributes[soAttrName] < minStreamOrder) {
				return;
			}

			validFeatures.push(feature);
		});

		validFeatures.map(function getDistanceFromPoint(feature) {
			feature.distance = geometryEngine.distance(point, feature.geometry);
			return feature;
		})
		validFeatures.sort(function sortByDistance(a, b) {
			return a.distance - b.distance;
		});

		if (validFeatures.length === 0) {
			// window.modules.MapFeatureReport.addFeatureContent(
			// 	name,
			// 	'<p>No feature information for coordinate selected at the given Zoom level.</p>');
			return;
		}
		console.log(validFeatures)
		let stationName = isBlank(validFeatures[0].attributes[nameAttrName]) ? 'N/A' : validFeatures[0].attributes[nameAttrName]
		let stationID = validFeatures[0].attributes[fidAttrName]
		console.log("STATION ID", stationID)
		setCurrentStationID(stationID);
		setCurrentStation(stationName);
		drawCurrentReachOnClick(validFeatures[0].geometry.paths, mapObject)
	}


	function isRegionInSelectedRegions(arr, key, value) {
		if(arr){
			return arr.some((obj) => obj[key] === value);
		}
		else{
			return false
		}
	  }


	function findKeyWithMaxValue(obj) {
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
	function findPriorityLayerForOnClickEvent(layers) {
		console.log(layers)		
		let layerWeight={}
		let priorityLayer = layers[0]

		layers.forEach(function(layer_single){
			if(layer_single.get('name')==='huc_levels'){
				layerWeight['huc_levels'] = 2
			}
			if(layer_single.get('name')==='streams_layer'){
				layerWeight['streams_layer'] = 1
			}
			if(layer_single.get('name').includes('_user_region')){
				layerWeight[layer_single.get('name')] = 0
			}
		});
		let priorityLayerName = findKeyWithMaxValue(layerWeight);
		layers.forEach(function(layer_single){
			if(layer_single.get('name')=== priorityLayerName){
				priorityLayer = layer_single; 
			}						
		});
		return priorityLayer
	}


	useEffect(() => {
		console.log("usEffect Map.js");
		let options = {
			view: new View({ zoom, center }),
			layers:[],
			// layers: layerGroups,
			controls: [],
			overlays: []
		};

		let mapObject = new Map(options);
		mapObject.setTarget(mapRef.current);
		setMap(mapObject);
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
									// const filteredArray = response.data['features'].filter(obj => obj.attributes['analysis_assim.streamflow'] > 10 && obj.attributes['raw.gnis_name']);
									// Sort the array based on analysis_assim.streamflow in descending order
									// filteredArray.sort((a, b) => {
									// 	const shapeLengthA = a.attributes['raw.Shape_Length'];
									// 	const shapeLengthB = b.attributes['raw.Shape_Length'];
									// 	return shapeLengthB - shapeLengthA
									// });
									const filteredArray = response.data['features'][0]
									console.log(filteredArray)
									// const selectedLayer = filteredArray[0]
									// const selectedLayer = filteredArray
									// let reachIDPath = selectedLayer['geometry']['paths'];
									// const feature = new Feature({
									// 	geometry: new LineString(reachIDPath),
									// 	name: stationID,
									// });
									// let sourceVector = new VectorSource({
									// 	features: [feature]
									// })
									// setCurrentReachIdGeometry(sourceVector);

									// console.log(reachIDPath)
									// let stationName = selectedLayer['attributes']['raw.gnis_name']
									// let stationID = selectedLayer['attributes']['raw.feature_id']
									// console.log("STATION ID", stationID)
									// setCurrentStationID(stationID);
									// // setCurrentStationID(Math.random());
									// setCurrentStation(stationName);
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
		mapObject.on('click',infoClickHandler)

		return () => {
			if (!mapObject) return;
			mapObject.setTarget(undefined)
		};
	}, []);

	// map events make the cursor pointer
	useEffect(()=>{

		if (!map) return;
		const viewResolution = /** @type {number} */ (map.getView().getResolution());
	},[map])

	useEffect(() => {
	
		const regionFound = isRegionInSelectedRegions(selectedRegions, "name", curentRegion['name']);

		if(regionFound){
			console.log("found");
			setSelectedRegions({type:"delete", region: {name:curentRegion['name'], data:curentRegion['data']}});
		}
		else{
			console.log("added region")
			if(!(Object.keys(curentRegion).length === 0)){
				setSelectedRegions({
					type:"add", 
					region: {
						name:curentRegion['name'], 
						data:curentRegion['data'], 
						url: curentRegion['url'], 
						mapExtent: curentRegion['mapExtent'], 
						imageDisplay:curentRegion['imageDisplay'] 
					}
				});
			}
		}
			handleHideLoading();

	  return () => {
		
	  }
	}, [curentRegion])
	
	return (
		<MapContainer isFullMap={isFullMap} >
			<MapContext.Provider value={{ map }}>
				<div ref={mapRef} className="ol-map" >
						{children}
				</div>
			</MapContext.Provider>
		</MapContainer>

	)
}