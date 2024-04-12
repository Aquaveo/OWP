import React from 'react';
import { IconContext } from "react-icons";
import { components } from "react-select";
import { LiaUserSolid, LiaUsersSolid } from "react-icons/lia";

const { Option } = components;

const IconOption = (props) => {
  
  return (
    <Option {...props}>
      <div className='select-option-custom'>
        <div>
          <IconContext.Provider value={{ size: '1.4em', className: "global-class-name" }}>
            {props.data.public ? <LiaUsersSolid/> : <LiaUserSolid/> }
          </IconContext.Provider>
        </div>
        <div>
          {props.data.label}
        </div>
      </div>
    </Option>
  );
};

export { IconOption };
