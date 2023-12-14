

import { Button,Col, Row } from 'react-bootstrap';
import { GoGraph } from "react-icons/go";
import { Sparklines, SparklinesLine,SparklinesBars } from '@jrwats/react-sparklines';
import chroma from 'chroma-js';



export const RegionsRows = ({
    availableReachesList,
    setCurrentStationID,
    setCurrentStation,
    setCurrentProducts,
    handleShow,
    setMetadata,
    socketRef,
    setCurrentReachGeometry,
    setCurrentReachGeometryOnClick

}) => {

      const openPlot = (availableReach) => {
        console.log(availableReach)
        let stationID = availableReach['COMID']
        let stationName = availableReach['GNIS_NAME']
        setCurrentStationID(stationID);
        // setCurrentStationID(Math.random());
        setCurrentStation(stationID);
        setCurrentProducts({type: "reset"});
        handleShow();
        const metadataArray = [
            `${stationID} ${stationName} `,
            `streamflow for Reach ID: ${stationID}`
        ]
        setMetadata(metadataArray);
      };
      const zoomToReach = (availableReach) =>{
        //send message to get the geometry
        setCurrentReachGeometryOnClick(null);
        setCurrentReachGeometry(null);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
              JSON.stringify({
                type: "get_specific_reach",
                reach_comid: availableReach['COMID'],
              })
            );
          }
    
      }

      const sampleData = [4,5,6,1,2];
      const color = chroma('#7ccabb'); 
    return (

            <Row className='mb-2'>

            {availableReachesList && availableReachesList.map((availableReach, index) => (
                <Row key={index} className='mb-2'>
                    <Col sm={2} >
                        <Button 
                            variant="links" 
                            size="sm"
                            onClick={(e) => zoomToReach(availableReach)}
                        >
                            {availableReach['COMID']}
                        </Button>                        
                    </Col>
                    <Col sm={2} >
                        {availableReach['GNIS_NAME'] !== " " ? availableReach['GNIS_NAME'] : "-" }
                    </Col>


                    <Col sm={2} >
                    <Sparklines data={availableReach['assim'] } >
                        <SparklinesBars style={{ fill: chroma('#F26419').brighten(1) , fillOpacity: "0.75" }} />
                        <SparklinesLine style={{ stroke: chroma('#F26419').darken(1) , fill: "none" }} />
                    </Sparklines>

                    </Col>

                    <Col sm={2} >
                        <Sparklines data={sampleData}>
                            <SparklinesLine color="#AF2BBF" />
                        </Sparklines>
                    </Col>

                    <Col sm={2} >
                    <Sparklines data={availableReach['long_forecast'] } >
                        <SparklinesBars style={{ fill: chroma('#AF2BBF').brighten(1) , fillOpacity: "0.75" }} />
                        <SparklinesLine style={{ stroke: chroma('#AF2BBF').darken(1) , fill: "none" }} />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#AF2BBF" />
                    </Sparklines>

                    </Col>
                    {/* <Col sm={2} >
                        <Button 
                            variant="primary" 
                            className="text-white"
                            size="sm"
                            onClick={(e) => openPlot(availableReach)}
                        >
                            <GoGraph/>
                        </Button>
                    </Col> */}
                </Row>
            ))}
            </Row>

    );

  }