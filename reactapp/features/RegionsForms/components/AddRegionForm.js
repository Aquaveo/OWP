import React, { useState,useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Form, FormGroup, Label, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { RegionFormFromReachList } from 'features/RegionsForms/components/submenus/ReachListBasedRegion/AddReachListBasedForm';
import { RegionFormFromHydroShare } from 'features/RegionsForms/components/submenus/HydroShareRegion/AddHydroShareRegionForm';
import { useAddRegionForm } from '../hooks/useAddRegionForms';
import {RegionFormFromGeometry} from 'features/RegionsForms/components/submenus/GeometryRegion/AddGeometryRegionForm';

const AddRegionForm = ({
  onSubmit, 
}) => {

  const { control, handleSubmit, reset, getValues, setValue } = useForm();
  const { addForms, setOnlyFormVisible } = useAddRegionForm();

  const [hydroShareRegionsOptions, setHydroShareRegionsOptions] = useState([]);


  const {actions} = useWebSocketContext();

  const handleFormSubmit = data => {
    onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };

  // Handle change for the region type select
  const handleRegionTypeChange = selectedOption => {
    console.log(selectedOption);
    // sendMessage(selectedOption); // Assuming sendMessage expects the selected option object
    if (selectedOption.value === 'hydroshare') {
      setOnlyFormVisible('hydroShareRegionForm');
      console.log("sending retrieve_hydroshare_regions")
      actions.sendMessage(
        JSON.stringify(
          {
            type: "retrieve_hydroshare_regions",
          }
        )
      );
    }

    if (selectedOption.value === 'reachesList') {
      setOnlyFormVisible('reachListRegionForm');
    }

    if(selectedOption.value === 'geometry'){
      setOnlyFormVisible('geometryRegionForm');
    }

  };

  useEffect(() => {
    console.log("adding show_hydroshare_regions_notifications message listener")
    actions.addMessageHandler((message)=>{
      let data = JSON.parse(message);
      let command = data['command']
      console.log(data['data'])
      if(command ==='show_hydroshare_regions_notifications'){
        setHydroShareRegionsOptions(data['data'])
      }
    });
    
  }, [])
  

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormGroup>
        <Label>Region Name</Label>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => <input {...field} id="regionName" className="form-control" />}
          rules={{ required: 'Region name is required' }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Select Type of Region</Label>
        <Controller
          name="regionType"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              options={addForms.regionFormTypes}
              onChange={(selectedOption) => {
                field.onChange(selectedOption); // Notify react-hook-form of the change
                handleRegionTypeChange(selectedOption); // Additional logic for onChange
              }}
            />
          )}

          rules={{ required: 'Please select a region type' }}
        />
      </FormGroup>

      <RegionFormFromGeometry 
        isVisible={addForms.visibleForms['geometryRegionForm']}
        control={control}
      />
      <RegionFormFromHydroShare 
        isVisible={addForms.visibleForms['hydroShareRegionForm']} 
        hydroshareRegionsOptions={hydroShareRegionsOptions}
        control={control} 
      />

      <RegionFormFromReachList 
        isVisible={addForms.visibleForms['reachListRegionForm']}
        control={control} 
      />
      
      <SubmitButton type="submit">Add Region</SubmitButton>
    </Form>
  );
};

export {AddRegionForm};
