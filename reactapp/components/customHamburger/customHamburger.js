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
        >


          <CircleMenuItem 
              tooltip="Add Layers"
          >
            <BsLayersHalf />

          </CircleMenuItem>

          <CircleMenuItem 
              tooltip="Add Reaches"
          >
            <MdTimeline />

          </CircleMenuItem>
          <CircleMenuItem 
              tooltip="Add Region"
              onClick={() => handleShowRegionMenu() }
          >
            <TbLassoPolygon />

          </CircleMenuItem>

        </CircleMenu>
    </CustomHamburgerStyle>
  );
};