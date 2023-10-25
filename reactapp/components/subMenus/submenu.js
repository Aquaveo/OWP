
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
        availableReachesList,
        setCurrentStation,
        setCurrentStationID,
        setCurrentProducts,
        currentProducts,
        handleShow,
        setMetadata,
        currentPageNumber,
        setCurrentPage,
        currentPage
    }) => {
    return (
        <Fragment>

            <Row className='mb-2'>
                <Col className="text-white fw-bold" sm={2}>
                    COMID
                </Col >
                <Col className="text-white fw-bold" sm={2} >
                    AA
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    SF
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    LF Mean
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    MF Mean
                </Col>
                <Col className="text-white fw-bold" sm={2} >
                    Actions
                </Col>
            </Row>
            <RegionsRows 
                availableRegions={availableRegions} 
                setAvailableRegions={setAvailableRegions}
                availableReachesList={availableReachesList}
                setCurrentStation={setCurrentStation}
                setCurrentStationID={setCurrentStationID}
                setCurrentProducts={setCurrentProducts}
                currentProducts={currentProducts}
                handleShow={handleShow}
                setMetadata={setMetadata}
                currentPageNumber={currentPageNumber}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
        </Fragment>


    );
  }