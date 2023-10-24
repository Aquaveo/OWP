
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { GoGraph } from "react-icons/go";
import { Sparklines, SparklinesLine } from '@jrwats/react-sparklines';

import {  useContext, useEffect, useState,Fragment } from "react";
import MapContext from "../map/MapContext";
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector'

export const RegionsRows = ({
    availableRegions, 
    setAvailableRegions,
    availableReachesList,
    setCurrentStationID,
    setCurrentStation,
    setCurrentProducts,
    handleShow,
    setMetadata

}) => {

      const openPlot = (stationID) => {
        setCurrentStationID(stationID);
        // setCurrentStationID(Math.random());
        setCurrentStation(stationID);
        setCurrentProducts({type: "reset"});
        handleShow();
        let dataRequest = {
            station_id: stationID,
            products: currentProducts
        }
        appAPI.getForecastData(dataRequest);

        // GeoReverse API to get the name of the river
        const urlSGeoReverseService = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode'
        const queryGeoReverse ={
            f: 'json',
            sourceCountry: 'USA',
            location:JSON.stringify(geometry),
            distance: 8000,	
        }
        
        const urlGeo = new URL(`${urlSGeoReverseService}`);
        urlGeo.search = new URLSearchParams(queryGeoReverse);
        axios.get(urlGeo).then((response) => {
            //MOVE IT LATER, When only clicking on layer
            handleShow();

            console.log(response.data);
            var lat = response.data['location']['x'];
            var lon = response.data['location']['y'];
            var regionName = response.data['address']['Region'];
            var cityName = response.data['address']['City']
            const metadataArray = [
                `${stationName} - ${cityName}, ${regionName}`,
                `streamflow for Reach ID: ${stationID} (lat: ${lat} , lon: ${lon})`
            ]
            setMetadata(metadataArray);

        });
      };   
      const sampleData = [5, 10, 5, 20, 8, 15]; 
    return (

            <Row className='mb-2'>

            {availableReachesList && availableReachesList.map((availableReach, index) => (
                <Row key={index} className='mb-2'>
                    <Col sm={2} >
                    {availableReach['COMID']}
                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#FFFC31" />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#F26419" />
                    </Sparklines>


                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#DD1C1A" />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#AF2BBF" />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                        <Button 
                            variant="primary" 
                            className="text-white"
                            onClick={(e) => openPlot(availableReach['COMID'])}
                        >
                            <GoGraph/>
                        </Button>
                    </Col>
                </Row>
            ))}
            </Row>

    );

  }