
import { RegionsRows } from './regionsRows';
import {  useContext, useEffect, useState,Fragment } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useForm } from "react-hook-form"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Paginate } from 'components/Pagination/paginate';


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
        currentPage,
        setSearchReachInput
    }) => {


    function handleSubmitReach(event) {
        event.preventDefault();
    
        // Do something with the search input
    }
    function handleOnChangeInSearchBar(event){
        console.log(event.target.value)
        setSearchReachInput(event.target.value)
    }

    return (
        <Fragment>
            {availableReachesList && availableReachesList.length > 0 && 
            <Fragment>
                <Row className='mb-2'>
                    <Form
                        onSubmit={handleSubmitReach}
                    >
                        <InputGroup className="mb-3">
                            <Form.Control 
                                size="sm" 
                                type="text" 
                                placeholder="Type a Reach COMID" 
                                onChange={(event) => handleOnChangeInSearchBar(event)}    
                            />
                        {/* <Button 
                            variant="primary" 
                            type="submit"
                            size="sm"
                        >
                        <p className='text-white'>
                                Search
                            </p> 
                        </Button> */}
                        </InputGroup>
    
                    </Form>
                </Row>

                <Row className='mb-2'>
                    <Paginate 
                        currentPageNumber={currentPageNumber}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                    />
                </Row>
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
            </Fragment>

            }
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