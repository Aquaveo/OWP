import React, { Fragment, useState,useCallback,useEffect } from 'react';
import Modal from "components/UI/Modal/Modal";
import { useNwpProductsContext } from 'features/NwpProducts/hooks/useNwpProductsContext';
import LineChart from 'features/NwpProducts/components/LineChart';
import {LoaderContainer, LoadingText} from 'components/UI/StyleComponents/Loader.styled';

const ChartModalView = () => {

  const {state:currentProducts, actions:nwpActions} = useNwpProductsContext();


  const Toggle = () =>{ 
    console.log('toggle')
    nwpActions.handleModalState(!currentProducts.isModalOpen)
  };


  return (
    <Fragment>

        <Modal show={currentProducts.isModalOpen} close={Toggle} title="">
          <LineChart/>
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