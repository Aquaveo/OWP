import styled, { css } from 'styled-components';

export const Input = styled.input`
  /* Common styles for all sizes */
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  /* Dynamic sizing based on props */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 0.2rem;
        `;
      case 'lg':
        return css`
          padding: 0.5rem 1rem;
          font-size: 1.25rem;
          line-height: 1.5;
          border-radius: 0.3rem;
        `;
      default:
        return null;
    }
  }}

  /* Focus style */
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }


`;