import React, { useEffect , useRef } from 'react';
import NwmContext from 'features/Nwm/contexts/NwmContext';
import { useNwm } from '../hooks/useNwm';

const NwmProvider = ({ children }) => {
  const {state,actions} = useNwm();


  useEffect(() => {

  }, []);


  return (
    <NwmContext.Provider value={{ ...state, actions }}>
        {children}
    </NwmContext.Provider>
  );
};

export default NwmProvider;