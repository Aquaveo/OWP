import { BsLayersHalf } from "react-icons/bs";
import { TbLassoPolygon } from "react-icons/tb";
import { MdTimeline } from "react-icons/md";
import { CustomHamburgerStyle } from "components/styles/CustomHamburger.styled";

 
// Import the circular menu
import {
  CircleMenu,
  CircleMenuItem,
} from "react-circular-menu";

export const CircularMenuComponent = ({handleShowRegionMenu,handleShowReachesListRegionMenu}) => {
    //make the menu dissapear here//
    // make a function to toogle off the menu
    // make the add menu to appear
  return (
    <CustomHamburgerStyle>
        <CircleMenu
        startAngle={-90}
        rotationAngle={-90}
        itemSize={2}
        radius={5}
        rotationAngleInclusive={true}
        className="custom-circle-menu"
        >


          <CircleMenuItem 
              tooltip="Add Layers"
              className="custom-circle-menu-item"
          >
            <BsLayersHalf />

          </CircleMenuItem>

          <CircleMenuItem 
              tooltip="Create Region from Reaches"
              onClick={() => handleShowReachesListRegionMenu() }
              className="custom-circle-menu-item"
              
          >
            <MdTimeline />

          </CircleMenuItem>
          <CircleMenuItem 
              tooltip="Create Region from Geometry"
              onClick={() => handleShowRegionMenu() }
              className="custom-circle-menu-item"
          >
            <TbLassoPolygon />

          </CircleMenuItem>

        </CircleMenu>
    </CustomHamburgerStyle>
  );
};