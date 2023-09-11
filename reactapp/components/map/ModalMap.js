import { useRef, useState, useEffect } from "react"
import "./Map.css";
import Map from "ol/Map";
import MapContext from "./MapContext";

import View from "ol/View";

import { MapContainer } from '../styles/Map.styled'



export const ModalMap = (
	{ 
		children, 
		isFullMap, 
		zoom, 
        center
	}) => 
	
	{
	
	const [mapModal, setMapModal] = useState(null);
	const mapModalRef = useRef();

	// on component mount
	useEffect(() => {
		console.log("usEffect Map.js");
		let options = {
			view: new View({ zoom, center }),
			layers: [],
			controls: [],
			overlays: []
		};

		let mapObject = new Map(options);
		mapObject.setTarget(mapModalRef.current);
		setMapModal(mapObject);

		mapObject.on('click',function(){
            console.log("new click")
        })

		return () => {
			if (!mapObject) return;
			mapObject.setTarget(undefined)
		};
	}, []);

	// map events
	useEffect(()=>{

		if (!mapModal) return;
		mapModal.on('pointermove',evt=>{

			if (evt.dragging) return;

		});
	},[mapModal])


	return (
		<MapContainer isFullMap={isFullMap} >
			<MapContext.Provider value={{ mapModal }}>
				<div ref={mapModalRef} className="ol-map" >
						{children}
				</div>
			</MapContext.Provider>
		</MapContainer>

	)
}
