import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select, { components, } from "react-select";
import {colourStyles} from '../lib/colorUtils';
import { LiaUserSolid, LiaUsersSolid } from "react-icons/lia";

import { IconContext } from "react-icons";


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

export const RegionFormFromHydroShare = ({ hydroshareRegionsOptions }) => {

  const { control } = useForm();

  return (
            hydroshareRegionsOptions.length > 0 ?
            <Controller
              name="HydroShareRegions"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  options={hydroshareRegionsOptions}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption); // Notify react-hook-form of the change
                    // handleRegionTypeChange(selectedOption); // Additional logic for onChange
                  }}
                  components={{ Option: IconOption }}
                  styles={colourStyles}
                />
              )}
              rules={{ required: 'Please select a region type' }}
            />
            // <Select
            //     value = {hydroshareRegionsOptions.find(({value}) => value === field.value ) }
            //     onChange={handleSelectOnChange}
            //     options={hydroshareRegionsOptions}
            //     components={{ Option: IconOption }}
            //     styles={colourStyles}
            // />
            :
            <p className="sudo_title">
                There is no HydroShare Regions to display
            </p>
  );
};

