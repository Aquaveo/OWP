import React from 'react';
import { useForm,UseController, useController } from 'react-hook-form';
import Select, { components, } from "react-select";
import {colourStyles} from '../lib/colorUtils';



const { Option } = components;

const IconOption = props => (
    <Option {...props}>
        <div className='select-option-custom'>
          <div>
            <IconContext.Provider value={{ size: '1.4em'  ,className: "global-class-name" }}>
                {props.data.public ? <LiaUsersSolid/> : <LiaUserSolid/> }
            </IconContext.Provider>
          </div>
          <div>
            {props.data.label}
          </div>
        </div>
        
        
    </Option>
);

export const RegionFormFromHydroShare = ({hydroshareRegionsOptions}) => {

  const { register,control, handleSubmit } = useForm();
  const {field} = useController({name: 'hydrosharePublicRegions', control})

  const handleSelectOnChange=(option) =>{
    field.onChange(option.value)
  }

  return (

            hydroshareRegionsOptions.length > 0 ?
            <Select
                value = {hydroshareRegionsOptions.find(({value}) => value === field.value ) }
                onChange={handleSelectOnChange}
                options={hydroshareRegionsOptions}
                components={{ Option: IconOption }}
                styles={colourStyles}
            />
            :
            <p className="sudo_title">
                There is no HydroShare Regions to display
            </p>
  );
};

