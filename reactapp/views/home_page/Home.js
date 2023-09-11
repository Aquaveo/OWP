import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SpanBadge } from 'components/styles/Badge.styled';
import Layers from "../../components/layers/Layers";
import Controls from "components/control/Controls";

import { SwitchLayerControl } from "components/control/switchLayers";
import { OlTileLayer } from "../../components/layers/OlTileLayer";
import { OlImageTileLayer } from "../../components/layers/OlImageTileLayer";
import { ReMap } from "../../components/map/ReMap";
import { TileImageArcGISRest } from "../../components/source/TileImageArcGISRest";
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import { WMSTile } from "../../components/source/TileWMS";
import { VectorLayer } from "components/layers/VectorLayer";
import { VectorSourceLayer } from "components/source/Vector"; 
import VectorSource from 'ol/source/Vector'
import {Stroke, Style} from 'ol/style.js';
import Feature from 'ol/Feature.js';

import { useEffect, useState, useReducer, useRef } from 'react';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import LineString from 'ol/geom/LineString.js';
import { Circle } from 'ol/geom';

import { MainContainer } from "components/styles/ContainerMain.styled";
import { ModalContainer } from "components/styles/Modal.styled";
import { SwitchControllerContainer } from "components/styles/SwitchLayerControl.styled";
import PlotView from "./Plot"; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import  ButtonToolbar  from "react-bootstrap/ButtonToolbar";
import { Badge } from "react-bootstrap";
import ToggleButton from 'react-bootstrap/ToggleButton';
import { LineChart } from "components/plots/linePlot";
import appAPI from "services/api/app";
import { LoaderContainer } from 'components/styles/Loader.styled';



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
  const [currentStationID, setCurrentStationID] = useState(-99999);
  const [isUpdatePlot, setIsUpdatePlot] = useState(false);
  const [metadata, setMetadata] = useState([]);
  const currentProductsInitial =
  {
    analysis_assim:{
      'is_requested': true,
      'name_product': 'analysis_assim',
      'color':'#ff8c66',
      'data':[],
      'is_latest': true,
      'tooltip_text':'AnA'
    },
    short_range: {
      'is_requested': false,
      'name_product': 'short_range',
      'color':'#ff6699',
      'data':[],
      'is_latest': true,
      'tooltip_text':'SR'
    },    

    long_range_ensemble_mean: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_mean',
      'color': '#8ca9ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'LR-Mean'
    },
    long_range_ensemble_member_1:{
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_1',
      'color': '#8ca9ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'LR-1'
    },
    long_range_ensemble_member_2: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_2',
      'color': '#8ca9ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'LR-2'
    },
    long_range_ensemble_member_3: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_3',
      'color': '#8ca9ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'LR-3'
    },
    long_range_ensemble_member_4: {
      'is_requested': false,
      'name_product': 'long_range_ensemble_member_4',
      'color': '#8ca9ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'LR-4'
    },
    medium_range_ensemble_mean:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_mean',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-Mean'
    },
    medium_range_ensemble_member_1:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_1',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-1'
    },
    medium_range_ensemble_member_2:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_2',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-2'
    },
    medium_range_ensemble_member_3:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_3',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-3'
    },
    medium_range_ensemble_member_4:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_4',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-4'
    },
    medium_range_ensemble_member_5:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_5',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-5'
    },
    medium_range_ensemble_member_6:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_6',
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-6'
    },
    medium_range_ensemble_member_7:{
      'is_requested': false,
      'name_product': 'medium_range_ensemble_member_7',
      'color': '#d966ff',
      'data': [],
      'is_latest': true,
      'tooltip_text':'MR-7'
    }
}

  const [currentProducts, setCurrentProducts] = useReducer(reducerProducts, currentProductsInitial);
  const [currentReachIdGeometry, setCurrentReachIdGeometry] = useState(new VectorSource());
  const [isPlotReady, setIsPlotReady] = useState(false); 

  const handleClose = () => setshowModal(false);
  const handleShow = () => setshowModal(true);
  const handlePlotUpdate = () => {setIsUpdatePlot((current) => !current);}
  
  const handleShowLoading = () => setIsPlotReady(true);
  const handleHideLoading = () => setIsPlotReady(false);

  const handleProductsUpdate = (type,is_requested,data) => {
    setCurrentProducts ({ type: type, is_requested: is_requested,data:data })
    handlePlotUpdate()
  }

  function reducerProducts(state, action) {
    //only changing object
    // setIsUpdatePlot((current) => !current);
    switch (action.type) {
      case 'analysis_assim':
        return { ...state, analysis_assim : {... state['analysis_assim'], 'is_requested': action.is_requested,'data': action.data } };
        // return { ...state, analysis_assim : {... state['analysis_assim'], 'is_requested': !state['analysis_assim']['is_requested'] } };
      case 'short_range':
        return { ...state, short_range: {... state['short_range'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'long_range_ensemble_mean':
          return { ...state, long_range_ensemble_mean: {... state['long_range_ensemble_mean'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'long_range_ensemble_member_1':
        return { ...state, long_range_ensemble_member_1: {... state['long_range_ensemble_member_1'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'long_range_ensemble_member_2':
        return { ...state, long_range_ensemble_member_2: {... state['long_range_ensemble_member_2'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'long_range_ensemble_member_3':
        return { ...state, long_range_ensemble_member_3: {... state['long_range_ensemble_member_3'], 'is_requested': action.is_requested, 'data': action.data }};   
      case 'long_range_ensemble_member_4':
        return { ...state, long_range_ensemble_member_4: {... state['long_range_ensemble_member_4'], 'is_requested': action.is_requested, 'data': action.data }}; 

      case 'medium_range_ensemble_mean':
        return { ...state, medium_range_ensemble_mean: {... state['medium_range_ensemble_mean'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'medium_range_ensemble_member_1':
        return { ...state, medium_range_ensemble_member_1: {... state['medium_range_ensemble_member_1'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'medium_range_ensemble_member_2':
        return { ...state, medium_range_ensemble_member_2: {... state['medium_range_ensemble_member_2'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'medium_range_ensemble_member_3':
        return { ...state, medium_range_ensemble_member_3: {... state['medium_range_ensemble_member_3'], 'is_requested': action.is_requested, 'data': action.data }};   
      case 'medium_range_ensemble_member_4':
        return { ...state, medium_range_ensemble_member_4: {... state['medium_range_ensemble_member_4'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case 'medium_range_ensemble_member_5':
        return { ...state, medium_range_ensemble_member_5: {... state['medium_range_ensemble_member_5'], 'is_requested': action.is_requested, 'data': action.data }};
      case 'medium_range_ensemble_member_6':
          return { ...state, medium_range_ensemble_member_6: {... state['medium_range_ensemble_member_6'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case 'medium_range_ensemble_member_7':
          return { ...state, medium_range_ensemble_member_7: {... state['medium_range_ensemble_member_7'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case 'reset':
        return currentProductsInitial
      
      default:
        throw new Error();
    }
  }

  useEffect(() => {
    /* 
      Load the regions of the user
    */
    let dataRequest = {}
    appAPI.getUserRegions();
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
      socketRef.current.onmessage = function (e) {
        let data = JSON.parse(e.data);
        
        let product_name = data['product'];
        console.log("receiving data socket")
        let ts = data['data'][0]['data'].map(obj => ({
          value: obj.value,
          'forecast-time': new Date(obj['forecast-time']).getTime()
        }));
        setCurrentProducts({type: product_name,is_requested:true, data: ts});
        handlePlotUpdate();
        // handleisPlotReady();
      }
	}, []);
  useEffect(() => {
    // here we have changed the currrent products object, so we can send something to the web sockets
    console.log("useEffect currentProducts Home")
    const updatedProducts = {}
    for (const key in currentProducts) {
      const nestedObject = currentProducts[key];
      if (nestedObject['is_requested'] === true && nestedObject['data'].length === 0) {
        updatedProducts[key] = nestedObject;
      }
    }
    console.log(updatedProducts);
    if (Object.keys(updatedProducts).length && currentStationID > 0 ) {
      let dataRequest = {
        station_id: currentStationID,
        products: updatedProducts
      }
      appAPI.getForecastData(dataRequest);
    }

	}, [currentProducts]);

  useEffect(()=>{
    console.log("useEffect currentStationID Home")
    // setCurrentProducts({type: "reset"})
    //send message to web socket to start again 
    handlePlotUpdate();
  },[currentStationID])

  return (
    
    <div>
      { isPlotReady &&
        <LoaderContainer>
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </LoaderContainer>        
      }

    

    <MainContainer>
        <ReMap isFullMap={isFullMap} 
          center={fromLonLat([-94.9065, 38.9884])} 
          zoom={5} 
          layerGroups={groupLayers} 
          handleShow={handleShow} 
          setCurrentStation={setCurrentStation} 
          currentProducts={currentProducts} 
          setCurrentStationID={setCurrentStationID} 
          setCurrentProducts={setCurrentProducts} 
          setCurrentReachIdGeometry={setCurrentReachIdGeometry}
          handleShowLoading={handleShowLoading}
          setMetadata = {setMetadata}
        >

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
                // LAYERS:"show:1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21"
                // LAYERS:"show:5,12,19,21"
                LAYERS:"show:1,2,3,4,5,6,21"
              })}
              name={"streams_layer"}
              groupLayerName={"NWM Stream Analysis"}
              groupLayers = {groupLayers}
            />
            {/* <VectorLayer
              name={"reach_vector"}
              source={currentReachIdGeometry}
              style={
                new Style({                  
                  stroke : new Stroke({ 
                      color: '#e1ff00',
                      width: 5
                  })
                })
              }
              
          /> */}

          </Layers>
          <Controls>
              <SwitchControllerContainer>
                <SwitchLayerControl/>
              </SwitchControllerContainer>

          </Controls>
        </ReMap>
      </MainContainer>

        <ModalContainer>
          <Modal show={showModal} onHide={handleClose} centered size="xl" >
            <Modal.Header closeButton>
              <Modal.Title>{metadata[0]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
              <Tabs
                defaultActiveKey="forecast-tab"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="forecast-tab" title="Forecast">
                  <Container>
                      <Row>
                        <Col md="3">
                            <ButtonGroup className="mb-2" size="sm">

                              <ToggleButton
                              id="toggle-check-analysis_assim"
                              className="me-2 btn-sm"
                              type="checkbox"
                              variant="outline-primary"
                              checked={currentProducts['analysis_assim']['is_requested']}
                              value={currentProducts['analysis_assim']['name_product']}
                              onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['analysis_assim']['is_requested'], currentProducts['analysis_assim']['data'])}
                              >
                              <SpanBadge>
                                Analysis and Assimilation
                              </SpanBadge>
                              </ToggleButton>
                            </ButtonGroup>
                        </Col>
                      </Row>
                  </Container>

                  <Container>
                    <Row>

                      <Col md="3">
                        <ButtonGroup className="mb-2 w-100" size="sm">

                          <ToggleButton
                            id="toggle-check-short_range"
                            className="me-2 btn-sm w-100"
                            type="checkbox"
                            variant="outline-primary"
                            checked={currentProducts['short_range']['is_requested']}
                            value={currentProducts['short_range']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['short_range']['is_requested'], currentProducts['short_range']['data'])}
                          >
                              <SpanBadge>
                                Short Range Forecast
                              </SpanBadge>
                          </ToggleButton>
                        </ButtonGroup>

                      </Col>
                    </Row>
                  </Container>

                  <Container>
                    <Row>
                      <Col md="3">
                        <Button variant="secondary" size="sm" className="me-2 w-100" >
                          <Badge bg="secondary">Long Range Forecast</Badge>
                        </Button>
                      </Col>
                      <Col>
                        <ButtonGroup className="mb-2" size="sm">
                          <ToggleButton
                          id="toggle-check-long_range_mean"
                          className="me-2 btn-sm"
                          type="checkbox"
                          variant="outline-primary"
                          checked={currentProducts['long_range_ensemble_mean']['is_requested']}
                          value={currentProducts['long_range_ensemble_mean']['name_product']}
                          onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['long_range_ensemble_mean']['is_requested'], currentProducts['long_range_ensemble_mean']['data'])}                    
                        >
                          <SpanBadge>Mean</SpanBadge>
                        </ToggleButton>
                          <ToggleButton
                            id="toggle-check-long_range_1"
                            type="checkbox"
                            className="me-2 btn-sm"

                            variant="outline-primary"
                            checked={currentProducts['long_range_ensemble_member_1']['is_requested']}
                            value={currentProducts['long_range_ensemble_member_1']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['long_range_ensemble_member_1']['is_requested'], currentProducts['long_range_ensemble_member_1']['data'])}
                          >
                            
                            <SpanBadge>1</SpanBadge>
                          
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check-long_range_2"
                            className="me-2 btn-sm"
                            type="checkbox"
                            variant="outline-primary"
                            checked={currentProducts['long_range_ensemble_member_2']['is_requested']}
                            value={currentProducts['long_range_ensemble_member_2']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['long_range_ensemble_member_2']['is_requested'], currentProducts['long_range_ensemble_member_2']['data'])}
                          >
                          <SpanBadge>2</SpanBadge>
                        </ToggleButton>                  
                        <ToggleButton
                            id="toggle-check-long_range_3"
                            className="me-2 btn-sm"
                            type="checkbox"
                            variant="outline-primary"
                            checked={currentProducts['long_range_ensemble_member_3']['is_requested']}
                            value={currentProducts['long_range_ensemble_member_3']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['long_range_ensemble_member_3']['is_requested'], currentProducts['long_range_ensemble_member_3']['data'])}
                          >
                          <SpanBadge>3</SpanBadge>
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check-long_range_4"
                            type="checkbox"
                            className="me-2 btn-sm"
                            variant="outline-primary"
                            checked={currentProducts['long_range_ensemble_member_4']['is_requested']}
                            value={currentProducts['long_range_ensemble_member_4']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['long_range_ensemble_member_4']['is_requested'], currentProducts['long_range_ensemble_member_4']['data'])}
                          >
                          <SpanBadge>4</SpanBadge>
                        </ToggleButton>
                        </ButtonGroup>

                      </Col>
                    </Row>
                  </Container>

                  <Container>
                    <Row>
                      <Col md="3">
                        <Button variant="secondary" size="sm" className="me-2 w-100" >
                          <Badge bg="secondary">Medium Range Forecast</Badge>
                        </Button>
                      </Col>
                      <Col>
                        <ButtonGroup className="mb-2" size="sm">
                          <ToggleButton
                          id="toggle-check-medium_range_mean"
                          className="me-2 btn-sm"
                          type="checkbox"
                          variant="outline-primary"
                          checked={currentProducts['medium_range_ensemble_mean']['is_requested']}
                          value={currentProducts['medium_range_ensemble_mean']['name_product']}
                          onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_mean']['is_requested'], currentProducts['medium_range_ensemble_mean']['data'])}                    
                        >
                          <SpanBadge>Mean</SpanBadge>
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check-medium_range_1"
                            type="checkbox"
                            className="me-2 btn-sm"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_1']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_1']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_1']['is_requested'], currentProducts['medium_range_ensemble_member_1']['data'])}
                          >
                          <SpanBadge>1</SpanBadge>
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check-medium_range_2"
                            className="me-2 btn-sm"
                            type="checkbox"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_2']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_2']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_2']['is_requested'], currentProducts['medium_range_ensemble_member_2']['data'])}
                          >
                          <SpanBadge>2</SpanBadge>
                        </ToggleButton>                  
                        <ToggleButton
                            id="toggle-check-medium_range_3"
                            className="me-2 btn-sm"
                            type="checkbox"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_3']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_3']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_3']['is_requested'], currentProducts['medium_range_ensemble_member_3']['data'])}
                          >
                          <SpanBadge>3</SpanBadge>                      
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check-medium_range_4"
                            type="checkbox"
                            className="me-2 btn-sm"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_4']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_4']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_4']['is_requested'], currentProducts['medium_range_ensemble_member_4']['data'])}
                          >
                          <SpanBadge>4</SpanBadge>
                        </ToggleButton>

                        <ToggleButton
                            id="toggle-check-medium_range_5"
                            type="checkbox"
                            className="me-2 btn-sm"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_5']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_5']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_5']['is_requested'], currentProducts['medium_range_ensemble_member_5']['data'])}
                          >
                            <SpanBadge>5</SpanBadge>
                        </ToggleButton>    

                        <ToggleButton
                            id="toggle-check-medium_range_6"
                            type="checkbox"
                            className="me-2 btn-sm"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_6']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_6']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_6']['is_requested'], currentProducts['medium_range_ensemble_member_6']['data'])}
                          >
                            <SpanBadge>6</SpanBadge>
                        </ToggleButton>
                        <ToggleButton
                            id="toggle-check-medium_range_7"
                            type="checkbox"
                            className="me-2 btn-sm"
                            variant="outline-primary"
                            checked={currentProducts['medium_range_ensemble_member_7']['is_requested']}
                            value={currentProducts['medium_range_ensemble_member_7']['name_product']}
                            onChange={(e) => handleProductsUpdate(e.currentTarget.value,!currentProducts['medium_range_ensemble_member_7']['is_requested'], currentProducts['medium_range_ensemble_member_7']['data'])}
                          >
                            <SpanBadge>7</SpanBadge>
                        </ToggleButton>
                      </ButtonGroup>
                      
                      </Col>
                    </Row>
                  </Container>
                  <Container>
                    <Row>
                      <Col>
                        <LineChart data={currentProducts} isUpdatePlot={isUpdatePlot} metadata={metadata} handleHideLoading={handleHideLoading} />
                      </Col>
                    </Row>
                  </Container>
                </Tab>
                <Tab eventKey="historical-tab" title="Historical Data">
                
                </Tab>
                <Tab eventKey="averages-tab" title="Daily-Monthly Averages">
                  Tab content for Loooonger Tab
                </Tab>

              </Tabs>

              </Container>


            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </ModalContainer>
    </div>

  );
}
export default App;


