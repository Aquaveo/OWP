import React, { useState,useEffect  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin as Hamburger } from 'hamburger-react'
import { SideMenu } from "components/styles/SideMenu.styled";
import { Button } from "react-bootstrap";
import appAPI from "services/api/app";
export const SideMenuWrapper = (
    { 
        showRegions,
        setShowRegionsVisible,
        selectedRegions,
        setAvailableRegions,
        availableRegions
    }) => {
    const saveRegionsUser = async () => {
        console.log(selectedRegions);
        let finalGeoJSON = makeGeoJSONFromArray();
        console.log(finalGeoJSON);


        //merge geojsons
        let dataRequest = {
            region_data: finalGeoJSON
        }

        let responseRegions = await appAPI.saveUserRegions(dataRequest);
        console.log(responseRegions)
        setAvailableRegions([])
    }
    const concatGeoJSON = (g1, g2) => {
        return { 
            "type" : "FeatureCollection",
            "features": [... g1.features, ... g2.features]
        }
    }

    const makeGeoJSONFromArray = () =>{
        let finalGeoJSON = selectedRegions[0]['data'];

        for (let i = 1; i < selectedRegions.length; i++) {
            finalGeoJSON = concatGeoJSON(finalGeoJSON, selectedRegions[i]['data']);
        }
      
        return finalGeoJSON;
    }
  

    


    return(
      
        <SideMenu isVisible={showRegions} >
          <div className="wrapper_absolute">
           <div className="Myhamburguer">
            <Hamburger toggled={showRegions} toggle={setShowRegionsVisible} size={20} />
          </div>
            {
              showRegions && 
              <div>
                <p className="sudo_title">
                    HUCS Regions
                </p>
                <Button variant="primary" onClick={saveRegionsUser}>Save Regions</Button>
              </div>
            }
  
  
          </div>        
  
        </SideMenu>
  
  
    );
  };
  
