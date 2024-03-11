import React from "react";
import styled from "styled-components";
import {
  ITEM_SIZE,
  BORDER,
  TEXT,
  PRIMARY,
  // RADIUS,
  MARGIN_RIGHT
} from "./constants";
import {
  motion,
  usePresence,
  useMotionValue,
  animate,
  useTransform
} from "framer-motion";
import {Tooltip} from './Tooltip';

const Circle = styled(motion.div)`
  position: absolute;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${BORDER};
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  color: ${TEXT};
  pointer-events: all;
  will-change: transform;

  & svg {
    transition: 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.15);
    color: ${PRIMARY};

    & svg {
      transform: scale(1.15);
    }
  }
`;

// function splitAnimation({ partA, partB }) {
//   return function split(value) {
//     const splitAt = 0.2;
//     if (value < splitAt) {
//       return partA(value / splitAt);
//     }

//     return partB((value - splitAt) / (1 - splitAt));
//   };
// }

// function useCircleMotionStyles(value, index, nrOfItems) {
//   const offset = 0.25;
//   const percentage = index / nrOfItems;

//   const transformX = splitAnimation({
//     partA: () => 0,
//     partB: progress => {
//       const value = percentage * progress - offset;
//       return RADIUS * Math.cos(Math.PI * value * 2);
//     }
//   });
//   const transformY = splitAnimation({
//     partA: progress => progress * -RADIUS,
//     partB: progress => {
//       const value = percentage * progress - offset;
//       return RADIUS * Math.sin(Math.PI * value * 2);
//     }
//   });

//   const x = useTransform(value, transformX);
//   const y = useTransform(value, transformY);
//   const scale = useTransform(value, value => value / 2 + 0.5);

//   return {
//     x,
//     y,
//     scale
//   };
// }

function useBarMotionStyles(value, index, nrOfItems, layerSide) {
  const x = useTransform(value, value => {
    const stepSize = ITEM_SIZE + MARGIN_RIGHT;
    const maxIndex = nrOfItems - 1;

    if (layerSide === "left") {
      return value * (index - maxIndex) * stepSize + stepSize * maxIndex;
    }

    return value * index * stepSize;
  });
  return { x, left: 0, opacity: value };
}

function usePresenceAnimation(value, transition) {
  const [isPresent, safeToRemove] = usePresence();

  React.useLayoutEffect(() => {
    if (isPresent) {
      animate(value, 1, transition);
    } else {
      animate(value, 0, { ...transition, onComplete: safeToRemove });
    }
  }, [isPresent, safeToRemove, value]);

  return isPresent;
}

function useDidMount() {
  const [didMount, setMount] = React.useState(false);

  React.useEffect(() => {
    setMount(true);
  }, []);

  return didMount;
}

export const MenuItem = React.forwardRef(function MenuItem(
  { icon, label, index, nrOfItems, layerSide,clickEvent, ...rest },
  ref
) {
  const didMount = useDidMount();
  const value = useMotionValue(0);
  // const circleStyle = useCircleMotionStyles(value, index, nrOfItems);
  const barStyle = useBarMotionStyles(value, index, nrOfItems, layerSide);
  const isPresent = usePresenceAnimation(value, {
    type: "spring",
    damping: 20,
    stiffness: 200
  });

  return (
    <Tooltip text={label}>
      <Circle
        ref={ref}
        {...rest}
        style= {barStyle}
        // style={layerSide === "center" ? circleStyle : barStyle}
        
        layout={isPresent && didMount}
        onClick={clickEvent}
      >
        {React.createElement(icon, { size: 20 })}
      </Circle>
    </Tooltip>
  );
});
