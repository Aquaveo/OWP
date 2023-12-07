import { BsLayersHalf } from "react-icons/bs";
import { TbLassoPolygon } from "react-icons/tb";
import { MdTimeline, MdOutlineCloud } from "react-icons/md";
import { CustomHamburgerStyle } from "components/styles/CustomHamburger.styled";
import logo from "css/hs-icon-sm.png"
import { CircleCustomButton } from "components/menus/CircleCustomMenuButton" 
import { FaPlus } from "react-icons/fa";

// Import the circular menu
import {
  CircleMenu,
  CircleMenuItem,
} from "react-circular-menu";


export const CircularMenuComponent = ({
  handleShowRegionMenu,
  handleShowReachesListRegionMenu,
  handleShowAddRegionMenuFromHydroShareWithAsync
}) => {
    //make the menu dissapear here//
    // make a function to toogle off the menu
    // make the add menu to appear

    function handleClick(event) {
      // Your logic when the button is clicked
      console.log("Button clicked!", event.target);
      // You can perform any action you want here
    }

    
  return (
    <CustomHamburgerStyle>
        <CircleMenu
        startAngle={-90}
        rotationAngle={-90}
        itemSize={2}
        radius={5}
        rotationAngleInclusive={true}
        className="custom-circle-menu"
        menuToggleElement={
          <CircleCustomButton size={2} onclick={handleClick}>
            <FaPlus/>
          </CircleCustomButton>
        
        }
        >
          <CircleMenuItem 
              tooltip="Create Region from HydroShare"
              className="custom-circle-menu-item"
              onClick={() => handleShowAddRegionMenuFromHydroShareWithAsync() }

          >
           <img src={logo} className="App-logo" alt="logo" />

          </CircleMenuItem>

          <CircleMenuItem 
              tooltip="Create Region from Reaches"
              onClick={() => handleShowReachesListRegionMenu() }
              className="custom-circle-menu-item"
              
          >
            <MdTimeline />

          </CircleMenuItem>
          <CircleMenuItem 
              tooltip="Create Region from Polygon"
              onClick={() => handleShowRegionMenu() }
              className="custom-circle-menu-item"
          >
            <TbLassoPolygon />

          </CircleMenuItem>

        </CircleMenu>
    </CustomHamburgerStyle>
  );
};