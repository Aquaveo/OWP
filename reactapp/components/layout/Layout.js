import { Route, Routes } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import Header from 'components/layout/Header';
import NavMenu from 'components/layout/NavMenu';
import NotFound from 'components/error/NotFound';
import Container from 'react-bootstrap/Container';
import { AppContext } from 'components/context';
import { Button } from 'react-bootstrap';
function Layout({navLinks, routes, children}) {
  const {tethysApp} = useContext(AppContext);
  const [navVisible, setNavVisible] = useState(false);

  return (
    <div className="h-100">
        <Header onNavChange={setNavVisible} />
        <NavMenu navTitle="About"  navVisible={navVisible} onNavChange={setNavVisible}>
          <h5>Layers</h5>
          <p>Layers used for this application:
            <ul>
              <li><a href="https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer"> Light Gray World BaseMap</a></li>
              <li><a href="https://mapservices.weather.noaa.gov/vector/rest/services/obs/NWM_Stream_Analysis/MapServer">National Stream Analysis Anomaly</a></li>
            </ul>
          </p>
          <h5>National Water Prediction Service (NWPS) API Data Services</h5>
          <p>When Clicking on a reach, a modal will pop up with the following time series:</p>
          <p>
            <ul>
              <li>Analysis Assimilation</li>
              <li>Short Range Forecast</li>
              <li>Medium Range Blend</li>
              <li>Medium Range Forecast</li>
              <li>Long Range Forecast</li>
            </ul>
          </p>
          <p>For more information:</p>
          <ul>
            <li><a href="https://api.water.noaa.gov/nwps/v1/docs/">API Docs</a></li>
            <li><a href="https://www.weather.gov/media/owp/oh/docs/NWPS_API_Flyer_V6.pdf">API Flyer</a></li>
          </ul>
          <h5>Regions</h5>
          <p>Regions are created by the user using a geometry (*.geojson, *.geopkg, *.shp ) or list of reaches (*.csv) in order to create a <a href="https://www.hydroshare.org/home/"> HydroShare </a> resource with two files: 
            <ul>
              <li><em>reaches_nhd_data.csv</em></li>
              <li><em>nwm_commids.json</em></li>
            </ul>          
          </p>
          <p>A region can be imported from a <a href="https://www.hydroshare.org/home/"> HydroShare </a> resource containing this two files</p>
          <p>Once the region is created, the long range forecast mean can be accessed for every 50 reaches using the <a href="https://nwm-api.ciroh.org/docs"> National Water Model API </a> </p>
          <h5>More Information</h5>
          <p><a href="https://github.com/Aquaveo/OWP"> Source Code </a></p>
        </NavMenu>
        <Routes>
          {routes}
          <Route path="*" element={<NotFound />}/>
        </Routes>
        {children}
    </div>
  );
}

Layout.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      to: PropTypes.string,
      eventKey: PropTypes.string,
    })
  ),
  routes: PropTypes.arrayOf(
    PropTypes.node,
  ),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

export default Layout;