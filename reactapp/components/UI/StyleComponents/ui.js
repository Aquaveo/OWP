// CircularButton.js
import styled from 'styled-components';


// Styled component named StyledButton
const CircularButton = styled.button`
  display:flex;
  justify-content: center;
  width: 30px; // Diameter of the circular button
  height: 30px; // Diameter of the circular button
  border-radius: 50%; // Makes the button circular
  border: none;
  background-color: #268e89; // Example background color
  color: white; // Text color
  font-size: 12px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #268e89; // Darker shade on hover
  }

  &:focus {
    outline: 2px solid #268e89; // Outline on focus for accessibility
  }
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap 20px;
  justify-content: space-between;
`;
const Image = styled.img`
  width: 1rem;
  height: auto;
  transition: all 0.2s ease;
`;


export{CircularButton, FlexContainer, Image}