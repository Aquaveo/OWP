
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
import Pagination from 'react-bootstrap/Pagination';

export const RegionsRows = ({
    availableRegions, 
    setAvailableRegions,
    availableReachesList,
    setCurrentStationID,
    setCurrentStation,
    setCurrentProducts,
    currentProducts,
    handleShow,
    setMetadata,
    setCurrentPageNumber
}) => {

      const openPlot = (availableReach) => {
        console.log(availableReach)
        let stationID = availableReach['COMID']
        let stationName = availableReach['GNIS_NAME']
        setCurrentStationID(stationID);
        // setCurrentStationID(Math.random());
        setCurrentStation(stationID);
        setCurrentProducts({type: "reset"});
        handleShow();
        const metadataArray = [
            `${stationID} ${stationName} `,
            `streamflow for Reach ID: ${stationID}`
        ]
        setMetadata(metadataArray);
      };
      const paginationClicked = (event) => {
        var itemClicked = event.target.text;
        console.log(Number(itemClicked)-1)
        setCurrentPageNumber(Number(itemClicked)-1)
      }
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
                            size="sm"
                            onClick={(e) => openPlot(availableReach)}
                        >
                            <GoGraph/>
                        </Button>
                    </Col>
                </Row>
            ))}
            <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item 
                onClick={(event) => paginationClicked(event)}
            >{1}
            </Pagination.Item>
            <Pagination.Item
                onClick={(event) => paginationClicked(event)}
            >
                {2}
            </Pagination.Item>
            <Pagination.Item
             onClick={(event) => paginationClicked(event)}
            >
                {3}
            </Pagination.Item>
            <Pagination.Item
                onClick={(event) => paginationClicked(event)}
            >
                {4}
            </Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
            </Pagination>

            </Row>

    );

  }