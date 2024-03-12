import React from "react";
import { useLayer, mergeRefs } from "react-laag";
import { CONTAINER_SIZE, ITEM_SIZE, MARGIN_RIGHT } from "./constants";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";

import { Button } from "./Button";
import { MenuItem } from "./MenuItem";


const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;



export const CircularMenu = React.forwardRef(function CircularMenu(props, ref) {
  const [isOpen, setOpen] = React.useState(false);

  function getMenuDimensions(layerSide) {
    const centerSize = CONTAINER_SIZE + ITEM_SIZE;

    return {
      width:
        layerSide === "center"
          ? centerSize
          : ITEM_SIZE * props.items.length + (MARGIN_RIGHT * props.items.length - 1),
      height: layerSide === "center" ? centerSize : ITEM_SIZE
    };
  }

  const { renderLayer, triggerProps, layerProps, layerSide } = useLayer({
    isOpen,
    onOutsideClick: () => setOpen(false),
    overflowContainer: false,
    auto: true,
    snap: true,
    placement: "center",
    possiblePlacements: [
      "top-center",
      "bottom-center",
      "left-center",
      "right-center"
    ],
    triggerOffset: ITEM_SIZE / 2,
    containerOffset: 16,
    layerDimensions: getMenuDimensions
  });

  return (
    <>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <Menu
              ref={layerProps.ref}
              style={{
                ...layerProps.style,
                ...getMenuDimensions(layerSide)
              }}
            >
              {props.items.map(({ icon, label, value,clickEvent }, index) => (
                <MenuItem
                  key={value}
                  icon={icon}
                  label={label}
                  index={index}
                  nrOfItems={props.items.length}
                  layerSide={layerSide}
                  clickEvent={clickEvent}
                />
              ))}
            </Menu>
          )}
        </AnimatePresence>
      )}
      <Button
        {...props}
        ref={mergeRefs(triggerProps.ref, ref)}
        isOpen={isOpen}
        onClick={() => setOpen(!isOpen)}
      />
    </>
  );
});
