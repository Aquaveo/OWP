import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Form, FormGroup, Label, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { RegionFormFromHydroShare } from 'features/Regions/components/AddHydroShareRegionForm';


const regionOptions = [
  { value: 'geometry', label: 'Region from Geometry' },
  { value: 'hydroshare', label: 'Region from Hydroshare' },
  { value: 'reachesList', label: 'Region from Reaches List' },
];




const AddRegionForm = ({onSubmit, sendMessage}) => {
  // console.log(sendMessage)
  const { control, handleSubmit, reset } = useForm();
  const [isHydroShareRegionVisible, setIsHydroShareRegionVisible] = useState(false);


  const handleFormSubmit = data => {
    onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };

  // Handle change for the region type select
  const handleRegionTypeChange = selectedOption => {
    // sendMessage(selectedOption); // Assuming sendMessage expects the selected option object
    if (selectedOption.value === 'hydroshare') {
      setIsHydroShareRegionVisible(true);
      sendMessage(
        JSON.stringify({
        type: "retrieve_hydroshare_regions",
      }));
    } else {
      setIsHydroShareRegionVisible(false);
    }
  };


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

      <FormGroup isVisible={isHydroShareRegionVisible}>
        <Label htmlFor="regionType">Select Type of Region</Label>
        {/* <RegionFormFromHydroShare/> */}
      </FormGroup>



      <SubmitButton type="submit">Add Region</SubmitButton>
    </Form>
  );
};

export {AddRegionForm};
