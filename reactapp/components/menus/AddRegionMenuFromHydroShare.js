import React from 'react';
import { useForm,UseController, useController } from 'react-hook-form';
import { SmallMenu } from 'components/styles/SmallMenu.styled';
import { BiSolidSave,BiSolidUser } from "react-icons/bi"
import { LiaUserSolid, LiaUsersSolid } from "react-icons/lia";
import { BsButton } from 'components/styled-components/BsButton.styled';
import 'css/menus.css'
import { MenuSingleRow } from 'components/styled-components/MenuSingleRow.styled';
import { BsInput } from 'components/styled-components/BsInput.styled';
import appAPI from "services/api/app";
import { Notification } from 'components/notifications/notification';
import Select, { components, } from "react-select";
import chroma from 'chroma-js';
import { showToast } from "services/notifications/notificationService";
import { IconContext } from "react-icons";
import { CustomNotification } from 'components/styled-components/BsNotification.styled';
import { MdError } from "react-icons/md";



const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    // const color_public = chroma('#16a085');
    // const color_private = chroma('#ffc2c2');
    // const color =  data.public ? color_public : color_private
    const color = chroma(data.color);
    //   console.log({ data, isDisabled, isFocused, isSelected });
      return {
        ...styles,
        backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? data.color
            : isFocused
            ? color.alpha(0.1).css()
            : undefined,
        color: isDisabled
            ? '#ccc'
            : isSelected
            ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
            : data.color,
        };
    }
  };


const { Option } = components;
const IconOption = props => (
    <Option {...props}>
        <div className='select-option-custom'>
          <div>
            <IconContext.Provider value={{ size: '1.4em'  ,className: "global-class-name" }}>
                {props.data.public ? <LiaUsersSolid/> : <LiaUserSolid/> }
            </IconContext.Provider>
          </div>
          <div>
            {props.data.label}
          </div>
        </div>
        
        
    </Option>
  );

export const RegionFormFromHydroShare = (
    {
        showAddRegionMenuFromHydroShare,
        hydroshareRegionsOptions,
        // hydrosharePrivateRegionsOptions,
        setAvailableRegions,
        setSelectedRegions,
        handleHideLoading,
        setLoadingText
    }
) => {

  const { register,control, handleSubmit } = useForm();
  const {field} = useController({name: 'hydrosharePublicRegions', control})
  const onSubmit = async (data) => {
    console.log(data); // Use the data as needed, like sending it to an API endpoint
    setLoadingText(`Importing region from HydroShare ...`);
    let responseRegions = await appAPI.saveUserRegionsFromHydroShareResource(data);
    console.log(responseRegions)
    if(responseRegions['msge'] === 'Error saving the Regions for current user'){
      let custom_message=<CustomNotification> 
        <div className='container-row-notification'>
          <div>
              <MdError />
          </div>
          <div>
              <em>{responseRegions['msge']}</em>

          </div>
        </div>
        </CustomNotification>
      showToast('custom',custom_message)
    }
    else{
      setLoadingText(`Region ${data['regionName']} saved`);
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
        {/* <Notification/> */}
        <div className="wrapper_hs-region">
            <form onSubmit={handleSubmit(onSubmit)}>
                <p className="sudo_title">
                    Create Region from HydroShare
                </p>
                <MenuSingleRow>
                    <label>Name of the Region:</label>
                    <BsInput size="sm" type="text" {...register('regionName')} />
                </MenuSingleRow>

                <MenuSingleRow>
                    <label>Hydroshare Regions:</label>
                    <br></br>
                    {                    
                        hydroshareRegionsOptions.length > 0 ?
                        <Select
                            value = {hydroshareRegionsOptions.find(({value}) => value === field.value ) }
                            onChange={handleSelectOnChange}
                            options={hydroshareRegionsOptions}
                            components={{ Option: IconOption }}
                            styles={colourStyles}
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
    
