import React, { useState,useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Form, FormGroup, Label, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { RegionFormFromReachList } from 'features/RegionsForms/components/submenus/ReachListBasedRegion/AddReachListBasedForm';
import { RegionFormFromHydroShare } from 'features/RegionsForms/components/submenus/HydroShareRegion/AddHydroShareRegionForm';
import { useAddRegionForm } from '../hooks/useAddRegionForms';
import {RegionFormFromGeometry} from 'features/RegionsForms/components/submenus/GeometryRegion/AddGeometryRegionForm';
import { DynamicFormField, FormInputFile, FormSelect } from './Forms';
import {IconOption} from './IconOption';
import {colourStyles} from '../lib/colorUtils';
import { LoadingText } from 'components/UI/StyleComponents/Loader.styled';
import {previewCSVFileData} from 'features/RegionsForms/lib/fileUtils'; 

const AddRegionForm = ({
  onSubmit, 
}) => {

  const { control, handleSubmit, reset } = useForm();
  const { addForms, addSubForm,deleteAllSubForms } = useAddRegionForm();
  const {state,actions} = useWebSocketContext();
  const [isLoading, setIsLoading] = useState(false);



  const handleFormSubmit = data => {
    onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };

  // Handle change for the region type select
  const handleRegionTypeChange = selectedOption => {
    
    //delete all the created subforms
    deleteAllSubForms();

    // actions.sendMessage(null); //sending a null message to trigger the change

    // sendMessage(selectedOption); // Assuming sendMessage expects the selected option object
    if (selectedOption.value === 'hydroshare') {
      setIsLoading(true);
      state.client.send(
        JSON.stringify(
          {
            type: "retrieve_hydroshare_regions",
          }
        )
      )

    }

    if (selectedOption.value === 'reachesList') {
      const inputFileReachFormField = {
        id: "input-file-reaches-regions",
        type: 'inputFile',
        name: 'input-file-reaches-regions',
        label:"Upload File (*.csv, *.xlsx)",
        onChange: async (e) => {
          console.log(e);
          setIsLoading(true);
          let columns = await previewCSVFileData(e);
          const selectReachColumnsFormField = {
            id: "select-reach-columns",
            type: 'select',
            name: "select-reach-columns",
            label:"Select Reach ID Column",
            options: columns.map(column => ({ value: column, label: column })),
          };
          addSubForm(selectReachColumnsFormField)
          setIsLoading(false);
        }
      };
      addSubForm(inputFileReachFormField)
    }

    if(selectedOption.value === 'geometry'){
    }

  };

  useEffect(() => {
    actions.addMessageHandler((event)=>{
      let data = JSON.parse(event);
      let command = data['command']
      console.log(data)
      if(command ==='show_hydroshare_regions_notifications'){
        console.log(data['data'])
        // here create form select for hydroshare        
        const selectHydroShareRegionsField = {
          id: "select-hydroshare-regions",
          type: 'select',
          name: `select-hydroshare-regions`,
          label:"Select HydroShare Regions",
          options: data['data'],
          components: {Option: IconOption},
          styles: colourStyles,
        };
        addSubForm(selectHydroShareRegionsField)
        setIsLoading(false);
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

      <FormSelect 
        control={control} 
        name={"regionType"} 
        options={addForms.regionFormTypes} 
        label={"Select Type of Region"} 
        onChange={handleRegionTypeChange} 
      />
      
        {addForms.subForms.map(field => (
                <DynamicFormField
                  key={field.id}
                  fieldType={field.type}
                  label={field.label}
                  options={field.options ? field.options : []}
                  components={field.components}
                  styles={field.styles}
                  control={control}
                  name={field.name}
                  onChange={field.onChange}
                />
          ))
        }
        {isLoading ? 
          <LoadingText>
              Loading Regions ...
          </LoadingText> 
          : 
          null
        }
      <SubmitButton type="submit">Add Region</SubmitButton>
    </Form>
  );
};

export {AddRegionForm};


{/* <RegionFormFromGeometry 
isVisible={addForms.visibleForms['geometryRegionForm']}
control={control}
getValues = {getValues}
/>
<RegionFormFromReachList 
isVisible={addForms.visibleForms['reachListRegionForm']}
control={control} 
/> */}