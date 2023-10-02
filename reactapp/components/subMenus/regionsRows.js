
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export const RegionsRow = ({availableRegions, setAvailableRegions}) => {

      const toggleVisibilityRegion = (index) => {
          setAvailableRegions((prevData) => {
          // Create a copy of the previous state array
          const newData = [...prevData];
          
          // Toggle the "is_visible" property of the object at the specified index
          newData[index] = { ...newData[index], is_visible: !newData[index].is_visible };
          
          return newData;
        });
      };



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
                    <Col sm={4} >
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
                                value={availableRegion.is_visible}
                                checked={availableRegion.is_visible}
                                onChange={(e) => toggleVisibilityRegion(index)}
                            />
                        </Form.Group>
                    </Col>
                </Form>
            ))}
        </>
    );

  }