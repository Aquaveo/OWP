
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { TbZoomPan } from "react-icons/tb";
import {  useContext, useEffect, useState,Fragment } from "react";
import MapContext from "../map/MapContext";

export const RegionsRow = ({availableRegions, setAvailableRegions}) => {
     const { map } = useContext(MapContext);
     const [currentLayerIndex, setCurrentLayerIndex] = useState()
      const toggleVisibilityRegion = (index) => {
          console.log("hey")
          setCurrentLayerIndex(index);
          setAvailableRegions((prevData) => {
          // Create a copy of the previous state array
          const newData = [...prevData];
          
          // Toggle the "is_visible" property of the object at the specified index
          newData[index] = { ...newData[index], is_visible: !newData[index].is_visible };
          
          return newData;
        });
      };

      const zoomToRegionExtent = (index) => {
        if (!map) return;
        setCurrentLayerIndex(index);

        if (!availableRegions[index]['is_visible']) return;
        const current_region = map.getLayers().getArray().find(layer => layer.get('name') === `${availableRegions[index]['name']}_user_region`);
        const layerExtent = current_region.getSource().getExtent();
        map.getView().fit(layerExtent, {
            padding: [10, 10, 10, 10], // Optional padding around the extent.
            duration: 1000, // Optional animation duration in milliseconds.
          });
      };   
    
      useEffect(() => {
        if (!currentLayerIndex) return;
        if(availableRegions[currentLayerIndex]['is_visible']){
            zoomToRegionExtent(currentLayerIndex);
        }
      
        return () => {
          
        }
      }, [currentLayerIndex])
      

    return (
        <Fragment>
            <Row className='mb-2'>
                <Col className="text-white fw-bold" sm={4}>
                    Name
                </Col >
                <Col className="text-white fw-bold" sm={4} >
                    Hide/Show
                </Col>
                <Col className="text-white fw-bold" sm={4} >
                    Zoom to Region
                </Col>
            </Row>

            <Row className='mb-2'>

            {availableRegions && availableRegions.map((availableRegion, index) => (
                <Form as={Row} key={index} className='mb-2'>
                    <Col sm={4} >
                        <Form.Group className="text-white" >
                            <Form.Control className="text-white" plaintext readOnly defaultValue={availableRegion.name} />
                        </Form.Group>
                    </Col>
                    <Col sm={4} >
                        <Form.Group className="text-white">
                            <Form.Check
                                type="switch"
                                id="default-region"
                                value={availableRegion.is_visible}
                                checked={availableRegion.is_visible}
                                onChange={(e) => toggleVisibilityRegion(index)}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={4} >
                        <Button 
                            variant="primary" 
                            className="text-white"
                            onClick={(e) => zoomToRegionExtent(index)}
                        >
                            <TbZoomPan/>
                        </Button>
                    </Col>
                </Form>
            ))}
            </Row>
        </Fragment>
    );

  }