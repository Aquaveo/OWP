
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export const RegionsRow = ({props}) => {

    return (
        <Row>
            <Form>
                <Form.Group as={Col}>
                    <Form.Control plaintext readOnly defaultValue={props.name} />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Control plaintext readOnly defaultValue={props.regionType} />
                </Form.Group>
                <Form.Group as={Col}> 
                        <Form.Check
                            type="switch"
                            id="default-region"
                            label="Check this switch"
                            value={props.default}
                        />
                </Form.Group>
            </Form>
        </Row>
    );
  }