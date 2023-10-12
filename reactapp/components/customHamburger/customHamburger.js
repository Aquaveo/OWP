import { BsLayersHalf } from "react-icons/bs";
import { TbLassoPolygon } from "react-icons/tb";
import { MdTimeline } from "react-icons/md";
import { CustomHamburgerStyle } from "components/styles/CustomHamburger.styled";

 
// Import the circular menu
import {
  CircleMenu,
  CircleMenuItem,
  TooltipPlacement,
} from "react-circular-menu";

export const CircularMenuComponent = ({handleShowRegionMenu}) => {
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
              tooltip="Add Reaches"
              className="custom-circle-menu-item"
          >
            <MdTimeline />

          </CircleMenuItem>
          <CircleMenuItem 
              tooltip="Add Region"
              onClick={() => handleShowRegionMenu() }
              className="custom-circle-menu-item"
          >
            <TbLassoPolygon />

          </CircleMenuItem>

        </CircleMenu>
    </CustomHamburgerStyle>
  );
};