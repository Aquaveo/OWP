
//https://codepen.io/vanderzak/embed/zYxXzmd?height=265&theme-id=light&default-tab=js%2Cresult&user=vanderzak&slug-hash=zYxXzmd&pen-title=React%20Pagination%20Component&name=cp_embed_9

import { SideMenu } from "components/styles/SideMenu.styled";
import { Spin as Hamburger } from 'hamburger-react'
import { SubMenu } from "components/subMenus/submenu";
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import { TbZoomPan } from "react-icons/tb";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Button } from 'react-bootstrap';
import React, { useRef, useState, useEffect, useContext } from "react"
import MapContext from "../map/MapContext";
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON';

import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import 'css/RegionMenu.css';

export const RegionMenuWrapper = (
  {
    name, 
    isAccordionOpen,
    setAccordionOpen,
    showMainRegionsMenu, 
    handleShowMainRegionMenu, 
    handleHideMainRegionMenu,
    availableRegions, 
    setAvailableRegions,
    handleShowRegionMenu,
    toggleMainRegionMenu,
    socketRef,
    availableReachesList,
    setAvailableReachesList,
    setCurrentStation,
    setCurrentStationID,
    setCurrentProducts,
    currentProducts,
    handleShow,
    setMetadata,
    currentPageNumber,
    setCurrentPageNumber,
    selectedRegionDropdownItem,
    setSelectedRegionDropdownItem,
    promptTextAvailableReachesList,
    currentPage,
    setCurrentPage
  })=>{

    const pagesLimit = 50;
    const toggleAccordion = () => {
      setAccordionOpen(!isAccordionOpen);
    };
    // const [currentPage, setCurrentPage] = useState(1);
    const [searchReachInput, setSearchReachInput] = useState('');


    const handleSelectRegionDropdown = (key, event) => {
      const updatedHiddenRegions = availableRegions.map(availableRegion => ({
        ...availableRegion,
        is_visible: false,
      }));
      setAvailableRegions(updatedHiddenRegions);
      toggleVisibilityRegion()
      setSelectedRegionDropdownItem({
        index:key, 
        value:availableRegions[key].name
      });
      // console.log("changes")
      // getNumberOfPageItems();
    };

    // const getNumberOfPageItems = () =>{
    //   let index = selectedRegionDropdownItem['index'] ? selectedRegionDropdownItem['index']: 0
    //   let total_reaches = availableRegions[index]['number_reaches'];
    //   const numberOfPageItems = Math.ceil(total_reaches, pagesLimit);
    //   console.log(numberOfPageItems); // Array of part sizes
    //   setCurrentPageNumber(numberOfPageItems)
    // }


    

    const { map } = useContext(MapContext);
    const [currentLayerIndex, setCurrentLayerIndex] = useState();

    const focusSourceVectorLayer = (index) =>{
       const source = new VectorSource({
           format: new GeoJSON(),
           features: new GeoJSON().readFeatures(availableRegions[index]['geom'])
       })
       const layerExtent = source.getExtent();
       map.getView().fit(layerExtent, {
           padding: [10, 10, 10, 10], // Optional padding around the extent.
           duration: 1000, // Optional animation duration in milliseconds.
       });
    };

    const toggleVisibilityRegion = () => {
      let index = selectedRegionDropdownItem['index'] ? selectedRegionDropdownItem['index']: 0
       setCurrentLayerIndex(index);
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
                        <DropdownButton 
                          id="dropdown-basic-button" 
                          onSelect={handleSelectRegionDropdown}
                          drop={'down-centered'}
                          size="sm"
                          title={selectedRegionDropdownItem.value ? selectedRegionDropdownItem.value : "Select Region"}
                        >
                            {availableRegions && availableRegions.map((availableRegion, index) => (
                              <Dropdown.Item key={index} eventKey={index}>{availableRegion.name}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                      </Col>
                        <Col sm={7} className="button-menu button-middle">
                          {/* <Form.Group className="text-white">
                              <Form.Check
                                  type="switch"
                                  id="default-region"
                                  value={selectedRegionDropdownItem.index ? availableRegions[selectedRegionDropdownItem.index].is_visible : false }
                                  checked={selectedRegionDropdownItem.index ? availableRegions[selectedRegionDropdownItem.index].is_visible : false}
                                  onChange={(e) => toggleVisibilityRegion()}
                              />
                          </Form.Group> */}
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
                            name={name} 
                            handleShowMainRegionMenu={handleShowMainRegionMenu} 
                            availableRegions={availableRegions} 
                            setAvailableRegions={setAvailableRegions} 
                            handleShowRegionMenu={handleShowRegionMenu}
                            availableReachesList={availableReachesList}
                            setCurrentStation={setCurrentStation}
                            setCurrentStationID={setCurrentStationID}
                            setCurrentProducts={setCurrentProducts}
                            currentProducts={currentProducts}
                            handleShow={handleShow}
                            setMetadata={setMetadata}
                            currentPageNumber={currentPageNumber}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setSearchReachInput={setSearchReachInput}
                            promptTextAvailableReachesList={promptTextAvailableReachesList}
                          />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
            </SideMenu>




    )

}