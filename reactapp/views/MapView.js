import React, { Fragment, useEffect,useCallback} from 'react';
import { useMapContext } from 'features/Map/hooks/useMapContext';
import { useNwpProductsContext } from 'features/NwpProducts/hooks/useNwpProductsContext';
import appAPI from 'services/api/app';
import MapEvents from 'lib/mapEvents';
import layerData from 'lib/layerData';


import LoadingAnimation from 'components/loader/LoadingAnimation';

const mapEvents = new MapEvents();
const initialLayersArray = new layerData().getLayersArray();

const MapView = (props) => {
  const {state: mapState, actions: mapActions } = useMapContext();

  const {state: nwmState,actions: nwpActions } = useNwpProductsContext(); 
  

  const onPointerMoveLayersEventCallback = useCallback((event) => {
    return mapEvents.onPointerMoveLayersEvent(
      event
    );
  },[]);
  const onClickEventHandlerCallBack = useCallback((event) => {    
    return mapEvents.onClickLayersEvent(
      event,
      nwpActions,
      nwmState,
      appAPI,
      mapActions,
      props.setIsLoading
    );
  },[])

  const onLoadStartHandlerCallBack = useCallback((event) => {
    return mapEvents.onStartLoadingLayersEvent(
      event,
      props.setIsLoading
    );
  },[])

  const onLoadEndHandlerCallBack = useCallback((event) => {
    return mapEvents.onEndLoadingLayerEvent(
      event,
      props.setIsLoading
    );
  },[])


  useEffect(() => {

    //Add events
    mapActions.add_click_event(onClickEventHandlerCallBack);
    mapActions.add_load_start_event(onLoadStartHandlerCallBack);
    mapActions.add_load_end_event(onLoadEndHandlerCallBack);
    mapActions.add_pointer_move_event(onPointerMoveLayersEventCallback);


    //adding layers
    initialLayersArray.forEach(layer => {
      mapActions.addLayer(layer);
    })
    
  
    // remove the layers wheen the component unmounts
    return () => {
      if(!mapState.mapObject) return
      //delete added layers when unmounting
      initialLayersArray.forEach(layer => {
        mapActions.delete_layer_by_name(layer.options.name)
      })

    }

  }, []);
  
  return (
    <Fragment>
      {props.isLoading ?
        <LoadingAnimation /> : 
        <></>
      }
      
    </Fragment>
  );
};

export default MapView;