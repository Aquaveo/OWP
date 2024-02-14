import React, { Fragment, useEffect } from 'react';
import { MapProvider } from '../components/Map';
import Layers from '../components/layers/LayersWrapper';
const MapView = () => {

  useEffect(() => {
    console.log('MapView useEffect');
  }, []);

  return (
    <Fragment>
      <MapProvider>
        <Layers />
      </MapProvider>
    </Fragment>
  );
};

export default MapView;