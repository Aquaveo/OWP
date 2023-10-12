import styled from "styled-components";

export const CustomHamburgerStyle = styled.div`
    position:absolute;
    right: 10px;
    bottom: 15px;
    .custom-circle-menu button div{
        background: #16a085;
    }
    .custom-circle-menu > button:first-child{
        border: 0.2rem solid #16a085;
    }

    .custom-circle-menu button div:hover{
        background: white;
    }

    .custom-circle-menu > button:first-child:hover{
        background: #16a085;
        border: 0.2rem solid white;
    }
    .custom-circle-menu > button:first-child:focus{
        background: #16a085;
        border: 0.2rem solid white;
    }

    .custom-circle-menu-item {
        border: 0.2rem solid #16a085;
        color:#16a085;
    }
    .custom-circle-menu-item:hover {
        background: #16a085;
        color: white;
        border: 0.2rem solid white;
    }
    .custom-circle-menu-item:focus {
        background: #16a085;
        color: white;
        border: 0.2rem solid white;
    }
`;