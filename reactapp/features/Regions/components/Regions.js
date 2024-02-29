import React from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormContainer, Form, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { RegionsProvider } from './RegionsProvider';
import { RegionsList } from './RegionsList';


const Regions = () => {
  const { control, handleSubmit, reset } = useForm();

  
  const handleFormSubmit = (data) => {    
    onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };
  const handleRegionTypeChange = ()=>{

  }
 
  return (
    <RegionsProvider>
        <FormContainer>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>                
                <RegionsList control={control} />
            </Form>
        </FormContainer>
    </RegionsProvider>
  );
};

export {Regions}