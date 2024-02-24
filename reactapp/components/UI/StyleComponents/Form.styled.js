import styled from "styled-components";

const Form = styled.form`
  height: fit-content;
  flex: 1 1 20%;
  order: 1;
  padding: 10px;
  position: absolute;
  z-index: 300;
  right: 10px;
  margin-top: 60px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  /* Media query for devices with width up to 768px */
  @media (max-width: 768px) {
    width: 100%; /* Take the full width */
    right: 0; /* Align to the right edge */
    margin-top: 60px; /* Adjust the top margin */
    border-radius: 0; /* Optional: removes border radius for full-width */
    flex: none; /* Override the flex property */
    position: fixed; /* Make position fixed to stay in view */
    top: 0; /* Align to the top */
    height: fit-content; /* Make it full height */
    overflow-y: auto; /* Add scroll for overflow content */
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
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

export {Form, FormGroup,Label, SubmitButton }