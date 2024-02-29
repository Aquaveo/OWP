import { SiHiveBlockchain } from "react-icons/si";
import { CustomHamburgerStyle } from "components/styles/CustomHamburger.styled";
import { CircleCustomButton } from "components/menus/CircleCustomMenuButton" 
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
// Import the circular menu
import {
  CircleMenu,
  CircleMenuItem,
} from "react-circular-menu";


export const CircularMenuComponent = ({
  toggleAddRegionFormVisibility,
}) => {
    const  [isMenuOpen, setIsMenuOpen] = useState(false);

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
          open={isMenuOpen}
          menuActive={isMenuOpen}
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
                setIsMenuOpen(false);
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