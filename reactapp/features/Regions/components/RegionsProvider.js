import React, { useEffect , useRef } from 'react';
import RegionsContext from '../contexts/RegionsContext';
import { useRegions } from '../hooks/useRegions';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';

export const RegionsProvider = ({ children }) => {
 const {state ,actions:regionsActions} = useRegions();
 const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();


  useEffect(() => {

    // add the message handler to receive the regions

    websocketActions.addStateChangeHandler((client)=>{

      client.send(
        JSON.stringify({
          type: "update_user_regions"
        })
      );
      // console.log(event)
    
    })

    websocketActions.addMessageHandler((event)=>{
        let data = JSON.parse(event);
        let command = data['command']
        console.log(data)
        if(command ==='update_regions_users'){
            console.log(data)
            regionsActions.loadRegions(data['data'])
            console.log(state)
          }
      });

  }, []);


  return (
        <RegionsContext.Provider value={{ ...state, regionsActions }}>
                {children}
        </RegionsContext.Provider>

  );
};