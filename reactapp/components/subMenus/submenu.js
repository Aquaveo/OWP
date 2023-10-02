import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge } from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import { FaBeer } from 'react-icons/fa';
import {  MdOutlineEdit } from "react-icons/md";
import { BsPlusLg, BsTrash } from "react-icons/bs";

import {  } from "react-icons/md";

import { SpanBadge } from 'components/styles/Badge.styled';
import { Modal } from 'react-bootstrap';
import Layers from 'components/layers/Layers';
import { OlTileLayer } from 'components/layers/OlTileLayer';
import { useRef, useState, useEffect,useContext } from "react"
import { fromLonLat } from 'ol/proj';
import { ArcGISRestTile } from "components/source/TileArcGISRest";
import LayerGroup from 'ol/layer/Group';
import { RegionsRow } from './regionsRows';

export const SubMenu = ({ name,handleShowRegionMenu,availableRegions,setAvailableRegions}) => {


    return (
        <>
            <Row className='mb-2'>
                <Col sm={8} >
                    {name}
                </Col>
                <Col sm={4}>
                    <Button variant="secondary" size="sm" onClick={handleShowRegionMenu} >
                        <BsPlusLg />
                    </Button>
                    {/* <Button variant="info" size="sm" onClick={handleShowRegionMenu} >
                        <MdOutlineEdit />
                    </Button>
                    <Button variant="danger" size="sm"onClick={handleShowRegionMenu} >
                        <BsTrash />
                    </Button> */}
                </Col>
            </Row>
            <RegionsRow availableRegions={availableRegions} setAvailableRegions={setAvailableRegions}/>

            
        </>


    );
  }