import React, { Fragment, useEffect } from 'react';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { FormSelect } from 'features/RegionsForms/components/Forms';
import { CircularButton,FlexContainer } from 'components/UI/StyleComponents/ui';
import { FaPlus } from 'react-icons/fa'; // Example using react-icons for the button content
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
const RegionsList = ({control, setIsAddFormVisible}) => {
 
  const {state,actions} = useRegionsContext();
  const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();

  useEffect(() => {
    // add the message handler to receive the regions' reaches
    websocketActions.addMessageHandler((event)=>{
        let data = JSON.parse(event);
        let command = data['command']
        console.log(data)
        if(command ==='update_reaches_users'){
          console.log(data);
          // setAvailableReachesList(data['data'])
          const numberOfPageItems = Math.ceil(data['total_reaches']/50);
          console.log(numberOfPageItems)
          // setCurrentPageNumber(numberOfPageItems)
        }
      });

  }, []);

  const handleRegionTypeChange = (region)=>{
    console.log("region_name",region);
    setIsAddFormVisible(false)
    webSocketState.client.send(
      JSON.stringify({
        type: "update_user_reaches",
        region_name: region.value,
        page_number: 1,
        page_limit: 50,
        search_term: ""
      })
    )

  }

  return (
    <Fragment>
        <FlexContainer>
            <p>Regions</p>
            <CircularButton onClick={() => setIsAddFormVisible(true)}>
              <FaPlus /> 
            </CircularButton>
        </FlexContainer>
          <FormSelect 
            control={control} 
            name={"regionType"} 
            options={state.regions.map(region => ({value:region.name,label:region.name}))}
            label={""} 
            onChange={handleRegionTypeChange} 
          />

    </Fragment>

    


  );
};

export {RegionsList}