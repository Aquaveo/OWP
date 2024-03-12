import React from "react";
import styled, { css } from "styled-components";
import { PRIMARY, PRIMARY_2, BUTTON_SIZE } from "./constants";
import { Cubes } from "@styled-icons/fa-solid";

const buttonHover = css`
  &:hover {
    background-color: ${PRIMARY_2};
    transform: scale(1.03);
  }
`;

const ButtonBase = styled.button`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  color: white;
  border: none;
  background-color: ${(p) => (p.$isOpen ? PRIMARY_2 : PRIMARY)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  transform: scale(${(p) => (p.$isOpen ? 1.03 : 1)});
  position: absolute;
  right: 1rem;
  bottom: 1rem;

  ${(p) => !p.$isOpen && buttonHover}
  z-index: 1000;
  & svg {
    transition: 0.25s ease-in-out;
    transform: rotate(${(p) => (p.$isOpen ? 45 : 0)}deg);
  }
`;

export const Button = React.forwardRef(function Button({ isOpen, ...rest }, ref) {
  return (
    <ButtonBase ref={ref} $isOpen={isOpen} {...rest}>
      <Cubes size={28} />
    </ButtonBase>
  );
});
