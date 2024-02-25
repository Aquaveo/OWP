import React from 'react';
import { Controller } from 'react-hook-form';
import Select from "react-select";
import {colourStyles} from '../../../lib/colorUtils';
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";

import { IconOption } from './IconOption';


export const RegionFormFromHydroShare = ({ isVisible,hydroshareRegionsOptions,control }) => {

  return (
    
      isVisible ?
          <FormGroup>
              <Label htmlFor="regionType">Select HydroShare Resource</Label>
              {
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
                :
                <p className="sudo_title">
                    There is no HydroShare Regions to display
                </p>
              }
          </FormGroup>
          : <div></div>
  );
};

