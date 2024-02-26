import React, { useState,useEffect,Fragment  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin as Hamburger } from 'hamburger-react'

import { Button,ToggleButton,ToggleButtonGroup,Form } from "react-bootstrap";
import appAPI from "services/api/app";
import { BiSolidSave } from "react-icons/bi"

import toast, { Toaster } from 'react-hot-toast';

import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Controller } from 'react-hook-form';
import Select from "react-select";

export const GeometryRegionForm = (
    { 
        isVisible,control
    }) => {


    const geometryRegionFormTypes = [
        { value: 'file', label: 'File' },
        { value: 'hu', label: 'Huc' },
    ]
    


  
    return(
        isVisible ?
            <FormGroup>
                <Fragment>
                    <Label>Geometry Type</Label>
                  <Controller
                    name="hydrosharePublicRegions"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={geometryRegionFormTypes}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption); // Notify react-hook-form of the change
                        }}
                      />
                    )}
                    rules={{ required: 'Please select a region type' }}
                  />

                </Fragment>

            </FormGroup>
        : <></>
     

  
    );
  };
  
