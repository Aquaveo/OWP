import React from 'react';
import styled, { css } from 'styled-components';


const getColor = (props) => {
  const isOutline = props.variant.startsWith('outline-');
  const color = props.variant.replace('outline-', '');

  switch (color) {
    case 'primary':
      return isOutline ? '#007bff' : '#ffffff';
    case 'secondary':
      return isOutline ? '#6c757d' : '#ffffff';
    case 'warning':
      return isOutline ? '#ffc107' : '#ffffff';
    case 'danger':
      return isOutline ? '#dc3545' : '#ffffff';
    case 'info':
      return isOutline ? '#17a2b8' : '#ffffff';
    default:
      return '#007bff';
  }
};

const getSize = (props) => {
  switch (props.size) {
    case 'sm':
      return {
        fontSize: '0.8rem',
        paddingY: '0.25rem',
        paddingX: '0.5rem',
        borderRadius: '0.25rem',
      };
    case 'lg':
      return {
        fontSize: '1.2rem',
        paddingY: '10px',
        paddingX: '20px',
        borderRadius: '5px',
      };
    default:
      return {
        fontSize: '1rem',
        paddingY: '8px',
        paddingX: '15px',
        borderRadius: '4px',
      };
  }
};



const buttonStyles = css`
  font-size: ${({ size }) => getSize(size).fontSize};
  padding: ${({ size }) => `${getSize(size).paddingY} ${getSize(size).paddingX}`};
  border-radius: ${({ size }) => getSize(size).borderRadius};
  border: ${({ outline }) => (outline ? '1px solid' : 'none')};
  cursor: pointer;
`;

export const BsButton = styled.button`
  ${buttonStyles}
  background-color: ${({ variant }) => getColor({ variant })};
  color: ${({ variant }) => (variant.startsWith('outline-') ? getColor({ variant }) : '#495057')};
`;
