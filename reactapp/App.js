import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';
import OWPView from 'views/OwpView';
import { WebSocketProvider } from 'features/WebSocket/providers/WebSocketProvider';
import NwpProductsProvider from 'features/NwpProducts/providers/NwpProductsProvider';
import Map from 'features/Map/components/Map';
import { getWsURL } from 'lib/utils';
import LearnReact from 'views/learn/LearnReact';
import 'App.scss';


const TETHYS_PREFIX_URL = process.env.TETHYS_PREFIX_URL.replace(/^\/|\/$/g, '');
const redirect_hydroshare = TETHYS_PREFIX_URL ? `/${TETHYS_PREFIX_URL}/oauth2/login/hydroshare/` : "/oauth2/login/hydroshare/"


// const webSocketHost = process.env.TETHYS_WEB_SOCKET_HOST
// const prefix_url = process.env.TETHYS_PREFIX_URL ? `/${process.env.TETHYS_PREFIX_URL.replace(/^\/|\/$/g, '')}/` : '';
// const app_root_relative_path = process.env.TETHYS_APP_ROOT_URL_RELATIVE ? `${process.env.TETHYS_APP_ROOT_URL_RELATIVE.replace(/^\/|\/$/g, '')}` : '';
// const ws = 'ws://' + webSocketHost + prefix_url + app_root_relative_path + '/data-notification/notifications/ws/';

const ws = getWsURL();

function App() {
  const PATH_HOME = '/',
        PATH_INFO = '/Information/';
  // const layers = [];
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
                        <WebSocketProvider url={ws} >
                          <Map>
                            <NwpProductsProvider>
                              <OWPView />
                            </NwpProductsProvider>
                          </Map>
                        </WebSocketProvider>
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


