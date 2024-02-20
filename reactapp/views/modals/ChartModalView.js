import Modal from "components/UI/Modal/Modal";
import Chart from '../../features/NwpProducts/components/Chart';
import { Tab, Tabs } from "components/UI/Tabs/Tabs"
import { ButtonGroup, ToggleButton } from "components/UI/Buttons/Buttons"
import './Productbuttons.css'



const ChartModalView = ({
  modal, 
  setModal, 
  data,
  onChange 
}) => {
  const Toggle = () => setModal(!modal);

  return (
    <Modal show={modal} close={Toggle} title="Dynamic Title">
      <Tabs defaultActiveKey="forecast-tab">
            <Tab eventKey="forecast-tab" title="Forecast">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">

                          {Object.keys(data).map((key) => { // Use map instead of forEach
                              const item = data[key];
                              return (
                              <ButtonGroup key={key} className="mb-2"> {/* Ensure to add a unique `key` prop when rendering lists */}
                                  <ToggleButton
                                      id={`toggle-check-${key}`}
                                      checked={item.is_requested}
                                      value={item.name_product}
                                      onChange={onChange}
                                  >
                                  <span>{item.name_product}</span>
                                  </ToggleButton>
                              </ButtonGroup>
                              );
                          })}

                        </div>
                    </div>
                </div>
            </Tab>
        </Tabs>
        <Chart data={data} />
    </Modal>

  )
}

export default ChartModalView;