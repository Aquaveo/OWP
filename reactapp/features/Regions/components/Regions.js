import React,{Fragment, useState} from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormContainer, Form, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { RegionsProvider } from './RegionsProvider';
import { RegionsList } from './RegionsList';
import {AddRegionForm} from 'features/RegionsForms/components/AddRegionForm';
// const AddRegionForm = lazy(() => import('features/RegionsForms/components/AddRegionForm'));

const Regions = () => {
  const { control, handleSubmit, reset,getValues } = useForm();
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const handleFormSubmit = (data) => {    
    // onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };
 
  return (
    <Fragment>
      <RegionsProvider>
          <FormContainer>
              <Form onSubmit={handleSubmit(handleFormSubmit)}>                
                  <RegionsList control={control} getValues={getValues} setIsAddFormVisible={setIsAddFormVisible} />
              </Form>
              {isAddFormVisible? <AddRegionForm/>: null }

          </FormContainer>
      </RegionsProvider>
    </Fragment>

  );
};

export {Regions}