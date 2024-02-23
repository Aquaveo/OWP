import React, { Fragment, useEffect,Suspense } from 'react';
import { MapProvider } from './MapProvider';
// import Layers from './LayersWrapper';

const Layers = React.lazy(() => import('./LayersWrapper'));

const Map = ({ layers }) => {

  useEffect(() => {
    
  }, []);

  return (
    <Fragment>
      <MapProvider>
        <Suspense fallback={<div>LOADING.....</div>}>
          <Layers layers={layers} />
        </Suspense>
      </MapProvider>
    </Fragment>
  );
};

export default Map;
  