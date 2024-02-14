import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';
import MapView from 'features/Map/pages/mapView';

import LearnReact from 'views/learn/LearnReact';
import 'App.scss';


const TETHYS_PREFIX_URL = process.env.TETHYS_PREFIX_URL.replace(/^\/|\/$/g, '');
const redirect_hydroshare = TETHYS_PREFIX_URL ? `/${TETHYS_PREFIX_URL}/oauth2/login/hydroshare/` : "/oauth2/login/hydroshare/"
function App() {

  const PATH_HOME = '/',
        PATH_INFO = '/Information/';


  return (
    <>
      <ErrorBoundary>
          <Loader>
              <Layout 
                navLinks={[
                  {title: 'OWP Application', to: PATH_HOME, eventKey: 'link-home'},
                  {title: 'Information', to: PATH_INFO, eventKey: 'link-learn'},
                ]}
                routes={[
                  <Route 
                    path={PATH_HOME} 
                    element={
                      <Fragment>
                        <MapView />
                      </Fragment>

                    } 
                      key='route-home' />,
                  <Route path={PATH_INFO} element={<LearnReact />} key='route-learn' />
                ]}
              />
          </Loader>
      </ErrorBoundary>
    </>
  );
}

export default App;


