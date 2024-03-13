import styled from 'styled-components';

// Styled components
const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem; // Adjust as needed
`;

const StyledCol = styled.div`
  flex: 0 0 auto;
  width: ${(props) => (props.sm ? `${props.sm / 12 * 100}%` : '100%')};
  padding: 0.25rem; // Adjust padding as needed
  font-size: 12px;
  text-align: center;
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
const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000; // Ensure the header is above other content
  padding: 2px 0; // Optional: Adjust based on your design
  background-color: #f0f0f0;
`;
const TableContainer = styled.div`
    top: 60px;
    // height: 300px;
    // overflow-y: scroll;
    overflow-y: auto;
    height: 50vh;
    /* Media query for devices with width up to 768px */
    @media (max-width: 768px) {
      width: 100%; /* Take the full width */
      right: 0; /* Align to the right edge */
      flex: none; /* Override the flex property */
      overflow-y: auto; /* Add scroll for overflow content */
      height: 300px;
    }
`

export { StyledRow, StyledCol, StyledButton,StickyHeader,TableContainer }