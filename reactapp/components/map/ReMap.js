import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import Map from "ol/Map";
import MapContext from "./MapContext";
import axios from 'axios';

import View from "ol/View";
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorLayer from 'ol/layer/Vector.js';
import LineString from 'ol/geom/LineString.js';
import { Feature } from "ol";
import { MapContainer } from '../styles/Map.styled'
import appAPI from "services/api/app";
import { VectorSourceLayer } from "components/source/Vector";
import VectorSource from "ol/source/Vector";
export const ReMap = (
	{ 
		children, 
		isFullMap, 
		zoom, center, 
		layerGroups, 
		handleShow, 
		setCurrentStation, 
		currentProducts, 
		setCurrentStationID, 
		setCurrentProducts, 
		setCurrentReachIdGeometry,
		handleShowLoading,
		setMetadata 
	}) => 
	
	{
	
	const mapRef = useRef();
	const [map, setMap] = useState(null);
	// on component mount
	useEffect(() => {
		console.log("usEffect Map.js");
		let options = {
			view: new View({ zoom, center }),
			layers: layerGroups,
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
						!(layer instanceof VectorTileLayer) && // only if the layer is not a vector layer do we want to query
						!(layer instanceof VectorLayer)     // the ${mapServer}/identify endpoint;
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
				let layer = layers[0];
				// layers
					// .forEach( (layer) => {
						if(layer.get('name') ==='streams_layer'){
							handleShowLoading();
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
									distance: 10000,
									sr: `${mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop()}`,
									// layers: `all:${server.layers}`, // query all the layer ids for htis map server built above
									returnGeometry: true, // I don't want geometry, but you might want to display it on a 'selection layer'
									f: 'json',
									inSR:102100,
									outSR:102100
								}
								const url = new URL(`${urlService}/5/query`);
								url.search = new URLSearchParams(queryLayer5);

								axios.get(url).then((response) => {


									// console.log(response.data);
									const filteredArray = response.data['features'].filter(obj => obj.attributes['analysis_assim.streamflow'] > 10 && obj.attributes['raw.gnis_name']);
									// Sort the array based on analysis_assim.streamflow in descending order
									filteredArray.sort((a, b) => {
										const shapeLengthA = a.attributes['raw.Shape_Length'];
										const shapeLengthB = b.attributes['raw.Shape_Length'];
										return shapeLengthB - shapeLengthA
									});

									console.log(filteredArray)
									const selectedLayer = filteredArray[0]
									let reachIDPath = selectedLayer['geometry']['paths'];
									const feature = new Feature({
										geometry: new LineString(reachIDPath),
										name: stationID,
									});
									let sourceVector = new VectorSource({
										features: [feature]
									})
									setCurrentReachIdGeometry(sourceVector);

									console.log(reachIDPath)
									let stationName = selectedLayer['attributes']['raw.gnis_name']
									let stationID = selectedLayer['attributes']['raw.feature_id']
									console.log("STATION ID", stationID)
									setCurrentStationID(stationID);
									// setCurrentStationID(Math.random());
									setCurrentStation(stationName);
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

								});

	
							} else {
								mapServerInfo.find(server => server.url === url).layers.push(id) // if so, add the ID of this layer for query
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

	// map events
	useEffect(()=>{

		if (!map) return;
		const viewResolution = /** @type {number} */ (map.getView().getResolution());
		// map.on('click',infoClickHandler)
		//   });
		map.on('pointermove',evt=>{

			if (evt.dragging) return;
			var pixel = evt.map.getEventPixel(evt.originalEvent);
			var hit = map.hasFeatureAtPixel(evt.pixel, {
				layerFilter: function(layer) {
					return layer.get('layer_name') === 'streams_layer';
				}
			});
			evt.map.getTargetElement().style.cursor = hit ? 'pointer' : '';


			// const pixel = map.getEventPixel(evt.originalEvent)
		
			// // generate list of layers

			// let hit = map.forEachFeatureAtPixel(pixel, function(layer) {
			// 	return layer.get('name') === 'streams_layer';

			// });

			// if(hit){
			// 	map.getTargetElement().style.cursor = 'pointer';
			// }
			// else {
			// 	map.getTargetElement().style.cursor = '';
			//   }
		});
	},[map])


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

// const query ={
// 	f: 'json',
// 	geometryType: 'esriGeometryPoint',
// 	layers:'all',
// 	tolerance: 1,
// 	geometry: clickCoordinate,
// 	mapExtent: mapObject.getView().calculateExtent(), // get map extent
// 	imageDisplay: `${mapObject.getSize()},96`,  // get map size/resolution
// 	sr: mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop() // this is because our OL map is in this SR

// }
// const urlObject = new URL(`${urlService}/identify`)
// urlObject.search = new URLSearchParams(query)