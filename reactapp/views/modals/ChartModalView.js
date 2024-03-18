import React, { Fragment, useState,useCallback,useEffect } from 'react';
import Modal from "components/UI/Modal/Modal";
import { initializeChart, updateSeries, onPointerOver, onPointerOut} from "lib/chartFunctions";
import { useNwpProductsContext } from 'features/NwpProducts/hooks/useNwpProductsContext';
import LineChart from 'features/NwpProducts/components/LineChart';
import {LoaderContainer, LoadingText} from 'components/UI/StyleComponents/Loader.styled';
import {handleMessage} from 'lib/consumerMessages'
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';

const ChartModalView = () => {

  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();


  const Toggle = () =>{ 
    console.log('toggle')
    nwpActions.handleModalState(!currentProducts.isModalOpen)
  };


  

  return (
    <Fragment>

        <Modal show={currentProducts.isModalOpen} close={Toggle} title="">
          <LineChart
                initializeChart={initializeChart} 
                updateSeries={updateSeries} 
                onClickLegend={nwpActions.toggleProduct} 
                onPointerOverLegend={onPointerOver}
                onPointerOutLegend={onPointerOut}
            />

        </Modal>
      {currentProducts.areProductsLoading &&
        <LoaderContainer>
          <LoadingText>Loading Products...</LoadingText>
        </LoaderContainer>
      }
    </Fragment>

  )
}

export default ChartModalView;