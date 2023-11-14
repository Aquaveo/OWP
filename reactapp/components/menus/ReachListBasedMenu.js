import React, { useState,useEffect  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin as Hamburger } from 'hamburger-react'

import { Button,ToggleButton,ToggleButtonGroup,Form } from "react-bootstrap";
import appAPI from "services/api/app";
import { BiSolidSave } from "react-icons/bi"

import toast, { Toaster } from 'react-hot-toast';
import { SmallMenu } from "components/styles/SmallMenu.styled";


export const ReachListMenu = (
    { 
        showReachesListMenu,
        toggleReachesListRegionMenu,
        setShowRegionsVisible,
        selectedRegions,
        setAvailableRegions,
        setSelectedRegions,
        handleShowLoading,
        handleHideLoading,
        setLoadingText,
        setPreviewFile
    }) => {

    const [formRegionData, setFormRegionData] = useState({
        name:'',
        column_name:'',
        files:[],
    })
    const [showColumnNames, setShowColumnNames ] = useState(false)
    const [columnName, setColumnName ] = useState('column1')

    const initialColumnNames = ['column1','column2']; 
    const [columnNames, setcolumnNames ] = useState(initialColumnNames)

    const onChangeColumnName = async (e) =>{
        console.log(e)
        setColumnName(e);
        setFormRegionData({...formRegionData, column_name: e})
    }

    const previewFileData = async (e) =>{
      console.log(e)
      e.preventDefault();
      setPreviewFile(null);

      setLoadingText(`Getting Columns from File ...`);
      
      const dataRequest = new FormData();
      handleShowLoading();
      Array.from(e.target.files).forEach(file=>{
        dataRequest.append('files', file);
      });
      
      let reponse_obj = await appAPI.previewUserColumnsFromFile(dataRequest).catch((error) => {
        handleHideLoading();
        setShowColumnNames(false);

      });
      setcolumnNames(reponse_obj['columns'])
      handleHideLoading();
      setShowColumnNames(true);
      setFormRegionData({...formRegionData, files: e.target.files, column_name: e})
    }
    const notifyError = (content) => {
      if (content != 'success'){
        toast.error(content);
      }
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

      const dataRequest = new FormData();
      dataRequest.append('name', formRegionData.name);
      dataRequest.append('column_name', formRegionData.column_name);
      
      Array.from(formRegionData.files).forEach(file=>{
        dataRequest.append('files', file);
      });
      
      let responseRegions = await appAPI.saveUserRegionsFromReaches(dataRequest);

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
        files:[],
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
      return msge
    }

  
    useEffect(() => {
      console.log(formRegionData)
    
      return () => {
      }
    }, [formRegionData])
    

    return(
      
        <SmallMenu isVisible={showReachesListMenu} position={"top"} >
          <Toaster  position="bottom-center" />

          <div className="wrapper_absolute">
           <div className="Myhamburguer">
            <Hamburger toggled={showReachesListMenu} toggle={toggleReachesListRegionMenu} size={20} />
          </div>
            {
              showReachesListMenu && 
              <Form onSubmit={saveRegionsUser} >
                <p className="sudo_title">
                    Create Region from Reaches
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

                  <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Upload File (*.csv, *.xlsx) </Form.Label>
                    <Form.Control 
                      type="file"  
                      size="sm" 
                      onChange={(e) => previewFileData(e)}
                      />
                  </Form.Group>
                  {
                    showColumnNames && 
                        <Form.Group className="mb-3" controlId="formColumnsFile">
                            <p>
                               Choose Column from file
                            </p>
                            <ToggleButtonGroup 
                                vertical
                                className='w-100'
                                size="sm"
                                value={columnName}
                                name="column name"
                                onChange={(e) =>  onChangeColumnName(e) }
                            >
                                {columnNames.map((radio, index) => (
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
  
