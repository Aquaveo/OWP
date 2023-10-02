import { SideMenu } from "components/styles/SideMenu.styled";
import { Spin as Hamburger } from 'hamburger-react'
import { SubMenu } from "components/subMenus/submenu";

export const RegionMenuWrapper = ({name, showMainRegionsMenu, handleShowMainRegionMenu, availableRegions, setAvailableRegions})=>{
    return(

        <SideMenu isVisible={showMainRegionsMenu} position={"top"} >
          <div className="wrapper_absolute">
           <div className="Myhamburguer">
            <Hamburger toggled={showMainRegionsMenu} toggle={handleShowMainRegionMenu} size={20} />
          </div>
  
            <SubMenu name={name} handleShowRegionMenu={handleShowMainRegionMenu} availableRegions={availableRegions} setAvailableRegions={setAvailableRegions} />
          </div>        
        </SideMenu>
    )

}