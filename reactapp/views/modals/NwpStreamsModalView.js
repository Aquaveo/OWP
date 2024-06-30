import React, { Fragment, useState,useCallback,useEffect } from 'react';
import Modal from "components/UI/Modal/Modal";
import { useNwpProductsContext } from 'features/NwpProducts/hooks/useNwpProductsContext';
import LineChart from 'features/NwpProducts/components/LineChart';
import {LoaderContainer, LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import {handleMessage} from 'lib/consumerMessages';
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';


const NwpStreamsChartModalView = () => {

  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();
  
  const {state:webSocketState,  actions:webSocketActions} = useWebSocketContext();


  const Toggle = () =>{ 
    //console.log('toggle')
    nwpActions.handleModalState(!currentProducts.isModalOpen)
  };


  const updateProductsMessageListener = useCallback((event) => {
    handleMessage(
      event, 
      nwpActions.updateProductsState, 
      nwpActions.handleModalState,
      nwpActions.setProductsLoading
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




  return (
    <Fragment>
      {currentProducts.isModalOpen ? (
        <Modal show={currentProducts.isModalOpen} close={Toggle} title="">
          <LineChart />
        </Modal>
      ) : (
        currentProducts.areProductsLoading ? (
          <LoaderContainer>
            <LoadingText>Loading Products...</LoadingText>
          </LoaderContainer>
        ) : (
          <></>
        )
      )}
    </Fragment>
  );
}

export default NwpStreamsChartModalView;