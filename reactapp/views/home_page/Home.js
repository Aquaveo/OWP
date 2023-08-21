import Layers from "../../components/layers/Layers";
import Controls from "components/control/Controls";

import { SwitchLayerControl } from "components/control/switchLayers";
import { OlTileLayer } from "../../components/layers/OlTileLayer";
import { OlImageTileLayer } from "../../components/layers/OlImageTileLayer";
import { ReMap } from "../../components/map/ReMap";
import { TileImageArcGISRest } from "../../components/source/TileImageArcGISRest";
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import { WMSTile } from "../../components/source/TileWMS";

import { useState } from 'react';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';


import { MainContainer } from "components/styles/ContainerMain.styled";
import { SwitchControllerContainer } from "components/styles/SwitchLayerControl.styled";
// import { Modal } from "components/modal/modal";
import PlotView from "./Plot"; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer'
function App() {
  const [isFullMap, setIsFullMap] = useState(true)
  const [groupLayers, setGroupLayers] =  useState([
    new LayerGroup({
      title: "Basemaps",
      layers: []
    }),
    new LayerGroup({
      title: "NWM Stream Analysis",
      layers: []
    })
  ]);
  const [showModal, setshowModal] = useState(false);
  const handleClose = () => setshowModal(false);
  const handleShow = () => setshowModal(true);
  return (
    <div>
    <MainContainer>
        <ReMap isFullMap={isFullMap} center={fromLonLat([-94.9065, 38.9884])} zoom={5} layerGroups={groupLayers} handleShow={handleShow} >
          <Layers>


            <OlTileLayer
              source={ArcGISRestTile(baseMapLayerURL, {
                LAYERS: "topp:states",
                Tiled: true,
              })}
              name={"basemap_1"}
              groupLayerName={"Basemaps"}
              groupLayers = {groupLayers}
            />                    
            <OlImageTileLayer
              source={TileImageArcGISRest(StreamLayerURL, {
                LAYERS:"show:1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21"
                // LAYERS:"show:5,12,19,21"
              })}
              name={"streams_layer"}
              groupLayerName={"NWM Stream Analysis"}
              groupLayers = {groupLayers}
            />

          </Layers>
          <Controls>
              <SwitchControllerContainer>
                <SwitchLayerControl/>
              </SwitchControllerContainer>

          </Controls>
        </ReMap>
      </MainContainer>
      {/* <Modal
      shouldShow={showModal}
      onRequestClose={() => {
        setshowModal((prev) => !prev);
      }}
    >
      <PlotView/>
    </Modal> */}

      <Modal show={showModal} onHide={handleClose} size="lg" centered >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body><PlotView/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}
export default App;