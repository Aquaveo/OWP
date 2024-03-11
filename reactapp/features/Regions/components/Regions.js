import React from 'react';
import { RegionsProvider } from './RegionsProvider';
import { RegionsMenu } from './RegionsMenu';


const Regions = ({props}) => {
 
  return (
      <RegionsProvider>
        <RegionsMenu />
      </RegionsProvider>
  );
};

export {Regions}