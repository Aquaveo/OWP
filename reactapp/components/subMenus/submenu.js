
import { RegionsRows } from 'components/subMenus/regionsRows';
import { Fragment } from "react";
import {Row, Col, Form, InputGroup} from 'react-bootstrap';
import { Paginate } from 'components/Pagination/paginate';


export const SubMenu = (
    { 
        availableReachesList,
        setCurrentStation,
        setCurrentStationID,
        setCurrentProducts,
        handleShow,
        setMetadata,
        currentPageNumber,
        setCurrentPage,
        currentPage,
        setSearchReachInput,
        promptTextAvailableReachesList
    }) => {


    function handleSubmitReach(event) {
        event.preventDefault();
    
        // Do something with the search input
    }
    function handleOnChangeInSearchBar(event){
        console.log(event.target.value)
        setSearchReachInput(event.target.value)
        setCurrentPage(1)
    }

    return (
        <Fragment>

            {availableReachesList && 
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
                        </InputGroup>
    
                    </Form>
                </Row>
                {availableReachesList && availableReachesList.length > 0 &&
                    <Fragment>
                        <Row className='mb-2'>
                            <Paginate 
                                currentPageNumber={currentPageNumber}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                            />
                        </Row>
                        <Row>
                            <p>{promptTextAvailableReachesList}</p>
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
                                
                {availableReachesList && availableReachesList.length < 1 &&
                    <Row>
                        <p>{promptTextAvailableReachesList}</p>
                    </Row>
                }

            </Fragment>

            }

            <RegionsRows 
                availableReachesList={availableReachesList}
                setCurrentStationID={setCurrentStationID}
                setCurrentStation={setCurrentStation}
                setCurrentProducts={setCurrentProducts}
                handleShow={handleShow}
                setMetadata={setMetadata}
            />
        </Fragment>


    );
  }