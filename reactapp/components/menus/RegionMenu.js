import { SideMenu } from "components/styles/SideMenu.styled";
import { Spin as Hamburger } from 'hamburger-react'
import { SubMenu } from "components/subMenus/submenu";
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import { TbZoomPan } from "react-icons/tb";
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import React, { useRef, useState, useEffect,useReducer } from "react"

import { SlArrowDown } from "react-icons/sl";


export const RegionMenuWrapper = (
  {
    name, 
    showMainRegionsMenu, 
    handleShowMainRegionMenu, 
    handleHideMainRegionMenu,
    availableRegions, 
    setAvailableRegions,
    handleShowRegionMenu,
    toggleMainRegionMenu,    
  })=>{
    const [isAccordionOpen, setAccordionOpen] = useState(false);

    const toggleAccordion = () => {
      setAccordionOpen(!isAccordionOpen);
    };
  
    return(


            <SideMenu isVisible={showMainRegionsMenu} position={"top"} >
                <Accordion className="wrapper_absolute" defaultActiveKey='1' activeKey={isAccordionOpen ? '0' : ''}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                    <Col sm={3} >
                      <DropdownButton id="dropdown-basic-button" title="Regions">
                          {availableRegions && availableRegions.map((availableRegion, index) => (
                            <Dropdown.Item href="#/action-1">{availableRegion.name}</Dropdown.Item>
                          ))}
                      </DropdownButton>
                      </Col>
                      <Col sm={3} >
                        <Form.Group className="text-white">
                            <Form.Check
                                type="switch"
                                id="default-region"
                                // value={availableRegion.is_visible}
                                // checked={availableRegion.is_visible}
                                // onChange={(e) => toggleVisibilityRegion(index)}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3} >
                        <Button 
                            variant="primary" 
                            className="text-white"
                            // onClick={(e) => zoomToRegionExtent(index)}
                        >
                            <TbZoomPan/>
                        </Button>
                    </Col>
                    <Col sm={3} >
                      <Button onClick={toggleAccordion} variant="primary">
                        <SlArrowDown/>
                      </Button>
                    </Col>

                    </Accordion.Header>
                    <Accordion.Body className="accordeon-body-custom">
                      {
                          showMainRegionsMenu && 
                          <SubMenu 
                            name={name} 
                            handleShowMainRegionMenu={handleShowMainRegionMenu} 
                            availableRegions={availableRegions} 
                            setAvailableRegions={setAvailableRegions} 
                            handleShowRegionMenu={handleShowRegionMenu}
                            />

                      }
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
            </SideMenu>




    )

}