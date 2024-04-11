import { StyledButton, StyledCol, StyledRow } from "components/UI/StyleComponents/Table";
import { Sparklines, SparklinesBars, SparklinesLine } from '@jrwats/react-sparklines';
import chroma from 'chroma-js';
import { TableContainer,StickyHeader } from "components/UI/StyleComponents/Table";
import { useWebSocketContext } from 'features/WebSocket/hooks/useWebSocketContext';
const RegionsTable = ({availableReachesList}) => {
    const {state:webSocketState ,actions: websocketActions} = useWebSocketContext();
    const zoomToReach = (availableReach) =>{
        //console.log(availableReach);
        
        webSocketState.client.send(
          JSON.stringify({
            type: "get_specific_reach",
            reach_comid: availableReach['COMID'],
          })
        );
    }

    return (
        <TableContainer>
            <StickyHeader>
                <StyledRow>
                    <StyledCol sm={4}>
                        <p>Reach ID</p>
                    </StyledCol>
                    <StyledCol sm={4}>
                        <p>Reach Name</p>
                    </StyledCol>
                    {/* <StyledCol sm={3}>
                        <p>A.A.</p>
                    </StyledCol>                 */}
                    <StyledCol sm={4}>
                        <p>Mean Long Range Forecast</p>
                    </StyledCol>
                </StyledRow>
            </StickyHeader>
            {availableReachesList &&
            availableReachesList.map((availableReach, index) => (
              <StyledRow key={index}>
                <StyledCol sm={4}>
                  <StyledButton onClick={(e) => zoomToReach(availableReach)}>
                    {availableReach['COMID']}
                  </StyledButton>
                </StyledCol>
                <StyledCol sm={4}>
                    <p>
                        {availableReach['GNIS_NAME'] !== ' ' ? availableReach['GNIS_NAME'] : '-'}
                    </p>
                </StyledCol>
                {/* <StyledCol sm={3}>
                  {availableReach['assim'].length > 0 
                  ?
                  <Sparklines data={availableReach['assim']}>
                    <SparklinesBars style={{ fill: chroma('#268e89').brighten(1), fillOpacity: '0.75' }} />
                    <SparklinesLine style={{ stroke: chroma('#268e89').darken(1), fill: 'none' }} />
                  </Sparklines>
                  : '-'
                  } 
                </StyledCol> */}
                <StyledCol sm={4}>
                  {
                    availableReach['long_forecast'].length > 0 ?
                    <Sparklines data={availableReach['long_forecast']}>
                      <SparklinesBars style={{ fill: chroma('#AF2BBF').brighten(1), fillOpacity: '0.75' }} />
                      <SparklinesLine style={{ stroke: chroma('#AF2BBF').darken(1), fill: 'none' }} />
                    </Sparklines>
                    : '-'
                  }

                </StyledCol>
              </StyledRow>
            ))}
        </TableContainer>

      );

}

export {RegionsTable}