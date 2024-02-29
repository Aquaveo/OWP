import React, { Fragment } from 'react';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { FormSelect } from 'features/RegionsForms/components/Forms';
import { CircularButton,FlexContainer } from 'components/UI/StyleComponents/ui';
import { FaPlus } from 'react-icons/fa'; // Example using react-icons for the button content

const RegionsList = ({control}) => {
 
  const {state,actions} = useRegionsContext();
  console.log(state.regions)
  const handleRegionTypeChange = ()=>{

  }

  return (
        <FlexContainer>
            <FormSelect 
                control={control} 
                name={"regionType"} 
                options={state.regions.map(region => ({value:region.name,label:region.name}))}
                label={"Regions"} 
                onChange={handleRegionTypeChange} 
            />
            <CircularButton onClick={() => console.log('Button clicked')}>
              <FaPlus /> 
            </CircularButton>

        </FlexContainer>


  );
};

export {RegionsList}