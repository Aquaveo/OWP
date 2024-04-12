import React, { Fragment, useEffect, useState } from 'react';
import {LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { FormSelect } from 'features/Regions/components/forms/components/Forms';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { RegionToolBar } from './RegionsToolBar';
import { RegionsTable } from './RegionsTable';
import { FlexContainer, Image } from 'components/UI/StyleComponents/ui';
import { useForm, Controller } from 'react-hook-form';
import { FormContainer, Form, SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import {Minimize} from '@styled-icons/material-outlined'
import { useMapContext } from 'features/Map/hooks/useMapContext';
import { CircularButton } from 'components/UI/StyleComponents/ui';
import {zoomToLayerbyName} from 'features/Map/lib/mapUtils';

import {createClickedReachLayer} from 'lib/mapEvents';

const RegionsList = ({}) => {
  const { control, handleSubmit, reset,getValues } = useForm();
  const {state:regionsState, actions:regionsActions} = useRegionsContext();
  const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();
  const { state:mapState, actions: mapActions } = useMapContext(); // Rename actions to mapActions
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState("");

  const handleMessageSending = (region_name,page_number,page_limit,search_term) =>{
    setIsLoading(true);
    webSocketState.client.send(
      JSON.stringify({
        type: "update_user_reaches",
        region_name: region_name,
        page_number: page_number,
        page_limit: page_limit,
        search_term: search_term
      })
    )
  }
  
  const handleFormSubmit = (data) => {    
    // onSubmit(data); // Call the onSubmit prop with form data
    reset(); // Reset form after submission
  };

  useEffect(() => {
    // add the message handler to receive the regions' reaches
    const updateReachesMessageListener = (event)=>{
      let data = JSON.parse(event);
      let command = data['command']
      // //console.log(data)
      if(command ==='update_reaches_users'){
        const numberOfPageItems = Math.ceil(data['total_reaches']/50);
        setIsLoading(false);
        regionsActions.updateCurrentRegionReaches(data['data'])
        regionsActions.setTotalPageNumber(numberOfPageItems)

      }
    }

    websocketActions.addMessageHandler(updateReachesMessageListener);
      return () => {
        //console.log("unmounting update_reaches_users")
        webSocketState.client.off(updateReachesMessageListener)
      }
  }, []);

  const handleRegionTypeChange = (region)=>{
    //console.log("region_name",region);
    setCurrentRegion(region.value);
    
    mapActions.delete_layer_by_name("region_border") // delete any previous layer
    //create the layer
    const regionObject = regionsState.regions.find(r => r.name === region.value) // get the regions from the regions
    const layer = createClickedReachLayer("region_border",regionObject.geom)
    mapActions.addLayer(layer);
    setTimeout(() => {
      //console.log("zooming to layer")
      zoomToLayerbyName(mapState.mapObject, "region_border");
    }, 1000);

    handleMessageSending(region.value,1,regionsState.pagination.limitPageNumber,regionsState.pagination.searchReachInput);


  }
  useEffect(() => {
    // if (!getValues()['regionType']) return; // don't do anything if the regionType is not set
    if (!currentRegion) return; // don't do anything if the regionType is not set
    handleMessageSending(
      currentRegion,
      regionsState.pagination.currentPageNumber,
      regionsState.pagination.limitPageNumber,
      regionsState.pagination.searchReachInput
    );

  },[regionsState.pagination.currentPageNumber]);

  useEffect(() => {
    //console.log("searching for reaches", regionsState.pagination.searchReachInput)
    // if (!getValues()['regionType']) return; // don't do anything if the regionType is not set
    if (!currentRegion) return; // don't do anything if the regionType is not set
    handleMessageSending(
      currentRegion,
      1,
      regionsState.pagination.limitPageNumber,
      regionsState.pagination.searchReachInput
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