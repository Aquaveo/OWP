
import { RegionsRows } from './regionsRows';
import {  useContext, useEffect, useState,Fragment } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useForm } from "react-hook-form"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'


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
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        } = useForm()

    const onSubmit = (data) => console.log(data)

    return (
        <Fragment>
            <Row>
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <InputGroup className="mb-3">
                        <FormControl
                            ref={register("reachID")}
                            isInvalid={errors.term}    
                        />

                    <Button variant="primary" type="submit">
                        Search
                    </Button>
                    </InputGroup>
 
                </Form>
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