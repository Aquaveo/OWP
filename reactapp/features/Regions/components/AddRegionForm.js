import React, { useState,useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Form, FormGroup, Label, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import {RegionFormFromReachList} from 'features/Regions/components/submenus/AddReachListBasedForm';
import {RegionFormFromHydroShare} from 'features/Regions/components/submenus/AddHydroShareRegionForm';

const regionOptions = [
  { value: 'geometry', label: 'Region from Geometry' },
  { value: 'hydroshare', label: 'Region from Hydroshare' },
  { value: 'reachesList', label: 'Region from Reaches List' },
];

const AddRegionForm = ({
  onSubmit, 
}) => {

  const { control, handleSubmit, reset } = useForm();
  const [isHydroShareRegionVisible, setIsHydroShareRegionVisible] = useState(false);
  const [isReachListRegionVisible, setIsReachListRegionVisible] = useState(false);

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
      setIsHydroShareRegionVisible(true);
      setIsReachListRegionVisible(false);

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
      setIsReachListRegionVisible(true);
      setIsHydroShareRegionVisible(false);
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
      <FormGroup isVisible={true}>
        <Label htmlFor="regionName">Region Name</Label>
        <Controller
          name="regionName"
          control={control}
          defaultValue=""
          render={({ field }) => <input {...field} id="regionName" className="form-control" />}
          rules={{ required: 'Region name is required' }}
        />
      </FormGroup>
      <FormGroup isVisible={true}>
        <Label htmlFor="regionType">Select Type of Region</Label>
        <Controller
          name="regionType"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              options={regionOptions}
              onChange={(selectedOption) => {
                field.onChange(selectedOption); // Notify react-hook-form of the change
                handleRegionTypeChange(selectedOption); // Additional logic for onChange
              }}
            />
          )}

          rules={{ required: 'Please select a region type' }}
        />
      </FormGroup>

      <RegionFormFromHydroShare 
        isVisible={isHydroShareRegionVisible} 
        hydroshareRegionsOptions={hydroShareRegionsOptions}
        control={control} 
      />

      <RegionFormFromReachList 
        isVisible={isReachListRegionVisible}
        control={control} 
      />


      <SubmitButton type="submit">Add Region</SubmitButton>
    </Form>
  );
};

export {AddRegionForm};
