import { StyledButton, StyledCol, StyledRow } from "components/UI/StyleComponents/Table";
import { Sparklines, SparklinesBars, SparklinesLine } from '@jrwats/react-sparklines';
import chroma from 'chroma-js';
import { TableContainer,StickyHeader } from "components/UI/StyleComponents/Table";

const RegionsTable = ({availableReachesList}) => {
    const zoomToReach = (availableReach) =>{
        console.log(availableReach);
    }

    return (
        <TableContainer>
            <StickyHeader>
                <StyledRow>
                    <StyledCol sm={2}>
                        <p>Reach ID</p>
                    </StyledCol>
                    <StyledCol sm={2}>
                        <p>Reach Name</p>
                    </StyledCol>
                    <StyledCol sm={2}>
                        <p>A.A.</p>
                    </StyledCol>                
                    <StyledCol sm={2}>
                        <p>L.F.</p>
                    </StyledCol>
                    <StyledCol sm={2}>
                        <p>M.F.</p>
                    </StyledCol>
                    <StyledCol sm={2}>
                        <p>S.F.</p>
                    </StyledCol>
                </StyledRow>
            </StickyHeader>
            {availableReachesList &&
            availableReachesList.map((availableReach, index) => (
              <StyledRow key={index}>
                <StyledCol sm={3}>
                  <StyledButton onClick={(e) => zoomToReach(availableReach)}>
                    {availableReach['COMID']}
                  </StyledButton>
                </StyledCol>
                <StyledCol sm={3}>
                    <p>
                        {availableReach['GNIS_NAME'] !== ' ' ? availableReach['GNIS_NAME'] : '-'}
                    </p>
                </StyledCol>
                <StyledCol sm={3}>
                  <Sparklines data={availableReach['assim']}>
                    <SparklinesBars style={{ fill: chroma('#268e89').brighten(1), fillOpacity: '0.75' }} />
                    <SparklinesLine style={{ stroke: chroma('#268e89').darken(1), fill: 'none' }} />
                  </Sparklines>
                </StyledCol>
                <StyledCol sm={3}>
                  <Sparklines data={availableReach['long_forecast']}>
                    <SparklinesBars style={{ fill: chroma('#AF2BBF').brighten(1), fillOpacity: '0.75' }} />
                    <SparklinesLine style={{ stroke: chroma('#AF2BBF').darken(1), fill: 'none' }} />
                  </Sparklines>
                </StyledCol>
                {/* <StyledCol sm={2}>
                  <Sparklines data={availableReach['long_forecast']}>
                    <SparklinesBars style={{ fill: chroma('#AF2BBF').brighten(1), fillOpacity: '0.75' }} />
                    <SparklinesLine style={{ stroke: chroma('#AF2BBF').darken(1), fill: 'none' }} />
                  </Sparklines>
                </StyledCol>
                <StyledCol sm={2}>
                  <Sparklines data={availableReach['long_forecast']}>
                    <SparklinesBars style={{ fill: chroma('#AF2BBF').brighten(1), fillOpacity: '0.75' }} />
                    <SparklinesLine style={{ stroke: chroma('#AF2BBF').darken(1), fill: 'none' }} />
                  </Sparklines>
                </StyledCol>                 */}
              </StyledRow>
            ))}
        </TableContainer>

      );

}

export {RegionsTable}