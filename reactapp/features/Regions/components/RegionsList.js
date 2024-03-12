import React, { Fragment, useEffect, useState } from 'react';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { FormSelect } from 'features/Regions/components/forms/Forms';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { RegionToolBar } from './RegionsToolBar';
import { RegionsTable } from './RegionsTable';
import { FlexContainer, Image } from 'components/UI/StyleComponents/ui';
import { useForm, Controller } from 'react-hook-form';
import { FormContainer, Form, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import {Minimize} from '@styled-icons/material-outlined'
import { CircularButton } from 'components/UI/StyleComponents/ui';

const RegionsList = ({}) => {
  const { control, handleSubmit, reset,getValues } = useForm();
  const {state:regionsState, actions:regionsActions} = useRegionsContext();
  const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (data) => {    
    // onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };

  useEffect(() => {
    // add the message handler to receive the regions' reaches
    const updateReachesMessageListener = (event)=>{
      let data = JSON.parse(event);
      let command = data['command']
      // console.log(data)
      if(command ==='update_reaches_users'){
        console.log(data);
        const numberOfPageItems = Math.ceil(data['total_reaches']/50);
        console.log(numberOfPageItems)
        setIsLoading(false);
        console.log(regionsActions)
        regionsActions.updateCurrentRegionReaches(data['data'])
        regionsActions.setTotalPageNumber(numberOfPageItems)

      }
    }

    websocketActions.addMessageHandler(updateReachesMessageListener);
      return () => {
        console.log("unmounting update_reaches_users")
        webSocketState.client.off(updateReachesMessageListener)
      }
  }, []);

  const handleRegionTypeChange = (region)=>{
    console.log("region_name",region);
    setIsLoading(true);
    webSocketState.client.send(
      JSON.stringify({
        type: "update_user_reaches",
        region_name: region.value,
        page_number: 1,
        page_limit: regionsState.pagination.limitPageNumber,
        search_term: regionsState.pagination.searchReachInput
      })
    )

  }
  useEffect(() => {
    if (!getValues()['regionType']) return; // don't do anything if the regionType is not set
    setIsLoading(true);
      webSocketState.client.send(
        JSON.stringify({
          type: "update_user_reaches",
          region_name: getValues()['regionType'].value,
          page_number: regionsState.pagination.currentPageNumber,
          page_limit: regionsState.pagination.limitPageNumber,
          search_term: regionsState.pagination.searchReachInput
        })
      );

  },[regionsState.pagination.currentPageNumber]);

  useEffect(() => {
    if (!getValues()['regionType']) return; // don't do anything if the regionType is not set
    setIsLoading(true);
      webSocketState.client.send(
        JSON.stringify({
          type: "update_user_reaches",
          region_name: getValues()['regionType'].value,
          page_number: 1,
          page_limit: regionsState.pagination.limitPageNumber,
          search_term: regionsState.pagination.searchReachInput
        })
      );

  },[regionsState.pagination.searchReachInput]);

  return (

    <FormContainer>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Fragment>


              <FlexContainer>
                <div>
                  <span>Select a Region</span>
                </div>
                <CircularButton onClick={()=>regionsActions.setIsVisible(false)}><Minimize size={20} /></CircularButton>
             </FlexContainer>

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
                    setInputSearchTerm={regionsActions.setSearchInput} 
                  />
                  <RegionsTable availableReachesList={regionsState.currentRegionReaches} />
                </Fragment>            
                : 
                null
              }
              {isLoading ?<LoadingText>Loading Reaches...</LoadingText>:null}

              
        </Fragment>

      </Form>
    </FormContainer>



    


  );
};

export {RegionsList}