//Boostrap components
import { Badge, Container,Row,Col,Modal,Button,Tab,Tabs,ButtonGroup,ToggleButton} from "react-bootstrap";

//Maps components
import Layers from "components/layers/Layers";
import { OlTileLayer } from "components/layers/OlTileLayer";
import { OlImageTileLayer } from "components/layers/OlImageTileLayer";
import { ReMap } from "components/map/ReMap";
import { TileImageArcGISRest } from "components/source/TileImageArcGISRest";
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import { VectorLayer } from "components/layers/VectorLayer";
import { LineChart } from "components/plots/linePlot";

//Menus Components
import { SideMenuWrapper } from 'components/menus/SideMenuRegions';
import { RegionMenuWrapper } from 'components/menus/RegionMenu';
import { CircularMenuComponent } from 'components/customHamburger/customHamburger';
import { ReachListMenu } from "components/menus/ReachListBasedMenu";
import { RegionFormFromHydroShare } from "components/menus/AddRegionMenuFromHydroShare";
import MenuWrapper from "components/menus/CircleMenu";
//Hooks components
import { useEffect, useState, useReducer, useRef } from 'react';

//OL modules
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector'
import {Stroke, Style} from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON';
import appAPI from "services/api/app";

//Styles modules
import { SpanBadge } from 'components/styles/Badge.styled';
import { MainContainer } from "components/styles/ContainerMain.styled";
import { ModalContainer } from "components/styles/Modal.styled";
import { LoaderContainer } from 'components/styles/Loader.styled';

import { showToast } from "services/notifications/notificationService";
import { Toaster } from 'react-hot-toast';
import { Notification } from "components/notifications/notification";
import { CustomNotification } from 'components/styled-components/BsNotification.styled';

import logo from "css/hs-icon-sm.png"
const StreamLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer';
const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';
const WbdMapLayerURL = 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer'


const ws = 'ws://' + 'localhost:8000/apps/owp' + '/data-notification/notifications/ws/';


function App(
  {
    showRegionsMenu,
    showReachesListMenu,
    handleShowRegionMenu,
    handleShowReachesListRegionMenu,
    toggleAddRegionMenu,
    toggleReachesListRegionMenu,
    showRegions, 
    setShowRegionsVisible, 
    setAvailableRegions, 
    availableRegions,
    showMainRegionsMenu,
    handleShowMainRegionMenu,
    showAddRegionMenuFromHydroShare,
    handleShowAddRegionMenuFromHydroShare,
    toggleShowAddRegionMenuFromHydroShare,
    isHydroShareLogin,
    setIsHydroShareLogin

  }
) 
  {
  
  const socketRef = useRef();
  // const [isHydroShareLogin, setIsHydroShareLogin] = useState(false)
  const [hydroshareRegionsOptions, setHydroShareRegionsOptions] = useState([])
  // const [hydrosharePrivateRegionsOptions, setHydroSharePrivateRegionsOptions] = useState([])
  const [currentReachGeometryOnClick, setCurrentReachGeometryOnClick] = useState(null)
  const [currentReachGeometry, setCurrentReachGeometry] = useState(null)
  // const [curentRegion, setCurrentRegion] = useState({});
  const [loadingText, setLoadingText] = useState("Loading Layers ...")
  const [isFullMap, setIsFullMap] = useState(true)
  const [selectedHucs, setSelectedHucs] = useState("show:2,3,4,5,6,7,8");
  const [previewFile, setPreviewFile] = useState(null);
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

	const currentSelectedRegions = []

	const [selectedRegions, setSelectedRegions] = useReducer(reducerSelectedRegions, []);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [selectedRegionDropdownItem, setSelectedRegionDropdownItem] =  useState({});
  const [currentPage, setCurrentPage] = useState(1);

	function reducerSelectedRegions(state, action) {
		switch (action.type) {
		  case 'delete':
			return state.filter(region => region.name !== action.region['name']);
		  case 'add':
			return [ ...state, action.region ];
		  case 'update':
			return removeDuplicatesRegions(state,'name');			
		  case 'reset':
			return currentSelectedRegions ;
		}
	}

  const [availableReachesList, setAvailableReachesList] =  useState([]);
  const [promptTextAvailableReachesList,setPromptTextAvailableReachesList ] = useState('No Reaches to display, Please select a Region');
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const pagesLimit = 50;

  function handleShowAddRegionMenuFromHydroShareWithAsync(){
    handleShowAddRegionMenuFromHydroShare();
    //send mesage to get the different public resources
    socketRef.current.send(
      JSON.stringify({
        type: "retrieve_hydroshare_regions",
      })
    );
  }

  useEffect(() => {

    /* 
      Load the regions of the user
    */
    handleShowLoading();
    setLoadingText("Loading User Regions ...");    
    socketRef.current = new WebSocket(ws);
    socketRef.current.onopen = () => {
      console.log("WebSocket is Open");
      // console.log(availableRegions)
      if(availableRegions.length < 1){
        socketRef.current.send(
          JSON.stringify({
            type: "update_user_regions",
          })
        );

      }
      socketRef.current.send(
        JSON.stringify({
          type: "get_hs_login_status_method",
        })
      );
    };
  
    socketRef.current.onclose = function () {
      // Try to reconnect in 1 second
      setTimeout(function () {
        //implement more logic
        socketRef.current = new WebSocket(ws);
      }, 1000);
      console.log("WebSocket is Closed");
    };
    socketRef.current.onmessage = function (e) {
      // console.log(e)
      let data = JSON.parse(e.data);
      let command = data['command']
      console.log(command)
      if(command ==='update_regions_users'){
        console.log(data)
        setAvailableRegions(data['data']);
        handleHideLoading();
        handleShowMainRegionMenu();
      }
      if(command ==='update_reaches_users'){
        console.log(data);
        setAvailableReachesList(data['data']);
        const numberOfPageItems = Math.ceil(data['total_reaches']/pagesLimit);
        console.log(numberOfPageItems)
        setCurrentPageNumber(numberOfPageItems)
        setAccordionOpen(true);
      }

      if(command ==='Plot_Data_Retrieved'){
        let product_name = data['product'];
        console.log("receiving data socket")
        let ts = data['data'][0]['data'].map(obj => ({
          value: obj.value,
          'forecast-time': new Date(obj['forecast-time']).getTime()
        }));
        setCurrentProducts({type: product_name,is_requested:true, data: ts});
        handlePlotUpdate();
      }

      if(command ==='zoom_to_specific_reach'){
        console.log(data['data'])
        let responseRegions_obj = JSON.parse(data['data']['geometry'])
        setCurrentReachGeometry(responseRegions_obj)
      }
      if(command ==='show_hydroshare_regions_notifications'){
        console.log(data['data'])
        if (data['message'] ==='Not logged in through HydroShare'){
          setIsHydroShareLogin(false)
          // let custom_message=<CustomNotification>
          //   <a href="/oauth2/login/hydroshare/">
          //     <div className="container-hs-notification">
          //       <div>
          //         <img src={logo} className="App-logo" alt="logo" />
          //         Log in with HydroShare
          //       </div>
          //       <div>
          //         <p>Please Login to see your private regions display in the dropdown menu</p>
          //       </div>
          //     </div>

          //   </a>
          // </CustomNotification>
          // showToast('custom',custom_message)
        }
        else{
          setIsHydroShareLogin(true);
        }
        setHydroShareRegionsOptions(data['data'])
        // setHydroSharePrivateRegionsOptions(data['private_data'])
      }
      if(command ==='show_hs_login_status'){
        console.log(data)
        if (data['message'] ==='Not logged in through HydroShare'){
          setIsHydroShareLogin(false);
          // let custom_message=<CustomNotification>
          //   <a href="/oauth2/login/hydroshare/">
          //     <div className="container-hs-notification">
          //       <div>
          //         <img src={logo} className="App-logo" alt="logo" />
          //         Log in with HydroShare
          //       </div>
          //       <div>
          //         <p>Please Login to see your private regions display in the dropdown menu</p>
          //       </div>
          //     </div>

          //   </a>
          // </CustomNotification>
          // showToast('custom',custom_message)
        }
        else{
          setIsHydroShareLogin(true);

        }
      }

      if(command ==='nwm_spark_Data_Retrieved'){
        try {
          console.log(JSON.parse(data['data']));
          let sparkLineData = JSON.parse(data['data'])
          let plot_data = sparkLineData.map((reach) => reach.streamflow)
          let comidToUpdate = data['feature_id']
          setAvailableReachesList(prevList =>
            prevList.map(item =>
              item.COMID === comidToUpdate
                ? { ...item, long_forecast: plot_data }
                : item
            )
          );
        } catch (error) {
          console.log(error)
        }
      }
      

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
    //send message to web socket to start again 
    handlePlotUpdate();
  },[currentStationID])





  useEffect(() => {
    console.log(availableRegions)
    return () => {
    }
  }, [availableRegions])

  useEffect(() => {
    console.log(availableReachesList)
    if(availableReachesList.length > 0){
      setPromptTextAvailableReachesList(`Page ${currentPage} of ${currentPageNumber}`);
    }
    else{
      setPromptTextAvailableReachesList(`No Reaches found`)

    }
	}, [availableReachesList]);
  
  return (
    
    <div>
    <LoaderContainer isVisible={isPlotReady}>
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <div><span className='loading-tex-span'>{loadingText}</span></div>
      </div>
    </LoaderContainer>

    <Notification/>

    <MainContainer >

        <ReMap 
          isFullMap={isFullMap}
          zoom={5}
          center={fromLonLat([-94.9065, 38.9884])} 
          handleShow={handleShow} 
          setCurrentStation={setCurrentStation} 
          currentProducts={currentProducts} 
          setCurrentStationID={setCurrentStationID} 
          setCurrentProducts={setCurrentProducts} 
          setCurrentReachIdGeometry={setCurrentReachIdGeometry}
          handleShowLoading={handleShowLoading}
          setMetadata = {setMetadata}
          selectedRegions={selectedRegions}
          setSelectedRegions={setSelectedRegions}
          handleHideLoading={handleHideLoading}
          setLoadingText={setLoadingText}
          setCurrentReachGeometryOnClick={setCurrentReachGeometryOnClick}
          setCurrentReachGeometry={setCurrentReachGeometry}
        >
          {/* <MenuWrapper /> */}
          <CircularMenuComponent 
            handleShowRegionMenu={handleShowRegionMenu}
            handleShowReachesListRegionMenu={handleShowReachesListRegionMenu}
            handleShowAddRegionMenuFromHydroShareWithAsync={handleShowAddRegionMenuFromHydroShareWithAsync}
          />

          <RegionMenuWrapper 
            isAccordionOpen={isAccordionOpen}
            setAccordionOpen={setAccordionOpen}
            showMainRegionsMenu={showMainRegionsMenu} 
            availableRegions={availableRegions} 
            setAvailableRegions={setAvailableRegions}
            socketRef={socketRef}
            availableReachesList={availableReachesList}
            setCurrentStation={setCurrentStation}
            setCurrentStationID={setCurrentStationID}
            setCurrentProducts={setCurrentProducts}
            handleShow={handleShow}
            setMetadata={setMetadata}
            currentPageNumber={currentPageNumber}
            selectedRegionDropdownItem={selectedRegionDropdownItem}
            setSelectedRegionDropdownItem={setSelectedRegionDropdownItem}
            promptTextAvailableReachesList={promptTextAvailableReachesList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            currentReachGeometry={currentReachGeometry}
            setCurrentReachGeometry={setCurrentReachGeometry}
            setCurrentReachGeometryOnClick={setCurrentReachGeometryOnClick}
          />

          <SideMenuWrapper 
            showRegionsMenu={showRegionsMenu}
            toggleAddRegionMenu={toggleAddRegionMenu}
            setShowRegionsVisible={setShowRegionsVisible} 
            selectedRegions={selectedRegions} 
            setAvailableRegions={setAvailableRegions} 
            setSelectedRegions={setSelectedRegions}
            handleShowLoading={handleShowLoading}
            handleHideLoading={handleHideLoading}
            setLoadingText={setLoadingText}
            setPreviewFile={setPreviewFile}
          />
          <ReachListMenu 
            showReachesListMenu={showReachesListMenu}
            toggleReachesListRegionMenu={toggleReachesListRegionMenu}
            setShowRegionsVisible={setShowRegionsVisible} 
            selectedRegions={selectedRegions} 
            setAvailableRegions={setAvailableRegions} 
            setSelectedRegions={setSelectedRegions}
            handleShowLoading={handleShowLoading}
            handleHideLoading={handleHideLoading}
            setLoadingText={setLoadingText}
            setPreviewFile={setPreviewFile}
          />
          <RegionFormFromHydroShare
            showAddRegionMenuFromHydroShare={showAddRegionMenuFromHydroShare}
            hydroshareRegionsOptions={hydroshareRegionsOptions}
            // hydrosharePrivateRegionsOptions={hydrosharePrivateRegionsOptions}
            setAvailableRegions={setAvailableRegions}
            setSelectedRegions={setSelectedRegions}
            handleHideLoading={handleHideLoading}
            setLoadingText={setLoadingText}
          />
          <Layers>


            <OlTileLayer
              source={ArcGISRestTile(baseMapLayerURL, {
                LAYERS: "topp:states",
                Tiled: true,
              })}
              name={"basemap_1"}
            />                    
            <OlImageTileLayer
              source={TileImageArcGISRest(StreamLayerURL, {
                // LAYERS:"show:1,2,3,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21"
                // LAYERS:"show:5,12,19,21"
                LAYERS:"show:1,2,3,4,5,6,21"
              })}
              name={"streams_layer"}
              zIndex={3}
            />
            { showRegions && 
              <OlImageTileLayer
                source={TileImageArcGISRest(WbdMapLayerURL, {
                  LAYERS:{selectedHucs}
                })}
                name={"huc_levels"}
                zIndex={2}
              />            
            }
            {availableRegions.map((availableRegion, index) => (
              availableRegion.is_visible ?
              <VectorLayer
                  key={index}
                  name={`${availableRegion.name}_user_region`}
                  source= {
                    new VectorSource({
                      format: new GeoJSON(),
                      features: new GeoJSON(
                        {
                          dataProjection: 'EPSG:4326',
                          featureProjection: 'EPSG:3857'
                        }
                      ).readFeatures((availableRegion['geom']))
                  })}
                  style={
                    new Style({
                      stroke: new Stroke({
                      color: availableRegion['layer_color'],
                      width: 3,
                      })
                    })
                  }
                  zIndex={1}
              />:
              <VectorLayer
                key={`${index}_empty`}
                name={"empty_vector_layer"}
              />
            ))}

            {selectedRegions.map((selectedRegion, index) => (
                <VectorLayer
                    key={index}
                    name={`${selectedRegion.name}_selected_region`}
                    source= {
                      new VectorSource({
                        format: new GeoJSON(),
                        url: selectedRegion['url']
                        })
                    }
                    style={
                      new Style({
                        stroke: new Stroke({
                          color: 'green',
                          width: 3,
                        })
                      })
                    }
                    zIndex={1}
                />
              ))}
              {
                previewFile &&
                <VectorLayer
                  name={`preview_file_region`}
                  source= {
                    new VectorSource({
                      format: new GeoJSON(),
                      features: new GeoJSON().readFeatures(previewFile)
                      })
                  }
                  style={
                    new Style({
                      stroke: new Stroke({
                        color: 'green',
                        width: 3,
                      })
                    })
                  }
                  zIndex={1}
                />
              }
              {
                currentReachGeometry &&
                <VectorLayer
                  name={`reach_from_region`}
                  source= {
                    new VectorSource({
                      format: new GeoJSON(),
                      features: new GeoJSON(
                        {
                          dataProjection: 'EPSG:4326',
                          featureProjection: 'EPSG:3857'
                        }
                      ).readFeatures(currentReachGeometry)
                      })
                  }
                  style={
                    new Style({
                      stroke: new Stroke({
                        color: '#f5e154',
                        width: 3,
                      })
                    })
                  }
                  zIndex={4}
                />
              }
              {
                currentReachGeometryOnClick &&
                <VectorLayer
                name={`reach_on_click_from_region`}
                source= {
                  new VectorSource({
                    format: new GeoJSON(),
                    features: new GeoJSON(
                      {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                      }
                    ).readFeatures(currentReachGeometryOnClick)
                    })
                }
                style={
                  new Style({
                    stroke: new Stroke({
                      color: '#f5e154',
                      width: 3,
                    })
                  })
                }
                zIndex={4}
              />
                // <VectorLayer
                //   name={`reach_on_click_from_region`}
                //   source= {
                //     new VectorSource({
                //       features: [currentReachGeometryOnClick]
                //   })
                // }
                //   style={
                //     new Style({
                //       stroke: new Stroke({
                //         color: '#f5e154',
                //         width: 3,
                //       })
                //     })
                //   }
                //   zIndex={4}
                // />
              }

          </Layers>

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


