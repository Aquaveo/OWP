import { Route } from 'react-router-dom';
import { useState,useEffect } from 'react';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';

import LearnReact from 'views/learn/LearnReact';
import Home from 'views/home_page/Home';
import { Notification } from 'components/notifications/notification';
import { showToast } from "services/notifications/notificationService";
import { CustomNotification } from 'components/styled-components/BsNotification.styled';
import logo from "css/hs-icon-sm.png"

import 'App.scss';

function App() {
  const [showRegions,setShowRegionsVisible] = useState(false);
  const [showMainRegionsMenu, setShowMainRegionsMenu] = useState(false);
  const [showRegionsMenu, setShowRegionsMenu] =  useState(false);
  const [showReachesListMenu, setShowReachesListMenu] =  useState(false);
  const [showAddRegionMenuFromHydroShare, setShowAddRegionMenuFromHydroShare] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [isHydroShareLogin, setIsHydroShareLogin] = useState(true)

  const [availableRegions, setAvailableRegions] = useState([]);
  const PATH_HOME = '/',
        PATH_INFO = '/Information/';

  const handleShowReachesListRegionMenu = () => {
    setShowRegionsMenu(false);
    setShowAddRegionMenuFromHydroShare(false);
    if(!isHydroShareLogin){
      let promptText = 'Please Login to HydroShare to add regions based on a list of stream reaches';
      let prompt = makePromptForHydroShareLogin(promptText)
      showToast('custom',prompt)
      return
    }
    setShowReachesListMenu(true);
    hideAllUserRegions();
  };

  const handleShowRegionMenu = () => {
    setShowReachesListMenu(false);
    setShowAddRegionMenuFromHydroShare(false);
    if(!isHydroShareLogin){
      let promptText = 'Please Login to HydroShare to add regions based on a Geometry Polygon';
      let prompt = makePromptForHydroShareLogin(promptText)
      showToast('custom',prompt)
      return
    }
    setShowRegionsMenu(true);
    hideAllUserRegions();
  };

  const handleShowMainRegionMenu = () => {
    setShowMainRegionsMenu(true);
  };

  const handleShowAddRegionMenuFromHydroShare = () => {
    setShowRegionsMenu(false);
    setShowReachesListMenu(false);
    if(!isHydroShareLogin){
      let promptText = `Please Login to HydroShare to import private regions from HydroShare. 
      Currently only available importing existing public regions from HydroShare.`;
      let prompt = makePromptForHydroShareLogin(promptText)
      showToast('custom',prompt)
      return
    }
    setShowAddRegionMenuFromHydroShare(true);

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
  
  useEffect(()=>{
    if(!isHydroShareLogin){
      let promptText = `Please Login to HydroShare to add regions using a list of reaches, a Geometry Polygon. 
      Currently only available importing existing public regions from HydroShare.`;
      let prompt = makePromptForHydroShareLogin(promptText)
      showToast('custom',prompt)
    }


    //send message to web socket to start again 
  },[isHydroShareLogin])

  const makePromptForHydroShareLogin = (prompt) => {
    if(!isHydroShareLogin){
      let custom_message=<CustomNotification>
      <a href="/oauth2/login/hydroshare/">
        <div className="container-hs-notification">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            Log in with HydroShare
          </div>
          <div>
            <p>{prompt}</p>
          </div>
        </div>

      </a>
    </CustomNotification>
    return custom_message
    }
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
                      isHydroShareLogin={isHydroShareLogin}
                      setIsHydroShareLogin={setIsHydroShareLogin}
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


