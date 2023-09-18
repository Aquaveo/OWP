import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin as Hamburger } from 'hamburger-react'
import { SideMenu } from "components/styles/SideMenu.styled";
import { Button } from "react-bootstrap";
import appAPI from "services/api/app";
export const SideMenuWrapper = (
    { 
        showRegions,
        setShowRegionsVisible,
        selectedRegions
    }) => {
    const saveRegionsUser = () => {
        console.log(selectedRegions)
        // let dataRequest = {
        //     region_data: data,
        // }
        // appAPI.saveUserRegions(dataRequest);
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
  
