import React, { useState,useEffect  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin as Hamburger } from 'hamburger-react'

import { Button,ToggleButton,ToggleButtonGroup,Form } from "react-bootstrap";
import appAPI from "services/api/app";
import { BiSolidSave } from "react-icons/bi"

import toast, { Toaster } from 'react-hot-toast';
import { SmallMenu } from "components/styles/SmallMenu.styled";


export const SideMenuWrapper = (
    { 
        showRegionsMenu,
        toggleAddRegionMenu,
        setShowRegionsVisible,
        selectedRegions,
        setAvailableRegions,
        setSelectedRegions,
        handleShowLoading,
        handleHideLoading,
        setLoadingText,
        setPreviewFile
    }) => {

    const initialGeopackageLayersNames = ['layer1','layer2']; 
    const [geopackageLayersNames, setGeopackageLayersNames ] = useState(initialGeopackageLayersNames)
    const [geopackageLayersName, setGeopackageLayersName ] = useState('layer1')
    const checkFileTypeForPreview = (fileName) =>{
      let file_type = "shapefile"
      if (fileName.endsWith(".shp")) {
        file_type = "shapefile"
      }
      if(fileName.endsWith(".gpkg")){
        file_type = "geopackage"
      }
      if(fileName.endsWith(".geojson")){
        file_type = "geojson"
      }
      return file_type
    }

    const previewFileDataOnChangeGeopackageLayer = async (e) =>{
      console.log(e)
      setGeopackageLayersName(e)
      // e.preventDefault();
      setPreviewFile(null);

      setLoadingText(`Previewing Layer ${ e} ...`);
      const dataRequest = new FormData();
      dataRequest.append('layers_geopackage', e);

      handleShowLoading();

      Array.from(formRegionData.files).forEach(file=>{
        dataRequest.append('files', file);
      });

      let responseRegions = await appAPI.previewUserRegionFromFile(dataRequest).catch((error) => {
        handleHideLoading();
      });
      let responseRegions_obj = JSON.parse(responseRegions['geom'])
      setPreviewFile(responseRegions_obj)
      setFormRegionData({...formRegionData, geopackage_layer: e})

      console.log(responseRegions_obj)
      handleHideLoading();
    }

    const previewFileData = async (e) =>{
      console.log(e)
      e.preventDefault();
      setPreviewFile(null);

      setLoadingText(`Previewing Region File ...`);
      
      // setFormRegionData({...formRegionData, files: e.target.files});
      const dataRequest = new FormData();
      handleShowLoading();
      let fileType = 'shapefile'
      Array.from(e.target.files).forEach(file=>{
        fileType = checkFileTypeForPreview(file.name)
        dataRequest.append('files', file);
      });
      if(fileType === 'geopackage' ){
        let responseGeopackageLayers = await appAPI.getGeopackageLayersFromFile(dataRequest).catch((error) => {
          handleHideLoading();
          setShowGeopackageLayersNames(false);
          setGeopackageLayersNames(initialGeopackageLayersNames);

        });
        setShowGeopackageLayersNames(true);
        setGeopackageLayersNames(responseGeopackageLayers['layers']);
        setFormRegionData({...formRegionData, files: e.target.files, geopackage_layer: responseGeopackageLayers['layers'][0]})
        dataRequest.append('layers_geopackage', responseGeopackageLayers['layers'][0]);
      }
      else{
        setFormRegionData({...formRegionData, files: e.target.files})

      }
      let responseRegions = await appAPI.previewUserRegionFromFile(dataRequest).catch((error) => {
        handleHideLoading();
      });
      let responseRegions_obj = JSON.parse(responseRegions['geom'])
      setPreviewFile(responseRegions_obj)
      console.log(responseRegions_obj)
      handleHideLoading();
    }
    const notifyError = (content) => {
      if (content != 'success'){
        toast.error(content);
      }
    }
  
    const [regionTypeRadioButton, setRegionTypeRadioButton] = useState( 'file');

    const [showGeopackageLayersNames, setShowGeopackageLayersNames ] = useState(false)
    
    const [isFileUploadVisible, setFileUploadVisible]= useState(true);
    const [formRegionData, setFormRegionData] = useState({
      name:'',
      regionType:'file',
      default: false,
      files:[],
      layer_color:'#563d7c',
      geopackage_layer: ''
    })
    const handleFileTypeOnChangeEvent = (e) =>{
      setRegionTypeRadioButton(e)
      console.log(e)
      if(e == 'file'){
        setFileUploadVisible(true);
        setShowRegionsVisible(false);
      }
      else{
        setShowRegionsVisible(true);
        setFileUploadVisible(false);
      }
      setFormRegionData({...formRegionData, regionType: e});
    }

    const saveRegionsUser = async (e) => {
      //validation for empty form
      setPreviewFile(null)
      e.preventDefault();
      let msge = validateRegionAddition();
      console.log(msge);
      if(msge != 'success'){
        notifyError(msge);
        return
      }
      setLoadingText(`Saving Region ${formRegionData.name} ...`);
      handleShowLoading();
      console.log(selectedRegions);
      let finalGeoJSON = makeGeoJSONFromArray();
      console.log(finalGeoJSON);
      // make extra params for identify query

      const dataRequest = new FormData();
      dataRequest.append('name', formRegionData.name);
      dataRequest.append('regionType', formRegionData.regionType);
      dataRequest.append('default', formRegionData.default);
      dataRequest.append('layer_color', formRegionData.layer_color);
      dataRequest.append('region_data', JSON.stringify(finalGeoJSON));
      Array.from(formRegionData.files).forEach(file=>{
        dataRequest.append('files', file);
      });
      
      dataRequest.append('layers_geopackage',formRegionData.geopackage_layer);




      let responseRegions = await appAPI.saveUserRegions(dataRequest);

      console.log(responseRegions)
      if(responseRegions['msge'] === 'Error saving the Regions for current user'){
        notifyError(responseRegions['msge']);
      }
      else{
        setAvailableRegions(currentRegions => [...currentRegions, responseRegions['regions'][0]]);
      }

      setSelectedRegions({type:"reset", region: {}});
      setFormRegionData({
        name:'',
        regionType:'file',
        default: false,
        files:[],
        layer_color:'#563d7c',
        geopackage_layer: ''
      })
      handleHideLoading();

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
      let finalGeoJSON = {}
      if(selectedRegions.length < 1){
        return finalGeoJSON
      }
      else{
          finalGeoJSON = selectedRegions[0]['data'];
        for (let i = 1; i < selectedRegions.length; i++) {
          finalGeoJSON = concatGeoJSON(finalGeoJSON, selectedRegions[i]['data']);
        }
      }
        return finalGeoJSON;
    }
  
    useEffect(() => {
      console.log(formRegionData)
    
      return () => {
      }
    }, [formRegionData])
    

    return(
      
        <SmallMenu isVisible={showRegionsMenu} position={"top"} >
          <Toaster  position="bottom-center" />

          <div className="wrapper_absolute">
           <div className="Myhamburguer">
            <Hamburger toggled={showRegionsMenu} toggle={toggleAddRegionMenu} size={20} />
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
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="inputRegionColorLayer">Layer Color</Form.Label>
                  <Form.Control
                    type="color"
                    id="inputRegionColorLayer"
                    defaultValue={formRegionData.layer_color}
                    title="Choose your color"
                    onChange={(e) => setFormRegionData({...formRegionData, layer_color: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRegionType">
                  <p>
                    Region Type
                  </p>
                  <ToggleButtonGroup 
                    size="sm"
                    value={regionTypeRadioButton}
                    name="region type"
                    onChange={(e) => handleFileTypeOnChangeEvent(e)}
                  >
                      <ToggleButton 
                        id="tbg-btn-1" 
                        value={'file'}
                        variant="outline-light"
                      >
                        File Region
                      </ToggleButton>
                      <ToggleButton 
                        id="tbg-btn-2" 
                        value={'huc'}
                        variant="outline-light"
                      >
                        Huc Region
                      </ToggleButton>

                  </ToggleButtonGroup>

                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegionDefaults">
                  <Form.Check // prettier-ignore
                    type="switch"
                    label="Default Region"
                    id="disabled-custom-switch"
                    value={formRegionData.default}
                    onChange={(e) => setFormRegionData({...formRegionData, default: e.target.checked}) }
                  />
                </Form.Group>
                {
                  isFileUploadVisible && 
                  <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Upload File (*.shp, *.json, geopackage) </Form.Label>
                    <Form.Control 
                      type="file"  
                      size="sm" 
                      multiple 
                      onChange={(e) => previewFileData(e)}
                      />
                  </Form.Group>
                }
                {
                  showGeopackageLayersNames && 
                  <Form.Group className="mb-3" controlId="formLayersGeopackage">
                  <p>
                    GeoPackages Layers
                  </p>
                  <ToggleButtonGroup 
                    vertical
                    className='w-100'
                    size="sm"
                    value={geopackageLayersName}
                    name="layers region"
                    onChange={(e) =>  previewFileDataOnChangeGeopackageLayer(e) }
                  >
                    {geopackageLayersNames.map((radio, index) => (
                        <ToggleButton
                          key={index}
                          id={`radio-layer-${index}`}
                          variant="outline-light"
                          value={radio}
                        >
                          {radio}
                        </ToggleButton>
                      ))}
                  </ToggleButtonGroup>
                  
                </Form.Group>
                }



                <div className="buttons-menu">
                  <Button variant="secondary"  type="submit" ><BiSolidSave /></Button>
                </div>
              </Form>
            }
  
  
          </div>        
  
        </SmallMenu>
  
  
    );
  };
  
