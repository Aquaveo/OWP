import React, { useEffect , useRef } from 'react';
import RegionsContext from '../contexts/RegionsContext';
import { useRegions } from '../hooks/useRegions';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';

export const RegionsProvider = ({ children }) => {
 const {state:regionsState ,actions} = useRegions();
 console.log(regionsState,actions);
 const {actions: websocketActions} = useWebSocketContext();

  useEffect(() => {

    // add the message handler to receive the regions
    websocketActions.addStateChangeHandler((client)=>{
      if (client.readyState === WebSocket.OPEN) {
        if (regionsState.state.regions.length === 0){
          client.send(
            JSON.stringify({
              type: "update_user_regions"
            })
          );
        }

     }

    })

    websocketActions.addMessageHandler((event)=>{
        let data = JSON.parse(event);
        let command = data['command']
        console.log(data)
        if(command ==='update_regions_users'){
            console.log(data)
            actions.loadRegions(data['data'])
            // console.log(state)
          }
      });

  }, []);


  return (
      <RegionsContext.Provider value={{ ...regionsState, actions }}>
          {children}
      </RegionsContext.Provider>

  );
};