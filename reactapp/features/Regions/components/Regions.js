import React from 'react';
import { RegionsProvider } from '../providers/RegionsProvider';
import { RegionsMenu } from './RegionsMenu';
import { RegionsFormProvider } from './forms/providers/RegionsFormProvider';

const Regions = ({props}) => {
 
  return (
      <RegionsProvider>
        <RegionsFormProvider>
          <RegionsMenu />
        </RegionsFormProvider>
      </RegionsProvider>
  );
};

export {Regions}