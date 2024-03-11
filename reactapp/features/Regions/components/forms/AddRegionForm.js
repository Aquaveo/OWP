import React, { useState,useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, FormGroup, Label, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { useAddRegionForm } from '../../hooks/forms/useAddRegionForms';
import { DynamicFormField, FormSelect,FormContainer } from './Forms';
import { FlexContainer,CircularButton } from 'components/UI/StyleComponents/ui';
import {IconOption} from './IconOption';
import {colourStyles} from '../../lib/colorUtils';
import { LoadingText } from 'components/UI/StyleComponents/Loader.styled';
import { handleGeometrySubForm,handleHydroshareSubForm, handleReachesListSubForm,getDataForm,deleteAllAddFormLayers,handleAddFormSubmit } from 'features/Regions/lib/fileUtils'; 
import { useMapContext } from 'features/Map/hooks/useMapContext'; //be careful with the import
import { Image } from 'components/UI/StyleComponents/ui';
import {Minimize} from '@styled-icons/material-outlined'
import Close from 'assets/times-solid.svg';

const AddRegionForm = () => {
  // console.log(useContext(MapContext))
  const { control, handleSubmit, reset } = useForm();
  const { addForms, addSubForm,deleteAllSubForms,deleteSubForm,set_is_visible } = useAddRegionForm();
  const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();
  // const { state:mapState, actions: mapActions } = useContext(MapContext); // Rename actions to mapActions
  const { state:mapState, actions: mapActions } = useMapContext(); // Rename actions to mapActions
  const [isLoading, setIsLoading] = useState(false);


  const handleFormSubmit = (data) => {    
    getDataForm(data,mapState) // Get the form data
    handleAddFormSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
    deleteAllSubForms(); //Let's delete all the subforms
    deleteAllAddFormLayers(mapState, mapActions) //Let's delete all the layers
  };

  const toggleVisibilityAddRegionMenu = () => {
    console.log(addForms.isVisible)
    set_is_visible(false);
  }



  const handleRegionTypeChange = async (selectedOption) => {
    // Delete all the created subforms
    deleteAllSubForms(); //Let's delete all the subforms
    switch (selectedOption.value) {
      case 'hydroshare':
        handleHydroshareSubForm(webSocketState,setIsLoading);
        break;
      case 'reachesList':
        await handleReachesListSubForm(addSubForm,setIsLoading);
        break;
      case 'geometry':
        await handleGeometrySubForm(addSubForm,deleteSubForm,mapActions,setIsLoading);
        break;
      default:
        console.log("Unhandled region type:", selectedOption.value);
    }
  };

  useEffect(() => {
    websocketActions.addMessageHandler((event)=>{
      let data = JSON.parse(event);
      let command = data['command']
      console.log(data)
      if(command ==='show_hydroshare_regions_notifications'){
        console.log(data['data'])
        // here create form select for hydroshare        
        addSubForm ({
          id: "select-hydroshare-regions",
          type: 'select',
          name: `select-hydroshare-regions`,
          label:"Select HydroShare Regions",
          options: data['data'],
          components: {Option: IconOption},
          styles: colourStyles,
        });
        setIsLoading(false);
      }
    });
    
  }, [])

  return (
    <FormContainer>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <FlexContainer>
          <div>
            <p>Add Region</p>

          </div>
          <CircularButton onClick={()=>toggleVisibilityAddRegionMenu()}><Minimize size={20} /></CircularButton>
        </FlexContainer>
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
                Loading Preview ...
            </LoadingText> 
            : 
            null
          }
        <SubmitButton type="submit">Add Region</SubmitButton>
      </Form>

    </FormContainer>

  );
};

export {AddRegionForm};