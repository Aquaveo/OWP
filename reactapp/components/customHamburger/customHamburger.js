import { BsPlusLg, BsTrash, BsFillPencilFill } from "react-icons/bs";
import { CustomHamburgerStyle } from "components/styles/CustomHamburger.styled";
// Import the circular menu
import {
  CircleMenu,
  CircleMenuItem,
  TooltipPlacement,
} from "react-circular-menu";

export const CircularMenuComponent = ({handleShowRegionMenu}) => {

  return (
    <CustomHamburgerStyle>
        <CircleMenu
        startAngle={90}
        rotationAngle={90}
        itemSize={2}
        radius={5}
        rotationAngleInclusive={true}
        >
        <CircleMenuItem
            onClick={() => alert("Clicked the item")}
            tooltip="Edit"
            tooltipPlacement={TooltipPlacement.Right}
        >
            <BsFillPencilFill />
        </CircleMenuItem>
        <CircleMenuItem tooltip="Delete">
            <BsTrash />
        </CircleMenuItem>
        <CircleMenuItem 
            tooltip="Add"
            onClick={() => handleShowRegionMenu() }
        >
            <BsPlusLg />
        </CircleMenuItem>
        </CircleMenu>
    </CustomHamburgerStyle>
  );
};