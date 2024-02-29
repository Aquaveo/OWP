import styled from "styled-components";


const FormContainer = styled.div`
    top: 60px;
    width: 500px;
    position: absolute;
    height: fit-content;
    z-index: 300;
    right: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 10px;
    /* Media query for devices with width up to 768px */
    @media (max-width: 768px) {
      width: 100%; /* Take the full width */
      right: 0; /* Align to the right edge */
      border-radius: 0; /* Optional: removes border radius for full-width */
      flex: none; /* Override the flex property */
      margin-top: 60px; /* Adjust the top margin */
      position: fixed; /* Make position fixed to stay in view */
      top: 0; /* Align to the top */
      height: fit-content; /* Make it full height */
      overflow-y: auto; /* Add scroll for overflow content */
    }
`



const Form = styled.form`
  height: fit-content;
  width: 100%;
  flex: 1 1 20%;
  order: 1;
  padding: 10px;
  background-color: #f0f0f0;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  // box-shadow: 0 2px 4px rgba(0,0,0,0.1);

`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  // display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
  display: 'block';
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export {Form, FormGroup,Label, SubmitButton, FormContainer }