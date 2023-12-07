import React from "react";
// import { StyledButton, StyledLink } from "./StyledCircleButton";
import { StyledCustomCircleButton } from "components/styled-components/CustomButtomMenu.styled";

export const CircleCustomButton = ({children, ...props}) => {
  const {
    size,
    onClick
  } = props;

  return (
    <StyledCustomCircleButton onClick={onClick}>
       {children}
    </StyledCustomCircleButton>


  )
};

