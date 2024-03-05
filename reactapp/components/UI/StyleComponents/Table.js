import styled from 'styled-components';

// Styled components
const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem; // Adjust as needed
`;

const StyledCol = styled.div`
  flex: 0 0 auto;
  width: ${(props) => (props.sm ? `${props.sm / 12 * 100}%` : '100%')};
  padding: 0.5rem; // Adjust padding as needed
  font-size: 12px;
`;

const StyledButton = styled.button`
  color: #007bff; // Adjust the color as needed
  // font-size: 0.875rem; // Small size
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 12px;


  &:hover {
    text-decoration: underline;
  }
`;

export { StyledRow, StyledCol, StyledButton }