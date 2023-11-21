import React from 'react';
import { useForm } from 'react-hook-form';
import { SmallMenu } from 'components/styles/SmallMenu.styled';
import { BiSolidSave } from "react-icons/bi"
import { BsButton } from 'components/styled-components/BsButton.styled';
import { BsSelect } from 'components/styled-components/BsSelect.styled';
import 'css/menus.css'
import { MenuSingleRow } from 'components/styled-components/MenuSingleRow.styled';
import { BsInput } from 'components/styled-components/BsInput.styled';
import appAPI from "services/api/app";



export const RegionFormFromHydroShare = (
    {
        showAddRegionMenuFromHydroShare,
        hydroshareRegionsOptions,
        setAvailableRegions,
        setSelectedRegions,
        handleHideLoading
    }
) => {
  const { register, handleSubmit } = useForm();

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

  return (
    <SmallMenu isVisible={showAddRegionMenuFromHydroShare} position={"top"} >
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
                    <BsSelect 
                        {...register('hydrosharePublicRegions')}
                        variant="primary"
                        size="sm"
                    >
                        {hydroshareRegionsOptions.map((resource) => (
                            <option key={resource.resource_id} value={resource.resource_id}>
                            {resource.resource_title}
                            </option>
                        ))}
                    </BsSelect>
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
