import React, { useEffect , useRef } from 'react';
import NwpContext from 'features/NwpProducts/contexts/NwpProductsContext';
import { useNwpProducts } from '../hooks/useNWPProducts';
import appAPI from 'services/api/app';

const NwpProductsProvider = ({ children }) => {
  const {state,actions} = useNwpProducts();


  useEffect(() => {

  }, []);


  return (
    <NwpContext.Provider value={{ ...state, actions }}>
        {children}
    </NwpContext.Provider>
  );
};

export default NwpProductsProvider;