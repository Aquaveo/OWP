// CircularButton.js
import styled from 'styled-components';

// Styled component named StyledButton
const CircularButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px; // Diameter of the circular button
  height: 30px; // Diameter of the circular button
  border-radius: 50%; // Makes the button circular
  border: none;
  background-color: #007bff; // Example background color
  color: white; // Text color
  font-size: 12px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3; // Darker shade on hover
  }

  &:focus {
    outline: 2px solid #0056b3; // Outline on focus for accessibility
  }
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap 20px;
  justify-content: space-between;
`;


export{CircularButton, FlexContainer}