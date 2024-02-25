import React, { useState,useEffect  } from "react";
import { FormGroup, Label } from "components/UI/StyleComponents/Form.styled";
import appAPI from "services/api/app";

import { Controller } from 'react-hook-form';
import { Input } from "components/UI/StyleComponents/Input.styled";


const RegionFormFromReachList = (
    { 
        isVisible,
        control
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

    // const onChangeColumnName = async (e) =>{
    //     // console.log(e)
    //     setColumnName(e);
    //     setFormRegionData({...formRegionData, column_name: e})
    // }

    // const previewFileData = async (e) =>{
    //   console.log(e)
    //   e.preventDefault();
    //   setPreviewFile(null);

    //   setLoadingText(`Getting Columns from File ...`);
      
    //   const dataRequest = new FormData();
    //   handleShowLoading();
    //   Array.from(e.target.files).forEach(file=>{
    //     dataRequest.append('files', file);
    //   });
      
    //   let reponse_obj = await appAPI.previewUserColumnsFromFile(dataRequest).catch((error) => {
    //     handleHideLoading();
    //     setShowColumnNames(false);

    //   });
    //   setcolumnNames(reponse_obj['columns'])
    //   handleHideLoading();
    //   setShowColumnNames(true);
    //   setFormRegionData({...formRegionData, files: e.target.files, column_name: e})
    // }

  
    useEffect(() => {
    //   console.log(formRegionData)
    
      return () => {
      }
    }, [formRegionData])
    

    return(
        isVisible ? 
        <FormGroup>
            <Label htmlFor="formFileMultiple">Upload File (*.csv, *.xlsx)</Label>
            <Controller
                name="formFileMultiple"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value, ref } }) => (
                    <Input
                        size="sm"
                        type="file"
                        multiple
                        onChange={(e) => {
                        // Create a new array with the current files
                        // This step is necessary to properly trigger re-render
                        onChange([...e.target.files]);
                        }}
                        ref={ref}
                    />
                    )}
                rules={{ required: 'Files are required' }}
            />
        </FormGroup>
        : <></>
    );
  };
  
export { RegionFormFromReachList };
//   const saveRegionsUser = async (e) => {
//     //validation for empty form
//     setPreviewFile(null)
//     e.preventDefault();
//     let msge = validateRegionAddition();
//     console.log(msge);
//     if(msge != 'success'){
//       notifyError(msge);
//       return
//     }
//     setLoadingText(`Saving Region ${formRegionData.name} ...`);
//     handleShowLoading();

//     const dataRequest = new FormData();
//     dataRequest.append('name', formRegionData.name);
//     dataRequest.append('column_name', formRegionData.column_name);
    
//     Array.from(formRegionData.files).forEach(file=>{
//       dataRequest.append('files', file);
//     });
    
//     let responseRegions = await appAPI.saveUserRegionsFromReaches(dataRequest);
//     console.log("save region reach")
//     console.log(responseRegions)
//     if(responseRegions['msge'] === 'Error saving the Regions for current user'){
//       notifyError(responseRegions['msge']);
//     }
//     else{
//       setAvailableRegions(currentRegions => [...currentRegions, responseRegions['regions'][0]]);
//     }

//     setSelectedRegions({type:"reset", region: {}});
//     setFormRegionData({
//       name:'',
//       files:[],
//     })
//     handleHideLoading();

//   }



//   <Form.Group controlId="formFileMultiple" className="mb-3">
//   <Form.Label>Upload File (*.csv, *.xlsx) </Form.Label>
//   <Form.Control 
//     type="file"  
//     size="sm" 
//     onChange={(e) => previewFileData(e)}
//     />
// </Form.Group>
// {
//   showColumnNames && 
//       <Form.Group className="mb-3" controlId="formColumnsFile">
//           <p>
//              Choose Column from file
//           </p>
//           <ToggleButtonGroup 
//               vertical
//               className='w-100'
//               size="sm"
//               value={columnName}
//               name="column name"
//               onChange={(e) =>  onChangeColumnName(e) }
//           >
//               {columnNames.map((radio, index) => (
//                   <ToggleButton
//                   key={index}
//                   id={`radio-layer-${index}`}
//                   variant="outline-light"
//                   value={radio}
//                   >
//                   {radio}
//                   </ToggleButton>
//               ))}
//           </ToggleButtonGroup>
      
//   }     