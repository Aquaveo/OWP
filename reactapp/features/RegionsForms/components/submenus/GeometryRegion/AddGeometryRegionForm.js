import React, { useState,useEffect,Fragment  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Controller } from 'react-hook-form';
import Select from "react-select";
import {handleFileTypeOnChangeEvent} from 'features/RegionsForms/lib/fileUtils';
import { useMapContext } from "features/Map/hooks/useMapContext";
import { GeometryFileInput } from "./GeometryFileInput";



const geometryRegionFormTypes = [
    { value: 'file', label: 'File' },
    { value: 'huc', label: 'Huc' },
]


const RegionFormFromGeometry = (
    { 
        isVisible,control
    }) => {
    const [geometryLayerRegion, setGeometryLayerRegion] = useState(null);
    const [isFileInputVisible, setIsFileInputVisible] = useState(false);
    const {actions} = useMapContext();
 
    useEffect(() => {
        console.log(geometryLayerRegion);
        if (!geometryLayerRegion) return;
        actions.addLayer(geometryLayerRegion);
    }
    , [geometryLayerRegion]);

    return(
        isVisible ?
            <Fragment>
              <FormGroup>
                  <Fragment>
                    <Label>Geometry Type</Label>
                    <Controller
                      name="hydrosharePublicRegions"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={geometryRegionFormTypes}
                          onChange={(selectedOption) => {
                            console.log(selectedOption);
                            //Delete current layer
                            if (geometryLayerRegion){
                              actions.removeLayer(geometryLayerRegion);
                            };
                            //Generate new layer
                            const newLayer = handleFileTypeOnChangeEvent(selectedOption);
                            //check if it is empty or not, if it is file it will be empty
                            if (Object.keys(newLayer).length > 0){
                              setGeometryLayerRegion(newLayer)
                              setIsFileInputVisible(false)
                            }
                            else{
                              setGeometryLayerRegion(null)
                              setIsFileInputVisible(true)
                            }
                            field.onChange(selectedOption); // Notify react-hook-form of the change
                          }}
                        />
                      )}
                      rules={{ required: 'Please select a region type' }}
                    />
                  </Fragment>
              </FormGroup>
              <GeometryFileInput isVisible={isFileInputVisible} control={control} />              
            </Fragment>
        : <></>
     

  
    );
  };
export { RegionFormFromGeometry }
