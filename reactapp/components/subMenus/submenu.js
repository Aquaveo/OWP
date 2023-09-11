import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge } from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import { FaBeer } from 'react-icons/fa';
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { SpanBadge } from 'components/styles/Badge.styled';
import { Modal } from 'react-bootstrap';
import { ModalMap } from 'components/map/ModalMap';
import Layers from 'components/layers/Layers';
import { OlTileLayer } from 'components/layers/OlTileLayer';
import { useRef, useState, useEffect } from "react"
import { fromLonLat } from 'ol/proj';
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import LayerGroup from 'ol/layer/Group';


const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';

export const SubMenu = ({ name,showModal, handleShow,handleClose, modalTitle, ...props}) => {
    const [isFullMap, setIsFullMap] = useState(true)
    const [groupLayers, setGroupLayers] =  useState([
        new LayerGroup({
          title: "Basemaps",
          layers: []
        }),
        new LayerGroup({
          title: "HUCS",
          layers: []
        })
    ]);
    return (
        <Container>
            <Row>
                <Col>
                    {name}
                </Col>
                <Col>
                    <Button variant="primary" onClick={handleShow} >
                            <MdOutlineAddLocationAlt />
                    </Button>
                    <Modal show={showModal} onHide={handleClose} size="xl" >
                        <Modal.Header closeButton>
                            <Modal.Title>{modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalMap 
                                isFullMap={isFullMap} 
                                center={fromLonLat([-94.9065, 38.9884])} 
                                zoom={5}
                            >
                                <Layers>

                                <OlTileLayer
                                    source={ArcGISRestTile(baseMapLayerURL, {
                                        LAYERS: "topp:states",
                                        Tiled: true,
                                    })}
                                    name={"basemap_1"}
                                    groupLayerName={"Basemaps"}
                                    groupLayers = {groupLayers}
                                />  
                                </Layers>

                            </ModalMap>


                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
  }