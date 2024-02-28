import { SiHiveBlockchain } from "react-icons/si";
import { CustomHamburgerStyle } from "components/styles/CustomHamburger.styled";
import { CircleCustomButton } from "components/menus/CircleCustomMenuButton" 
import { FaPlus } from "react-icons/fa";

// Import the circular menu
import {
  CircleMenu,
  CircleMenuItem,
} from "react-circular-menu";


export const CircularMenuComponent = ({
  toggleAddRegionFormVisibility,
}) => {


    function handleClick(event) {
      // event.preventDefault();
      toggleAddRegionFormVisibility(false)
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
          open={false}
          menuToggleElement={
            <CircleCustomButton size={2} onClick={handleClick}>
              <FaPlus/>
            </CircleCustomButton>
          }
        >
          <CircleMenuItem 
              tooltip="Create Region"
              className="custom-circle-menu-item"
              onClick={(e) => {
                toggleAddRegionFormVisibility(true)
              }}
              tooltipPlacement= 'left'
          >
            <SiHiveBlockchain />
          </CircleMenuItem>

        </CircleMenu>
    </CustomHamburgerStyle>
  );
};