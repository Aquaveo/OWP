import styled from "styled-components";

export const CustomHamburgerStyle = styled.div`
    position:absolute;
    right: 0;
    top: 15%;
    button{
      border: 0.2rem solid #ffffff;
      background: #16a085;
      text-decoration: none;
      color: #2F4858;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: unset;
      padding: 0.5rem;
      transition: all 0.5s;
    }
    button > *{
      background: #ffffff;
    }
  
    button:is(:hover, :focus, :active) {
      color: #16a085;
      background: #2F4858;
    }
`;