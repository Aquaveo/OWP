import React,{Fragment, useState} from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormContainer, Form, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { RegionsProvider } from './RegionsProvider';
import { RegionsList } from './RegionsList';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { CircularMenu } from 'components/UI/CircularMenu/components/CircularMenu';

// icons for the circular menu
import { Add } from "@styled-icons/fluentui-system-filled";
import { Minus } from "@styled-icons/boxicons-regular";
import { DataBarHorizontal } from "@styled-icons/fluentui-system-filled";


const Regions = () => {
  const { control, handleSubmit, reset,getValues } = useForm();
  const handleFormSubmit = (data) => {    
    // onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };
  // const {state:regionsState, actions:regionsActions} = useRegionsContext();
  // console.log(regionsState,regionsActions)
  // Add Region circular menu items
  const addRegionsItems = [
    { icon: Add, value: "Add region", label: "Add Region", clickEvent:()=>{console.log('Add Region Clicked')}},
    { icon: Minus, value: "Delete Region", label: "Delete Region", clickEvent:()=>{console.log('Delete Region Clicked')} },
    { icon: DataBarHorizontal, value: "List Regions", label: "List Regions", clickEvent:()=>{console.log('List Regions Clicked')}},
  ];

 
  return (
    <Fragment>
      <RegionsProvider>
          <FormContainer>
              <Form onSubmit={handleSubmit(handleFormSubmit)}>                
                  <RegionsList control={control} getValues={getValues} />
              </Form>
          </FormContainer>
          <CircularMenu items={addRegionsItems}/>
      </RegionsProvider>
    </Fragment>

  );
};

export {Regions}