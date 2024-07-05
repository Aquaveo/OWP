import React, { Fragment, useState,useCallback,useEffect } from 'react';
import Modal from "components/UI/Modal/Modal";
import { useNwmContext } from 'features/Nwm/hooks/useNwmContext';
import ReachChart from 'features/Nwm/components/ReachChart';
import {LoaderContainer, LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import {handleMessage} from 'lib/consumerMessages';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
import LoadingAnimation from 'components/loader/LoadingAnimation';
import GaugeTabView from './GaugeTabView';
import Tabs from 'components/UI/Tabs/Tabs';


const NwpStreamsChartModalView = () => {

  const {state:currentProducts, actions:nwpActions} = useNwmContext();
  
  const {state:webSocketState,  actions:webSocketActions} = useWebSocketContext();
  const [tabs, setTabs] = useState([
    {
      title: "NWM Stream",
      content: <ReachChart/>
    }
  ]);

  const Toggle = () =>{ 
    console.log('toggle')
    nwpActions.handleModalState(!currentProducts.isModalOpen)
  };


  const updateProductsMessageListener = useCallback((event) => {
    handleMessage(
      event, 
      nwpActions
    );
  }, []);

  useEffect(() => {

    webSocketActions.addMessageHandler(
      updateProductsMessageListener
    )

    // remove the layers wheen the component unmounts
    return () => {
      webSocketState.client.off(updateProductsMessageListener)
    }


  }, []);


  useEffect(() => {
    console.log(currentProducts.gauges.display)
    if (currentProducts.gauges.display) {
      setTabs(prevTabs => [
        ...prevTabs,
        {
          title: "Gauge Streamflow",
          content: <GaugeTabView/>
        }
      ]);
    } else {
      setTabs([
        {
          title: "NWM Stream",
          content: <ReachChart />
        }
      ]);
    }
  }, [currentProducts.gauges.display]);

  useEffect(() => {
    console.log(currentProducts.isModalOpen)
  }, [currentProducts.isModalOpen]);

  return (
    <Fragment>
      {currentProducts.isModalOpen ? (
        <Modal show={currentProducts.isModalOpen} close={Toggle} title="">
          {/* <LineChart /> */}
          <Tabs tabs={tabs} /> {/* Render Tabs component inside the modal */}

        </Modal>
      ) : (
        currentProducts.areProductsLoading ? (
          <LoadingAnimation />
        ) : (
          <></>
        )
      )}
    </Fragment>
  );
}

export default NwpStreamsChartModalView;