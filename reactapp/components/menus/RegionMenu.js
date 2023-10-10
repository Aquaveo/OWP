import { SideMenu } from "components/styles/SideMenu.styled";
import { Spin as Hamburger } from 'hamburger-react'
import { SubMenu } from "components/subMenus/submenu";
import Accordion from 'react-bootstrap/Accordion';

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
    return(


            <SideMenu isVisible={showMainRegionsMenu} position={"top"} >
                <Accordion className="wrapper_absolute">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Regions</Accordion.Header>
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