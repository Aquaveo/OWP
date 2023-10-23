
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

export const RegionsRows = ({availableRegions, setAvailableRegions,availableReachesList}) => {

      const openPlot = (index) => {

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