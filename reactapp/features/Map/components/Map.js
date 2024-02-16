import React, { Fragment, useEffect } from 'react';
import { MapProvider } from './MapProvider';
import Layers from './LayersWrapper';

const Map = ({ layers }) => {

  useEffect(() => {
    console.log('MapView useEffect');
  }, []);

  return (
    <Fragment>
      <MapProvider>
        <Layers layers={layers} />
      </MapProvider>
    </Fragment>
  );
};

export default Map;
  