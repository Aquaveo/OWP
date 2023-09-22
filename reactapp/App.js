import { Route } from 'react-router-dom';
import { useState } from 'react';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';

import LearnReact from 'views/learn/LearnReact';
import Home from 'views/home_page/Home';

import 'App.scss';

function App() {
  const [showRegions,setShowRegionsVisible] = useState(false);
  const [showRegionsMenu, setShowRegionsMenu] =  useState(false);
  const handleShowRegionMenu = () => setShowRegionsMenu(true);

  const [availableRegions, setAvailableRegions] = useState([]);
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
              handleShowRegionMenu={handleShowRegionMenu}
              availableRegions={availableRegions}
              routes={[
                <Route path={PATH_HOME} element={<Home showRegionsMenu={showRegionsMenu} handleShowRegionMenu={handleShowRegionMenu} showRegions={showRegions} setShowRegionsVisible ={setShowRegionsVisible} setAvailableRegions={setAvailableRegions} availableRegions={availableRegions} />} key='route-home' />,
                <Route path={PATH_INFO} element={<LearnReact />} key='route-learn' />
              ]}
            />
          </Loader>
      </ErrorBoundary>
    </>
  );
}

export default App;