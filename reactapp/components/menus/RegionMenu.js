
//https://codepen.io/vanderzak/embed/zYxXzmd?height=265&theme-id=light&default-tab=js%2Cresult&user=vanderzak&slug-hash=zYxXzmd&pen-title=React%20Pagination%20Component&name=cp_embed_9

// components
import { SubMenu } from "components/subMenus/submenu";
import MapContext from "components/map/MapContext";

//bootstrap components
import {Accordion,Dropdown,DropdownButton,Form,Col,Row,Button} from 'react-bootstrap';

import React, { useRef, useState, useEffect, useContext } from "react"

//ol modules
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON';
import { Polygon } from "ol/geom";

//icons
import { TbZoomPan } from "react-icons/tb";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

//styles
import { SideMenu } from "components/styles/SideMenu.styled";
import 'css/RegionMenu.css';
import Select, { components, } from "react-select";
import { useForm,UseController, useController } from 'react-hook-form';


export const RegionMenuWrapper = (
  {
    isAccordionOpen,
    setAccordionOpen,
    showMainRegionsMenu, 
    availableRegions, 
    setAvailableRegions,
    socketRef,
    availableReachesList,
    setCurrentStation,
    setCurrentStationID,
    setCurrentProducts,
    handleShow,
    setMetadata,
    currentPageNumber,
    selectedRegionDropdownItem,
    setSelectedRegionDropdownItem,
    promptTextAvailableReachesList,
    currentPage,
    setCurrentPage,
    currentReachGeometry,
    setCurrentReachGeometry,
    setCurrentReachGeometryOnClick

  })=>{

    const toggleAccordion = () => {
      setAccordionOpen(!isAccordionOpen);
    };

    
    const [searchReachInput, setSearchReachInput] = useState('');
    const { register,control, handleSubmit } = useForm();

    const {field} = useController({name: 'hydrosharePublicRegions', control})


    const handleSelectOnChange=(option) =>{
      field.onChange(option.value)
    }
  

    const handleSelectRegionDropdown = (key, event) => {
      const updatedHiddenRegions = availableRegions.map(availableRegion => ({
        ...availableRegion,
        is_visible: false,
      }));
      setAvailableRegions(updatedHiddenRegions);
      setSelectedRegionDropdownItem({
        index:key, 
        value:availableRegions[key].name
      });
      
    };

    const { map } = useContext(MapContext);
    const [currentLayerIndex, setCurrentLayerIndex] = useState();

    const focusSourceVectorLayer = (index) =>{
        const source = new VectorSource({
          format: new GeoJSON(),
          features: new GeoJSON(
            {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
            }
          ).readFeatures(availableRegions[index]['geom'])
        })
        const layerExtent = source.getExtent();

        map.getView().fit(layerExtent, {
            padding: [200, 200, 200, 200], // Optional padding around the extent.
            duration: 1000, // Optional animation duration in milliseconds.
            nearest: true,
            // maxZoom: map.getView().getZoom() -1 
        });

    };

    const toggleVisibilityRegion = () => {
       let index = selectedRegionDropdownItem['index'] ? selectedRegionDropdownItem['index']: 0
       setCurrentLayerIndex(index);
       if (availableRegions[index]['geom']){
          setAvailableRegions((prevData) => {
            // Create a copy of the previous state array
            const newData = [...prevData];
            
            // Toggle the "is_visible" property of the object at the specified index
            newData[index] = { ...newData[index], is_visible: !newData[index].is_visible };
            
            return newData;
          });
          if(!availableRegions[index].is_visible){
              focusSourceVectorLayer(index);
          }
       }


    };

     const zoomToRegionExtent = () => {
      let index = selectedRegionDropdownItem['index'] ? selectedRegionDropdownItem['index']: 0
       if (!map) return;
       setCurrentLayerIndex(index);

       if (!availableRegions[index]['is_visible']) return;
       focusSourceVectorLayer(index);
     };   

    useEffect(() => {
      let index = selectedRegionDropdownItem['index'] ? selectedRegionDropdownItem['index']: 0

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "update_user_reaches",
            region_name: availableRegions[index]['name'],
            page_number: currentPage,
            page_limit: 50,
            search_term: searchReachInput
          })
        );
      }

    }, [selectedRegionDropdownItem,currentPage,searchReachInput])

    useEffect(() => {
      if( availableRegions.length > 0 && availableRegions){
        toggleVisibilityRegion();

      }
    }, [selectedRegionDropdownItem])

    useEffect(() => {
      // console.log(currentReachGeometry);
      if(currentReachGeometry){
        console.log(currentReachGeometry);
        const source = new VectorSource({
          format: new GeoJSON(),
          features: new GeoJSON(
            {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
            }
          ).readFeatures(currentReachGeometry)
        })
        const layerExtent = source.getExtent();
    
        map.getView().fit(layerExtent, {
            padding: [100,100,100,100],
            duration: 3000, // Optional animation duration in milliseconds.
            // nearest: true,
        });
      }
  
    }, [currentReachGeometry]);


    return(


            <SideMenu isVisible={showMainRegionsMenu} position={"top"} >
                <Accordion className="wrapper_absolute" defaultActiveKey='1' activeKey={isAccordionOpen ? '0' : ''}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                    <div className="accordion-header-container">
                    <Row className="accordion-header-row">
                      <Col sm={4} >
                        Regions
                      </Col>
                      <Col sm={7} className="button-menu button-middle">
                        Actions
                      </Col>

                      <Col sm={1} className="button-menu">
                        
                      </Col>
                    </Row>
                    <Row className="accordion-header-row">
                      <Col sm={4} >


                        {availableRegions.length > 0 ? (
                          <DropdownButton 
                            id="dropdown-basic-button" 
                            onSelect={handleSelectRegionDropdown}
                            drop={'down'}
                            size="sm"
                            title={selectedRegionDropdownItem.value ? selectedRegionDropdownItem.value : "Select Region"}
                            flip={true}
                          >   
                            {availableRegions.map((availableRegion, index) => (
                              <Dropdown.Item key={index} eventKey={index}>{availableRegion.name}</Dropdown.Item>
                            ))}
                          </DropdownButton>
                        ) : (
                          <p>No regions available</p>
                        )}



                      </Col>
                        <Col sm={7} className="button-menu button-middle">
                          <Button 
                              variant="primary" 
                              className="text-white"
                              size="sm"
                              onClick={(e) => zoomToRegionExtent()}
                          >
                              <TbZoomPan/>
                          </Button>
                        </Col>

                      <Col sm={1} className="button-menu">
                        <Button 
                          onClick={toggleAccordion} 
                          variant="primary"
                          size="sm"
                        >
                          {isAccordionOpen ? <SlArrowUp/> : <SlArrowDown/> }
                          
                        </Button>
                      </Col>
                    </Row>
                    </div>



                    </Accordion.Header>
                    <Accordion.Body className="accordeon-body-custom">
                          <SubMenu 
                            availableReachesList={availableReachesList}
                            setCurrentStation={setCurrentStation}
                            setCurrentStationID={setCurrentStationID}
                            setCurrentProducts={setCurrentProducts}
                            handleShow={handleShow}
                            setMetadata={setMetadata}
                            currentPageNumber={currentPageNumber}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setSearchReachInput={setSearchReachInput}
                            promptTextAvailableReachesList={promptTextAvailableReachesList}
                            socketRef={socketRef}
                            setCurrentReachGeometry={setCurrentReachGeometry}
                            setCurrentReachGeometryOnClick={setCurrentReachGeometryOnClick}
                          />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
            </SideMenu>




    )

}