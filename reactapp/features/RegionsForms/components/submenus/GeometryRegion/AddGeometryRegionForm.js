import React, { useState,useEffect,Fragment  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import { Controller } from 'react-hook-form';
import Select from "react-select";
import {handleFileTypeOnChangeEvent} from 'features/RegionsForms/lib/fileUtils';
// import { useLayer } from "features/Map/hooks/useManageLayers";
import { useMapContext } from "features/Map/hooks/useMapContext";

const geometryRegionFormTypes = [
    { value: 'file', label: 'File' },
    { value: 'huc', label: 'Huc' },
]


const RegionFormFromGeometry = (
    { 
        isVisible,control
    }) => {
    const [geometryLayerRegion, setGeometryLayerRegion] = useState(null);
    const {state, actions} = useMapContext();
 
    useEffect(() => {
        if (!geometryLayerRegion) return;
        actions.addLayer(geometryLayerRegion);
    }
    , [geometryLayerRegion]);

    return(
        isVisible ?
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
                          const newLayer = handleFileTypeOnChangeEvent(selectedOption);
                          setGeometryLayerRegion(newLayer)
                          field.onChange(selectedOption); // Notify react-hook-form of the change
                        }}
                      />
                    )}
                    rules={{ required: 'Please select a region type' }}
                  />

                </Fragment>

            </FormGroup>
        : <></>
     

  
    );
  };
export { RegionFormFromGeometry }
