import React, { useState, Fragment,useEffect  } from "react";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";

import { Controller } from 'react-hook-form';
import { Input } from "components/UI/StyleComponents/Input.styled";
import {previewGeometryFileData} from 'features/RegionsForms/lib/fileUtils'; 


const GeometryFileInput = (
    { 
        isVisible,
        control
    }) => {
    const [geometryJSON, setGeometryJSON] = useState([]);    
    return(
        isVisible 
            ? 
                <Fragment>
                <FormGroup>
                    <Label>Upload File (*.shp, *.json, geopackage)</Label>
                    <Controller
                        name="files"
                        control={control}
                        defaultValue={[]}
                        render={({ field: { onChange, value, ref } }) => (
                            <Input
                                size="sm"
                                type="file"
                                multiple
                                onChange={async (e) => {
                                    // This step is necessary to properly trigger re-render
                                    let geometry = await previewGeometryFileData(e);
                                    setGeometryJSON(geometry);
                                    // IMPORTANT: Update the form state by calling onChange provided by React Hook Form
                                    onChange([...e.target.files]); // Pass the files array to update the form state
                                }}
                                ref={ref}
                            />
                            )}
                        rules={{ required: 'Files are required' }}
                    />
                </FormGroup>
                
                </Fragment>
            : 
                <></>
    );
  };
  
export { GeometryFileInput };