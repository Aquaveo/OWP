import React, { Fragment } from 'react';
import { Controller } from 'react-hook-form';
import Select from "react-select";
import {colourStyles} from '../../../lib/colorUtils';
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { IconOption } from '../../IconOption';
import { LoadingText } from 'components/UI/StyleComponents/Loader.styled';

export const RegionFormFromHydroShare = ({ isVisible,hydroshareRegionsOptions,control }) => {

  return (
    
      isVisible ?
          <FormGroup>
              {
                hydroshareRegionsOptions.length > 0 ?
                <Fragment>
                  <Label htmlFor="hydrosharePublicRegions">Select HydroShare Resource</Label>
                  <Controller
                    name="hydrosharePublicRegions"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={hydroshareRegionsOptions}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption); // Notify react-hook-form of the change
                        }}
                        components={{ Option: IconOption }}
                        styles={colourStyles}
                      />
                    )}
                    rules={{ required: 'Please select a region type' }}
                  />

                </Fragment>
                :
                <LoadingText>
                  Loading Regions ...
                </LoadingText>
              }
            </FormGroup>
          : <></>
  );
};

