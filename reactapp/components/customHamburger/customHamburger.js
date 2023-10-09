import { BsLayersHalf, BsTrash, BsFillPencilFill } from "react-icons/bs";
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
        startAngle={-135}
        rotationAngle={90}
        itemSize={2}
        radius={5}
        rotationAngleInclusive={true}
        >
        <CircleMenuItem 
            tooltip="Add"
            onClick={() => handleShowRegionMenu() }
        >
        <BsLayersHalf />

        </CircleMenuItem>
        </CircleMenu>
    </CustomHamburgerStyle>
  );
};