import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import Map from "ol/Map";
import MapContext from "./MapContext";
import axios from 'axios';

import View from "ol/View";
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorLayer from 'ol/layer/Vector.js';

import { MapContainer } from '../styles/Map.styled'



export const ReMap = ({ children, isFullMap, zoom, center, layerGroups, handleShow }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null);
	const infoClickHandler = async (event) =>{
		// console.log('Info Click Handler Fired:', event)
	
		let currentInfos = [] // the array we'll fill with the data returned from arcgis Server
	
		// get pixel click location
		const pixel = map.getEventPixel(event.originalEvent)
	
		// generate list of layers
		let layers = []
		map.forEachLayerAtPixel(
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
			const clickCoordinate = map.getCoordinateFromPixel(pixel)
			let mapServerInfo = []
			let promises = [];
			layers
				.forEach( (layer) => {
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
								mapExtent: map.getView().calculateExtent(), // get map extent
								imageDisplay: `${map.getSize()},96`,  // get map size/resolution
								sr: map.getView().getProjection().getCode().split(/:(?=\d+$)/).pop() // this is because our OL map is in this SR

							}
							const urlObject = new URL(`${urlService}/identify`)
							urlObject.search = new URLSearchParams(query)

							const promise = axios.get(urlObject).then(response => {
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
									distance: 2000,
									sr: map.getView().getProjection().getCode().split(/:(?=\d+$)/).pop(),
									// layers: `all:${server.layers}`, // query all the layer ids for htis map server built above
									returnGeometry: false, // I don't want geometry, but you might want to display it on a 'selection layer'
									f: 'json'
				
								}

								const url = new URL(`${urlService}5/query`)
								url.search = new URLSearchParams(query)
								axios.get(url).then((response) => {
									console.log(response.data);
									handleShow();
								  });

							  });
							promises.push(promise);

						} else {
							mapServerInfo.find(server => server.url === url).layers.push(id) // if so, add the ID of this layer for query
						}
					}

				})
				// Promise.all(promises).then(results => {
				// 	console.log(results);
				// 	// mapServerInfo.push({ url: url, layers: [id] }) 

				// });

			// console.log('Request for:', layers.map(layer => layer.get('name'))) // 'name' property is one I assign with layer.set('name', ${name})
	
			// const requestUrls = mapServerInfo.map(server => { // for each mapServer, build a query object and add it to an array
			// 	const query = {
			// 	// geometry: {"spatialReference":{"latestWkid":3857,"wkid":102100},"x":clickCoordinate[0],"y":clickCoordinate[1]},
			// 	geometry: clickCoordinate, // where in CRS we clicked
			// 	// layer: {"id":"5"},
			// 	geometryType: 'esriGeometryPoint',
			// 	spatialRel: "esriSpatialRelIntersects",
			// 	units:'esriSRUnit_Meter',
			// 	distance: 1000,
			// 	sr: map.getView().getProjection().getCode().split(/:(?=\d+$)/).pop(),
			// 	// layers: `all:${server.layers}`, // query all the layer ids for htis map server built above
			// 	tolerance: 5,
			// 	// mapExtent: map.getView().calculateExtent(), // get map extent
			// 	// imageDisplay: `${map.getSize()},72`,  // get map size/resolution
			// 	returnGeometry: false, // I don't want geometry, but you might want to display it on a 'selection layer'
			// 	f: 'json'

			// 	// inSR:102100,
			// 	// outSR:102100
			// 	}
			// 	const url = new URL(`${server.url}/5/query`)
			// 	url.search = new URLSearchParams(query)
			// 	return url
			// })
			// requestUrls.forEach((url)=>{
			// 	axios.get(url).then((response) => {
			// 		console.log(response.data);
			// 	  });
			// })
		}
	
		// console.log(currentInfos) // do with these as you would, like throw them in a popup. 
	}
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
		
		return () => {
			if (!mapObject) return;
			mapObject.setTarget(undefined)
		};
	}, []);

	// map events
	useEffect(()=>{

		if (!map) return;
		const viewResolution = /** @type {number} */ (map.getView().getResolution());
		map.on('click',infoClickHandler)
		// map.on('click',evt=>{
		// 	const pixel = map.getEventPixel(evt.originalEvent)

		// 	map.getLayers().forEach((layer)=>{
		// 		console.log( layer.get("name"))
		// 		if(layer.get("name") == 'streams_layer'){
					
		// 		}
		// 	})

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

