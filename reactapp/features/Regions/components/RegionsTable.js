import { StyledButton, StyledCol, StyledRow } from "components/UI/StyleComponents/Table";
import { Sparklines, SparklinesBars, SparklinesLine } from '@jrwats/react-sparklines';
import chroma from 'chroma-js';
import { Container } from "components/UI/StyleComponents/ui";

const RegionsTable = ({availableReachesList}) => {
    const zoomToReach = (availableReach) =>{
        console.log(availableReach);
    }


    return (
        <Container>
            {availableReachesList &&
            availableReachesList.map((availableReach, index) => (
              <StyledRow key={index}>
                <StyledCol sm={4}>
                  <StyledButton onClick={(e) => zoomToReach(availableReach)}>
                    {availableReach['COMID']}
                  </StyledButton>
                </StyledCol>
                <StyledCol sm={4}>
                    <p >
                        {availableReach['GNIS_NAME'] !== ' ' ? availableReach['GNIS_NAME'] : '-'}
                    </p>
                </StyledCol>
    
                <StyledCol sm={4}>
                  <Sparklines data={availableReach['long_forecast']}>
                    <SparklinesBars style={{ fill: chroma('#AF2BBF').brighten(1), fillOpacity: '0.75' }} />
                    <SparklinesLine style={{ stroke: chroma('#AF2BBF').darken(1), fill: 'none' }} />
                  </Sparklines>
                </StyledCol>
              </StyledRow>
            ))}
        </Container>

      );

}

export {RegionsTable}