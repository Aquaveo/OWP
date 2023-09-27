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
  const [navVisible, setNavVisible] = useState(true);


  const [availableRegions, setAvailableRegions] = useState([]);
  const PATH_HOME = '/',
        PATH_INFO = '/Information/';

  const handleShowRegionMenu = () => {
    setNavVisible(false);
    setShowRegionsMenu(true);
    hideAllUserRegions()
  };

  const hideAllUserRegions = () => {
    const updatedHiddenRegions = availableRegions.map(availableRegion => ({
      ...availableRegion,
      is_visible: false,
    }));

    setAvailableRegions(updatedHiddenRegions);
  };
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
              navVisible={navVisible}
              setNavVisible={setNavVisible}
              routes={[
                <Route path={PATH_HOME} element={<Home setNavVisible={setNavVisible} showRegionsMenu={showRegionsMenu} handleShowRegionMenu={handleShowRegionMenu} showRegions={showRegions} setShowRegionsVisible ={setShowRegionsVisible} setAvailableRegions={setAvailableRegions} availableRegions={availableRegions} />} key='route-home' />,
                <Route path={PATH_INFO} element={<LearnReact />} key='route-learn' />
              ]}
            />
          </Loader>
      </ErrorBoundary>
    </>
  );
}

export default App;