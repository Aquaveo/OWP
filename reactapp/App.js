import { Route } from 'react-router-dom';
import { useState,useEffect } from 'react';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';

import LearnReact from 'views/learn/LearnReact';
import Home from 'views/home_page/Home';
import { Notification } from 'components/notifications/notification';
import { showToast } from "services/notifications/notificationService";

import 'App.scss';

function App() {
  const [showRegions,setShowRegionsVisible] = useState(false);
  const [showMainRegionsMenu, setShowMainRegionsMenu] = useState(false);
  const [showRegionsMenu, setShowRegionsMenu] =  useState(false);
  const [showReachesListMenu, setShowReachesListMenu] =  useState(false);
  const [showAddRegionMenuFromHydroShare, setShowAddRegionMenuFromHydroShare] = useState(false);
  const [navVisible, setNavVisible] = useState(false);


  const [availableRegions, setAvailableRegions] = useState([]);
  const PATH_HOME = '/',
        PATH_INFO = '/Information/';

  const handleShowReachesListRegionMenu = () => {
    setShowReachesListMenu(true);
    setShowRegionsMenu(false);
    setShowAddRegionMenuFromHydroShare(false);
    hideAllUserRegions();
  };

  const handleShowRegionMenu = () => {
    setShowRegionsMenu(true);
    setShowReachesListMenu(false);
    setShowAddRegionMenuFromHydroShare(false);
    hideAllUserRegions();
  };

  const handleShowMainRegionMenu = () => {
    setShowMainRegionsMenu(true);
  };

  const handleShowAddRegionMenuFromHydroShare = () => {
    setShowAddRegionMenuFromHydroShare(true);
    setShowRegionsMenu(false);
    setShowReachesListMenu(false);
    hideAllUserRegions();
  };


  const toggleAddRegionMenu = () => {
    setShowRegionsMenu((prevValue) => !prevValue);
  };

  const toggleReachesListRegionMenu = () => {
    setShowReachesListMenu((prevValue) => !prevValue);
  };

  const toggleShowAddRegionMenuFromHydroShare = () => {
    setShowAddRegionMenuFromHydroShare((prevValue) => !prevValue);
  };


  const hideAllUserRegions = () => {
    const updatedHiddenRegions = availableRegions.map(availableRegion => ({
      ...availableRegion,
      is_visible: false,
    }));

    setAvailableRegions(updatedHiddenRegions);
  };
  useEffect(() => {
    console.log(home_context.message)
    if (home_context.message === 'Error saving the Regions for current user'){
      setTimeout(showToast('info',home_context.message),5000)
      
    }
  }, [])
  



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
                <Route 
                  path={PATH_HOME} 
                  element={
                    <div>
                    <Home 
                      showRegionsMenu={showRegionsMenu}
                      showReachesListMenu={showReachesListMenu}
                      handleShowRegionMenu={handleShowRegionMenu}
                      handleShowReachesListRegionMenu={handleShowReachesListRegionMenu}
                      toggleAddRegionMenu={toggleAddRegionMenu}
                      toggleReachesListRegionMenu={toggleReachesListRegionMenu}
                      showRegions={showRegions}
                      setShowRegionsVisible={setShowRegionsVisible}
                      setAvailableRegions={setAvailableRegions}
                      availableRegions={availableRegions} 
                      showMainRegionsMenu={showMainRegionsMenu}
                      handleShowMainRegionMenu={handleShowMainRegionMenu}
                      showAddRegionMenuFromHydroShare={showAddRegionMenuFromHydroShare}
                      handleShowAddRegionMenuFromHydroShare={handleShowAddRegionMenuFromHydroShare}
                      toggleShowAddRegionMenuFromHydroShare={toggleShowAddRegionMenuFromHydroShare}
                    />

                    </div>

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