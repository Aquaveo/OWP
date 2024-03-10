import React, { Fragment, useEffect, useState } from 'react';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { FormSelect } from 'features/RegionsForms/components/Forms';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { RegionToolBar } from './RegionsToolBar';
import { RegionsTable } from './RegionsTable';

const RegionsList = ({
  control, 
  getValues
}) => { 
  const {state:regionsState, actions:regionsActions} = useRegionsContext();
  const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // add the message handler to receive the regions' reaches
    websocketActions.addMessageHandler((event)=>{
        let data = JSON.parse(event);
        let command = data['command']
        console.log(data)
        if(command ==='update_reaches_users'){
          console.log(data);
          const numberOfPageItems = Math.ceil(data['total_reaches']/50);
          console.log(numberOfPageItems)
          setIsLoading(false);
          console.log(regionsActions)
          regionsActions.updateCurrentRegionReaches(data['data'])
          regionsActions.setTotalPageNumber(numberOfPageItems)

        }
      });

  }, []);

  const handleRegionTypeChange = (region)=>{
    console.log("region_name",region);
    setIsLoading(true);
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
  useEffect(() => {
    // console.log(getValues());
    if (!webSocketState.client) return; // prenvent the app from crashing if the websocket is not connected
    // consolegetValues();
    setIsLoading(true);
      webSocketState.client.send(
        JSON.stringify({
          type: "update_user_reaches",
          region_name: getValues()['regionType'].value,
          page_number: regionsState.pagination.currentPageNumber,
          page_limit: 50,
          search_term: ""
        })
      );
    // }

  },[regionsState.pagination.currentPageNumber]);


  return (
    <Fragment>
          <p>Regions</p>
          <FormSelect 
            control={control} 
            name={"regionType"} 
            options={regionsState.regions.map(region => ({value:region.name,label:region.name}))}
            label={""} 
            onChange={handleRegionTypeChange} 
          />
          {regionsState.currentRegionReaches.length > 0 
            ?
            <Fragment>
              <RegionToolBar 
                currentPageNumber={regionsState.pagination.currentPageNumber} 
                totalPageNumber={regionsState.pagination.totalPageNumber} 
                updateCurrentPage={regionsActions.updateCurrentPage} 
              />
              <RegionsTable availableReachesList={regionsState.currentRegionReaches} />
            </Fragment>            
            : 
            null
          }
          {isLoading ?<LoadingText>Loading Reaches...</LoadingText>:null}

          
    </Fragment>

    


  );
};

export {RegionsList}