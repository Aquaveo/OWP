import React, { useEffect , useRef } from 'react';

import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';

import { useAddRegionForm } from '../hooks/useAddRegionForms';
import RegionsFormContext from '../contexts/RegionsFormContext';
export const RegionsFormProvider = ({ children }) => {

  const {state:webSocketState, actions: websocketActions} = useWebSocketContext();
 const {state: formsState, actions } = useAddRegionForm();

  useEffect(() => {

    // add the message handler to receive the regions list
      const updateRegionsTypeMessageListener = (event)=>{
        let data = JSON.parse(event);
        let command = data['command']
        //console.log(data)

        if(command ==='show_hs_login_status'){
          let regionsTypes;
          if (data['message']){
            regionsTypes = [
              { value: 'geometry', label: 'Region from Geometry' },
              { value: 'hydroshare', label: 'Region from Hydroshare' },
              { value: 'reachesList', label: 'Region from Reaches List' },
            ]
            
          }
          else{
            regionsTypes = [
              { value: 'hydroshare', label: 'Region from Hydroshare' },
            ]
          }
          actions.set_regions_form_types(regionsTypes)
        }
      }

      websocketActions.addMessageHandler(updateRegionsTypeMessageListener);

    return () => {
      webSocketState.client.off(updateRegionsTypeMessageListener);
      actions.deleteAllSubForms()
    }
  }, []);


  return (
      <RegionsFormContext.Provider value={{ ...formsState, actions }}>
          {children}
      </RegionsFormContext.Provider>
  );
};