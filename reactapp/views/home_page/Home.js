import Layers from "../../components/layers/Layers";
import Controls from "components/control/Controls";

import { SwitchLayerControl } from "components/control/switchLayers";
import { OlTileLayer } from "../../components/layers/OlTileLayer";
import { OlImageTileLayer } from "../../components/layers/OlImageTileLayer";
import { ReMap } from "../../components/map/ReMap";
import { TileImageArcGISRest } from "../../components/source/TileImageArcGISRest";
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import { WMSTile } from "../../components/source/TileWMS";

import { useEffect, useState, useReducer, useRef } from 'react';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';


import { MainContainer } from "components/styles/ContainerMain.styled";
import { SwitchControllerContainer } from "components/styles/SwitchLayerControl.styled";
import PlotView from "./Plot"; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { LineChart } from "components/plots/linePlot";

const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';
// const ws = 'ws://' + window.location.href.split('//')[1].split('owp')[0] + 'owp' +'/data-notification/notifications/ws/';
const ws = 'ws://' + 'localhost:8000/apps/owp' + '/data-notification/notifications/ws/';
function App() {
  const socketRef = useRef();
  // const [dataChartObject, setDataChartObject] = useState({})
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
  const [currentStation, setCurrentStation] = useState();
  const currentProductsInitial =
  {
    analysis_assim:{
      'is_requested': true,
      'name_product': 'analysis_assim',
      'data':[]
    },
    short_range: {
      'is_requested': true,
      'name_product': 'short_range',
      'data':[]
    },    

    long_range_ensemble_mean: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_mean',
      'data':[]
    },
    long_range_ensemble_member_1:{
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_1',
      'data':[]
    },
    long_range_ensemble_member_2: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_2',
      'data':[]
    },
    long_range_ensemble_member_3: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_3',
      'data':[]
    },
    long_range_ensemble_member_4: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_4',
      'data':[]
    },
    medium_range_ensemble_mean:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_mean',
      'data':[]
    },
    medium_range_ensemble_member_1:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_1',
      'data':[]
    },
    medium_range_ensemble_member_2:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_2',
      'data':[]
    },
    medium_range_ensemble_member_3:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_3',
      'data':[]
    },
    medium_range_ensemble_member_4:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_4',
      'data':[]
    },
    medium_range_ensemble_member_5:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_5',
      'data':[]
    },
    medium_range_ensemble_member_6:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_6',
      'data':[]
    },
    medium_range_ensemble_member_7:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_7',
      'data': []
    }
}

const [currentProducts, setCurrentProducts] = useReducer(reducerProducts, currentProductsInitial);


function reducerProducts(state, action) {
  switch (action.type) {
    case 'analysis_assim':
      return { ...state, analysis_assim : {... state['analysis_assim'], 'is_requested': !state['analysis_assim']['is_requested'],'data': action.data } };
      // return { ...state, analysis_assim : {... state['analysis_assim'], 'is_requested': !state['analysis_assim']['is_requested'] } };
    case 'short_range':
      return { ...state, short_range: {... state['short_range'], 'is_requested': !state['short_range']['is_requested'], 'data': action.data }};
    // case 'reset':
    //   return { isRunning: false, time: 0 };
    // case 'tick':
    //   return { ...state, time: state.time + 1 };
    default:
      throw new Error();
  }
}


  const handleClose = () => setshowModal(false);
  const handleShow = () => setshowModal(true);
  

  let data = [
    {
      category: "Research",
      value1: 1000,
      value2: 588
    },
    {
      category: "Marketing",
      value1: 1200,
      value2: 1800
    },
    {
      category: "Sales",
      value1: 850,
      value2: 1230
    }
  ];

  useEffect(() => {
    console.log("ahah")
    socketRef.current = new WebSocket(ws);
      socketRef.current.onopen = () => {
        console.log("WebSocket is Open");
      };
    
      socketRef.current.onclose = function () {
        // Try to reconnect in 1 second
        setTimeout(function () {
          //implement more logic
          // this.startWS(websocketServerLocation);
        }, 1000);
        console.log("WebSocket is Closed");
      };
	}, []);
  useEffect(() => {
    console.log("useEffect 2 Home")
    socketRef.current.onmessage = function (e) {
      let data = JSON.parse(e.data);
      let product_name = data['product'];
      let ts = data['data'][0]['data'];
      setCurrentProducts({type: product_name, data: ts});
    }
    // console.log(currentProducts)
	}, [currentStation,currentProducts]);

  return (
    <div>
    <MainContainer>
        <ReMap isFullMap={isFullMap} center={fromLonLat([-94.9065, 38.9884])} zoom={5} layerGroups={groupLayers} handleShow={handleShow} setCurrentStation={setCurrentStation} currentProducts={currentProducts} setCurrentProducts={setCurrentProducts} >
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


      <Modal show={showModal} onHide={handleClose} size="lg" centered >
        <Modal.Header closeButton>
          <Modal.Title>{currentStation}</Modal.Title>

          
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="configuration-tab"
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            <Tab eventKey="configuration-tab" title="Configuration">

              <ButtonGroup className="mb-2">
                <ToggleButton
                  id="toggle-check-analysis_assim"
                  type="checkbox"
                  variant="outline-primary"
                  checked={currentProducts['analysis_assim']['is_requested']}
                  value={currentProducts['analysis_assim']['name_product']}
                  onChange={(e) => setCurrentProducts({ type: e.currentTarget.value, data:currentProducts['analysis_assim']['data'] })}
                >
                  Analysis and Assimilation
                </ToggleButton>
                <ToggleButton
                  id="toggle-check-short_range"
                  type="checkbox"
                  variant="outline-primary"
                  checked={currentProducts['short_range']['is_requested']}
                  value={currentProducts['short_range']['name_product']}
                  onChange={(e) => setCurrentProducts({ type: e.currentTarget.value, data:currentProducts['short_range']['data'] })}
                >
                  Short Range Forecast
                </ToggleButton>
              </ButtonGroup>              
              <LineChart data={currentProducts}/>
            </Tab>
            <Tab eventKey="metadata-tab" title="Metadata">
             
            </Tab>
            <Tab eventKey="info-tab" title="Info">
              Tab content for Loooonger Tab
            </Tab>

          </Tabs>
          
        
        
        
        </Modal.Body>
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


{/* <Dropdown className="d-inline mx-2">
<Dropdown.Toggle id="dropdown-autoclose-true">
  Long Range Forecast
</Dropdown.Toggle>

<Dropdown.Menu>
  <Dropdown.Item href="#">30 day Ensemble Mean</Dropdown.Item>
  <Dropdown.Item href="#">
    <div>
      <Dropdown className="d-inline mx-2">
        <Dropdown.Toggle id="dropdown-ensembles-autoclose-true">
          30 day Ensembles
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#"> Member 1</Dropdown.Item>
          <Dropdown.Item href="#"> Member 2</Dropdown.Item>
          <Dropdown.Item href="#"> Member 3</Dropdown.Item>
          <Dropdown.Item href="#"> Member 4</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>


  </Dropdown.Item>
</Dropdown.Menu>
</Dropdown> */}