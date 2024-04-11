import React,{Fragment, useState} from 'react';
import { RegionsList } from './RegionsList';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import { CircularMenu } from 'components/UI/CircularMenu/CircularMenu';
// import { useAddRegionForm } from './forms/hooks/useAddRegionForms';
// icons for the circular menu
import { Add } from "@styled-icons/fluentui-system-filled";
import { Minus } from "@styled-icons/boxicons-regular";
import { DataBarHorizontal } from "@styled-icons/fluentui-system-filled";
import {AddRegionForm} from './forms/components/AddRegionForm';
import { useMapContext } from 'features/Map/hooks/useMapContext';
import { useRegionsFormContext } from './forms/hooks/useRegionsFormsContext';

const RegionsMenu = () => {
  const {state:regionsState, actions:regionsActions} = useRegionsContext();
  const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();
  const {state:mapState, actions: mapActions } = useMapContext();
  // const { addForms, set_is_visible } = useAddRegionForm();
  const {state:regionsFormState, actions:regionsFormActions} = useRegionsFormContext();
  
  const toggleVisibilityRegionListMenu = () => {
    console.log('toggleVisibilityRegionListMenu');
    regionsActions.setIsVisible(!regionsState.isVisible);
    regionsFormActions.set_is_visible(false);
    
    // update the user regions from the database
    webSocketState.client.send(
      JSON.stringify({
        type: "update_user_regions"
      })
    );
    mapActions.delete_layer_by_name("region_border")
  }

  const toggleVisibilityAddRegionMenu = () => {
    mapActions.delete_layer_by_name("region_border")
    regionsActions.setIsVisible(false);
    regionsActions.reset(); //reset the regions reaches list
    regionsFormActions.set_is_visible(!regionsFormState.addForms.isVisible);

    // // give different options according to the login method
    webSocketState.client.send(
      JSON.stringify({
        type: "get_hs_login_status_method"
      })
    );

  }
  const setVisibleOffAddRegionMenu = () => {
    regionsFormActions.set_is_visible(false);
  }

  // Add Region circular menu items
  const addRegionsItems = [
    { icon: Add, value: "Add region", label: "Add Region", clickEvent:()=>{toggleVisibilityAddRegionMenu()}},
    { icon: DataBarHorizontal, value: "List Regions", label: "List Regions", clickEvent:()=>{toggleVisibilityRegionListMenu()}},
  ];

 
  return (
    <Fragment>
          {regionsState.isVisible && <RegionsList/> }
          {regionsFormState.addForms.isVisible && <AddRegionForm setVisibleOff={setVisibleOffAddRegionMenu}/> }
          <CircularMenu items={addRegionsItems}/>
    </Fragment>

  );
};

export {RegionsMenu}