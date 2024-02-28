import styled from "styled-components";

export const StyledCustomCircleButton = styled.button`
  border: 0.2rem solid #000000;
  background: #ffffff;
  text-decoration: none;
  color: #16a085;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: unset;
  padding: 0.5rem;
  transition: all 0.5s;
  width: 2rem;
  height: 2rem;  


  &:is(:hover, :focus, :active) {
    color: #ffffff;
    background: #000000;
  }
`;