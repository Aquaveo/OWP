import React from 'react';
import { useForm,UseController, useController } from 'react-hook-form';
import { SmallMenu } from 'components/styles/SmallMenu.styled';
import { BiSolidSave,BiLockAlt,BiLockOpenAlt } from "react-icons/bi"
import { BsButton } from 'components/styled-components/BsButton.styled';
import { BsSelect } from 'components/styled-components/BsSelect.styled';
import 'css/menus.css'
import { MenuSingleRow } from 'components/styled-components/MenuSingleRow.styled';
import { BsInput } from 'components/styled-components/BsInput.styled';
import appAPI from "services/api/app";
import { Toaster } from 'react-hot-toast';
import { Notification } from 'components/notifications/notification';
import Select, { components } from "react-select";


const { Option } = components;
const IconOption = props => (
    <Option {...props}>
        <BiLockOpenAlt/>
        {/* {props.data.public ? <BiLockOpenAlt/> : <BiLockAlt/> } */}
      {props.data.label}
    </Option>
  );

export const RegionFormFromHydroShare = (
    {
        showAddRegionMenuFromHydroShare,
        hydroshareRegionsOptions,
        hydrosharePrivateRegionsOptions,
        setAvailableRegions,
        setSelectedRegions,
        handleHideLoading
    }
) => {

  const { register,control, handleSubmit } = useForm();
  const {field} = useController({name: 'hydrosharePublicRegions', control})
  const onSubmit = async (data) => {
    console.log(data); // Use the data as needed, like sending it to an API endpoint
    let responseRegions = await appAPI.saveUserRegionsFromHydroShareResource(data);
    console.log(responseRegions)
    if(responseRegions['msge'] === 'Error saving the Regions for current user'){
      notifyError(responseRegions['msge']);
    }
    else{
      setAvailableRegions(currentRegions => [...currentRegions, responseRegions['regions'][0]]);
    }
    setSelectedRegions({type:"reset", region: {}});
    handleHideLoading();
  };
  const handleSelectOnChange=(option) =>{
    field.onChange(option.value)
  }

  return (
    <SmallMenu isVisible={showAddRegionMenuFromHydroShare} position={"top"} >
        <Notification/>
        <div className="wrapper_absolute">
            <form onSubmit={handleSubmit(onSubmit)}>
                <p className="sudo_title">
                    Create Region from HydroShare
                </p>
                <MenuSingleRow>
                    <label>Name of the Region:</label>
                    <BsInput size="sm" type="text" {...register('regionName')} />
                </MenuSingleRow>

                <MenuSingleRow>
                    <label>Hydroshare Public Regions:</label>
                    <br></br>
                    {                    
                        hydroshareRegionsOptions.length > 0 ?
                        <Select
                            value = {hydroshareRegionsOptions.find(({value}) => value === field.value ) }
                            onChange={handleSelectOnChange}
                            // {...register('hydrosharePublicRegions')}
                            options={hydroshareRegionsOptions}
                            components={{ Option: IconOption }}
                        />
                        :
                        <p className="sudo_title">
                            There is no HydroShare Regions to display
                        </p>
                    }
                </MenuSingleRow>



                <div className="buttons-menu">
                    <BsButton 
                        variant="secondary" 
                        size="sm"
                        type="submit"
                    >
                            <BiSolidSave />
                    </BsButton>
                </div>
            </form>
        </div>

    </SmallMenu>
  );
};


    
                        // <BsSelect 
                        //     {...register('hydrosharePublicRegions')}
                        //     variant="primary"
                        //     size="sm"
                        // >
                        //     {hydroshareRegionsOptions.map((resource) => (
                        //         <option key={resource.resource_id} value={resource.resource_id}>
                        //         {resource.public ? '\u2654' : '\u2654'}
                           
                        //         {resource.resource_title}
                        //         </option>
                        //     ))}
                        // </BsSelect>

                        // {
                        //     hydrosharePrivateRegionsOptions.length > 0 ?
                        //     <MenuSingleRow>
                        //         <label>Hydroshare Private Regions:</label>
    
                        //         <BsSelect 
                        //             {...register('hydrosharePrivateRegions')}
                        //             variant="primary"
                        //             size="sm"
                        //         >
                        //             {hydrosharePrivateRegionsOptions.map((resource) => (
                        //                 <option key={resource.resource_id} value={resource.resource_id}>
                        //                 {resource.resource_title}
                        //                 </option>
                        //             ))}
                        //         </BsSelect>
                        //     </MenuSingleRow>
    
                        //     :
                        //     <p className="sudo_title"></p>
                        // }
    
