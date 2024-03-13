import React, { useEffect , useRef } from 'react';
import RegionsContext from '../contexts/RegionsContext';
import { useRegions } from '../hooks/useRegions';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import {createClickedReachLayer} from 'lib/mapEvents';
import { useMapContext } from 'features/Map/hooks/useMapContext';
import {zoomToLayerbyName} from 'features/Map/lib/mapUtils';

export const RegionsProvider = ({ children }) => {
 const {state:regionsState ,actions} = useRegions();
 const {actions: websocketActions} = useWebSocketContext();
 const { state:mapState, actions: mapActions } = useMapContext(); // Rename actions to mapActions
  useEffect(() => {

    // add the message handler to receive the regions list
    const updateRegionsMessageListener = (event)=>{
      let data = JSON.parse(event);
      let command = data['command']
      // console.log(data)
      if(command ==='update_regions_users'){
        console.log(data)
        actions.loadRegions(data['data'])
      }
      if(command ==='zoom_to_specific_reach'){
        mapActions.delete_layer_by_name("reach_on_click_from_region") //remove the current layer
        let responseRegions_obj = JSON.parse(data['data']['geometry'])
        const ReachLayer = createClickedReachLayer("reach_on_click_from_region",responseRegions_obj)
        mapActions.addLayer(ReachLayer);
        setTimeout(() => {
          console.log("zooming to layer")
          zoomToLayerbyName(mapState.mapObject, "reach_on_click_from_region");
        }, 1000);

      }
  
    }


    websocketActions.addMessageHandler(updateRegionsMessageListener);
    return () => {
      console.log("unmounting update_regions_users")
      webSocketState.client.off(updateRegionsMessageListener)
      console.log("reseting regions")
      actions.reset()
    }
  }, []);


  return (
      <RegionsContext.Provider value={{ ...regionsState, actions }}>
          {children}
      </RegionsContext.Provider>

  );
};