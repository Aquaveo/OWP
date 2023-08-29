import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import Map from "ol/Map";
import MapContext from "./MapContext";
import axios from 'axios';

import View from "ol/View";
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorLayer from 'ol/layer/Vector.js';

import { MapContainer } from '../styles/Map.styled'
import appAPI from "services/api/app";


export const ReMap = ({ children, isFullMap, zoom, center, layerGroups, handleShow, setCurrentStation, currentProducts, setCurrentStationID, setCurrentProducts }) => {
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
				let mapServerInfo = []
				let promises = [];
				let layer = layers[0];
				// layers
					// .forEach( (layer) => {
						if(layer.get('name') ==='streams_layer'){
							
							const urlService = layer.getSource().getUrl() // collect mapServer URL
							const id = layer
								.getSource()
								.getParams()
								.LAYERS.replace('show:', '') // remove the visible component to just get the raw url
							const server = mapServerInfo.find(server => server.url === urlService) // see if server already exists in mapServerInfo
							/* Here need to do MapExport request in order to get the data of the layer */
							
							if (!server) {
								const query ={
									f: 'json',
									geometryType: 'esriGeometryPoint',
									tolerance: 1,
									geometry: clickCoordinate,
									mapExtent: mapObject.getView().calculateExtent(), // get map extent
									imageDisplay: `${mapObject.getSize()},96`,  // get map size/resolution
									sr: mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop() // this is because our OL map is in this SR
	
								}
								const urlObject = new URL(`${urlService}/identify`)
								urlObject.search = new URLSearchParams(query)
	
								axios.get(urlObject).then(response => {
									console.log(response.data);
									// return { url: url, layers: [id], data:response.data.results } 
									// response.data
									// const LayerID = response.data['results'][0]['layerId']
									const spatialReference= response.data['results'][0]['geometry']['spatialReference']
									const query = {
										geometry: {spatialReference,"x":clickCoordinate[0],"y":clickCoordinate[1]},
										// layer: {"id":"5"},
										outFields:'*',
										geometryType: 'esriGeometryPoint',
										spatialRel: "esriSpatialRelIntersects",
										units:'esriSRUnit_Meter',
										distance: 10000,
										sr: mapObject.getView().getProjection().getCode().split(/:(?=\d+$)/).pop(),
										// layers: `all:${server.layers}`, // query all the layer ids for htis map server built above
										returnGeometry: false, // I don't want geometry, but you might want to display it on a 'selection layer'
										f: 'json'
									}
	
									const url = new URL(`${urlService}/5/query`);
									url.search = new URLSearchParams(query);
									// console.log()
									axios.get(url).then((response) => {
										console.log(response.data);
										let stationName = response.data.features[0]['attributes']['raw.gnis_name']
										let stationID = response.data.features[0]['attributes']['raw.feature_id']
										console.log("STATION ID", stationID)
										// setCurrentStationID(stationID);
										setCurrentStationID(Math.random());
										setCurrentStation(stationName);
										setCurrentProducts({type: "reset"});
										handleShow();
										let dataRequest = {
											// station_id: stationID,
											station_id: 19266232,
											products: currentProducts
										}
										appAPI.getForecastData(dataRequest);
	
									});
	
								  });
	
							} else {
								mapServerInfo.find(server => server.url === url).layers.push(id) // if so, add the ID of this layer for query
							}
						}
	
					// })
	
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
		//   map.on('pointermove',evt=>{
        //     console.log("out")
		//   });
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

