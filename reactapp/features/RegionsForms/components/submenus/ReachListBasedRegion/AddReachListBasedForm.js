import React, { useState, Fragment,useEffect  } from "react";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
// import appAPI from "services/api/app";

import { Controller } from 'react-hook-form';
import { Input } from "components/UI/StyleComponents/Input.styled";
import {previewCSVFileData} from 'features/RegionsForms/lib/fileUtils'; 

import { SelectColumnFile } from "./SelectColumnFile";
import { LoadingText } from "components/UI/StyleComponents/Loader.styled";


const RegionFormFromReachList = (
    { 
        isVisible,
        control
    }) => {
    const [columnsFile, setColumnsFile] = useState([]);    
    return(
        isVisible 
            ? 
                <Fragment>
                <FormGroup>
                    <Label>Upload File (*.csv, *.xlsx)</Label>
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
                                    let columns = await previewCSVFileData(e);
                                    setColumnsFile(columns.map(column => ({ value: column, label: column })));
                                    // IMPORTANT: Update the form state by calling onChange provided by React Hook Form
                                    onChange([...e.target.files]); // Pass the files array to update the form state
                                }}
                                ref={ref}
                            />
                            )}
                        rules={{ required: 'Files are required' }}
                    />
                </FormGroup>
                <SelectColumnFile columnsFile={columnsFile} control={control} />
                </Fragment>
            : 
                <></>
    );
  };
  
export { RegionFormFromReachList };