
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export const RegionsRow = ({availableRegions}) => {

    return (
        <>
            <Row className='mb-2'>
                <Col sm={4}>
                    Name
                </Col>
                <Col sm={4}>
                    Type
                </Col>
                <Col sm={2} >
                    Hide/Show
                </Col>
            </Row>

            {availableRegions && availableRegions.map((availableRegion, index) => (
                <Form as={Row} key={index} className='mb-2'>
                    <Col sm={4}>
                        <Form.Group >
                            <Form.Control plaintext readOnly defaultValue={availableRegion.name} />
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Group>
                            <Form.Control plaintext readOnly defaultValue={availableRegion.region_type} />
                        </Form.Group>
                    </Col>
                    <Col sm={2} >
                        <Form.Group>
                            <Form.Check
                                type="switch"
                                id="default-region"
                                // value={availableRegion.default}
                                checked={ availableRegion.default }
                            />
                        </Form.Group>
                    </Col>
                </Form>
            ))}
        </>
    );

  }