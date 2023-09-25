import React, { useState,useEffect  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin as Hamburger } from 'hamburger-react'
import { SideMenu } from "components/styles/SideMenu.styled";
import { Button } from "react-bootstrap";
import appAPI from "services/api/app";
import Form from 'react-bootstrap/Form';
import { BiSolidSave } from "react-icons/bi"
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

export const SideMenuWrapper = (
    { 
        setNavVisible,
        showRegionsMenu,
        handleShowRegionMenu,
        setShowRegionsVisible,
        selectedRegions,
        setAvailableRegions
    }) => {

    const regionTypeRadioButtons = [
        { name: "File Region", value: "file" },
        { name: "HUC Region", value: "huc" },
    ]; 
    
    const [isFileUploadVisible, setFileUploadVisible]= useState(true);
    const [formRegionData, setFormRegionData] = useState({
      name:'',
      regionType:'file',
      default: true,
      files:[]
    })
    const handleFileTypeOnChangeEvent = (e) =>{
      if(e.target.value == 'file'){
        setFileUploadVisible(true);
        setShowRegionsVisible(false);
      }
      else{
        setShowRegionsVisible(true);
        setFileUploadVisible(false);
      }
      setFormRegionData({...formRegionData, regionType: e.target.value})
    }

    const saveRegionsUser = async (e) => {
      //validation for empty form
      e.preventDefault()
      let msge = validateRegionAddition();
      console.log(msge);
      if(msge != 'success'){
        return
      }
      console.log(selectedRegions);
      let finalGeoJSON = makeGeoJSONFromArray();
      console.log(finalGeoJSON);

      //merge geojsons
      let dataRequest = {
          name: formRegionData.name,
          regionType: formRegionData.regionType,
          default: formRegionData.default,
          files: formRegionData.files,
          region_data: finalGeoJSON
      }

      let responseRegions = await appAPI.saveUserRegions(dataRequest);

      console.log(responseRegions)
      setAvailableRegions([])
      if (!responseRegions['msge'].includes('error')){
        setNavVisible(false);
      }
    }
    const validateRegionAddition = () =>{
      let msge = 'success'
      if(!formRegionData.name){
        msge='Region name was not set up'
      }
      if(formRegionData.regionType === 'file' && !formRegionData.files){
        msge='Files were not uploaded'
      }
      if(formRegionData.regionType ==='huc' && selectedRegions.length < 1){
        msge='Select HUCs regions from map'
      }
      return msge
    }


    const concatGeoJSON = (g1, g2) => {
        return { 
            "type" : "FeatureCollection",
            "features": [... g1.features, ... g2.features]
        }
    }

    const makeGeoJSONFromArray = () =>{
      if(selectedRegions.length < 1){
        return {}
      }
      else{
        let finalGeoJSON = selectedRegions[0]['data'];

        for (let i = 1; i < selectedRegions.length; i++) {
            finalGeoJSON = concatGeoJSON(finalGeoJSON, selectedRegions[i]['data']);
        }
      }

      
        return finalGeoJSON;
    }
  
    return(
      
        <SideMenu isVisible={showRegionsMenu} >
          <div className="wrapper_absolute">
           <div className="Myhamburguer">
            <Hamburger toggled={showRegionsMenu} toggle={handleShowRegionMenu} size={20} />
          </div>
            {
              showRegionsMenu && 
              <Form onSubmit={saveRegionsUser} >
                <p className="sudo_title">
                    Add Regions Menu
                </p>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="inputRegionName">Region Name</Form.Label>
                  <Form.Control 
                    size="sm" 
                    id="inputRegionName" 
                    type="text"
                    value={formRegionData.name}
                    placeholder="Region Name" 
                    onChange={(e) => setFormRegionData({...formRegionData, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegionType">
                  <p>
                    Region Type
                  </p>
                  <ButtonGroup size="sm">
                    {regionTypeRadioButtons.map((radio, index) => (
                        <ToggleButton
                          key={index}
                          id={`radio-${index}`}
                          variant="secondary"
                          type="radio"
                          name="region type"
                          value={radio.value}
                          checked={formRegionData.regionType === radio.value}
                          onChange={(e) => handleFileTypeOnChangeEvent(e)}
                        >
                          {radio.name}
                        </ToggleButton>
                      ))}
                  </ButtonGroup>

                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegionDefaults">
                  <Form.Check // prettier-ignore
                    type="switch"
                    label="Default Region"
                    id="disabled-custom-switch"
                    value={formRegionData.default}
                    onChange={(e) => setFormRegionData({...formRegionData, default: e.target.checked})}
                  />
                </Form.Group>
                {
                  isFileUploadVisible && 
                  <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Upload File (*.shp, *.json, geopackage) </Form.Label>
                    <Form.Control type="file"  size="sm" multiple />
                  </Form.Group>
                }

                <div className="buttons-menu">
                  <Button variant="secondary"  type="submit" ><BiSolidSave /></Button>
                </div>
              </Form>
            }
  
  
          </div>        
  
        </SideMenu>
  
  
    );
  };
  
