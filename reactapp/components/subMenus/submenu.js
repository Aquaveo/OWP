
import { RegionsRows } from './regionsRows';
import {  useContext, useEffect, useState,Fragment } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export const SubMenu = (
    { 
        name,
        handleShowMainRegionMenu,
        availableRegions,
        setAvailableRegions, 
        handleShowRegionMenu,
        availableReachesList
    }) => {
    return (
        <Fragment>

            <Row className='mb-2'>
                <Col className="text-white fw-bold" sm={2}>
                    COMID
                </Col >
                <Col className="text-white fw-bold" sm={2} >
                    Anomaly
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    Short Forecast
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    Long Term Forecast Mean
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    Medium Term Forecast Mean
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    Actions
                </Col>
            </Row>
            <RegionsRows 
                availableRegions={availableRegions} 
                setAvailableRegions={setAvailableRegions}
                availableReachesList={availableReachesList}

            />
        </Fragment>


    );
  }