import React from "react";
import styled from "styled-components";
import {
  useLayer,
  useHover,
  mergeRefs,
  Arrow,
} from "react-laag";
import { motion, AnimatePresence } from "framer-motion";

const positionMap = {
  top: "top-center",
  bottom: "bottom-center",
  left: "left-center",
  right: "right-center"
};

export const Tooltip = React.forwardRef(function Tooltip(
  { children, text, position = "top" },
  ref
) {
  const [isOver, hoverProps, close] = useHover({
    delayEnter: 300,
    delayLeave: 300
  });

  const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
    isOpen: isOver,
    placement: positionMap[position],
    possiblePlacements: [
      "top-center",
      "bottom-center",
      "left-center",
      "right-center"
    ],
    auto: true,
    snap: true,
    triggerOffset: 8,
    overflowContainer: true,
    onParentClose: close
  });

  let trigger;
  if (isReactText(children)) {
    trigger = (
      <TooltipText ref={mergeRefs(ref, triggerProps.ref)} {...hoverProps}>
        {children}
      </TooltipText>
    );
  } else {
    trigger = React.cloneElement(children, {
      ref: mergeRefs(ref, triggerProps.ref),
      ...hoverProps
    });
  }

  return (
    <>
      {trigger}
      {renderLayer(
        <AnimatePresence>
          {isOver && (
            <TooltipBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
              {...layerProps}
            >
              {text}
              <Arrow
                {...arrowProps}
                backgroundColor={BG_COLOR}
                borderColor={BORDER_COLOR}
                borderWidth={1}
                size={6}
              />
            </TooltipBox>
          )}
        </AnimatePresence>
      )}
    </>
  );
});

function isReactText(children) {
  return ["string", "number"].includes(typeof children);
}

export const BG_COLOR = "#333";
export const BORDER_COLOR = "black";

export const TooltipBox = styled(motion.div)`
  background-color: ${BG_COLOR};
  border: 1px solid ${BORDER_COLOR};
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 3px;
  transform-origin: center center;
  z-index: 100000;
  line-height: 1;
  pointer-events: none;
  white-space: nowrap;
`;

const TooltipText = styled.span`
  border-bottom: 1px dotted #1a73a7;
  color: #1a73a7;
`;
