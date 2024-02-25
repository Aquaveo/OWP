import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define the keyframes for the animation
const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

// Create a styled component for the loading text
export const LoadingText = styled.div`
  font-size: 16px;
  color: #333;
  animation: ${blinkAnimation} 1.5s infinite;
`;

