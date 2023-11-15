

import { Button,Col, Row } from 'react-bootstrap';
import { GoGraph } from "react-icons/go";
import { Sparklines, SparklinesLine } from '@jrwats/react-sparklines';



export const RegionsRows = ({
    availableReachesList,
    setCurrentStationID,
    setCurrentStation,
    setCurrentProducts,
    handleShow,
    setMetadata,
    socketRef,
    setCurrentReachGeometry

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

      const sampleData = [5, 10, 5, 20, 8, 15]; 
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
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#FFFC31" />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#F26419" />
                    </Sparklines>


                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#DD1C1A" />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                    <Sparklines data={sampleData}>
                        <SparklinesLine color="#AF2BBF" />
                    </Sparklines>

                    </Col>
                    <Col sm={2} >
                        <Button 
                            variant="primary" 
                            className="text-white"
                            size="sm"
                            onClick={(e) => openPlot(availableReach)}
                        >
                            <GoGraph/>
                        </Button>
                    </Col>
                </Row>
            ))}
            </Row>

    );

  }