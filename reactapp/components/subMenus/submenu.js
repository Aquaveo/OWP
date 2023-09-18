import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge } from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import { FaBeer } from 'react-icons/fa';
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { SpanBadge } from 'components/styles/Badge.styled';
import { Modal } from 'react-bootstrap';
import Layers from 'components/layers/Layers';
import { OlTileLayer } from 'components/layers/OlTileLayer';
import { useRef, useState, useEffect } from "react"
import { fromLonLat } from 'ol/proj';
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import LayerGroup from 'ol/layer/Group';


const baseMapLayerURL= 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';

export const SubMenu = ({ name,handleShow, ...props}) => {

    return (
            <Row>
                <Col sm={10} >
                    {name}
                </Col>
                <Col sm={2}>
                    <Button variant="primary" onClick={handleShow} >
                            <MdOutlineAddLocationAlt />
                    </Button>

                </Col>
            </Row>

    );
  }