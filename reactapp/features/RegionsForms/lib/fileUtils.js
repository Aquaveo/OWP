import appAPI from "services/api/app";
import reset from "react-hook-form";
import { onClickHucRegion } from "lib/mapEvents";
const previewCSVFileData = async (e) =>{
    // console.log(e)
    
    const dataRequest = new FormData();
    Array.from(e.target.files).forEach(file=>{
      dataRequest.append('files', file);
    });
    
    let reponse_obj = await appAPI.previewUserColumnsFromFile(dataRequest).catch((error) => {});
    
    return reponse_obj.columns
}

const previewFileDataOnChangeGeopackageLayer = async (e) =>{
  console.log(e)

  const dataRequest = new FormData();
  dataRequest.append('layers_geopackage', e);

  Array.from(formRegionData.files).forEach(file=>{
    dataRequest.append('files', file);
  });

  let responseRegions = await appAPI.previewUserRegionFromFile(dataRequest).catch((error) => {console.log(error)});
  let responseRegions_obj = JSON.parse(responseRegions['geom'])
  return responseRegions_obj
}


const concatGeoJSON = (g1, g2) => {
  return { 
      "type" : "FeatureCollection",
      "features": [... g1.features, ... g2.features]
  }
}

const makeGeoJSONFromArray = (selectedRegions) =>{
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


const previewGeometryFileData = async (e) =>{
  console.log(e)

  
  let fileType = 'shapefile'
  Array.from(e.target.files).forEach(file=>{
    fileType = checkFileTypeForPreview(file.name)
    dataRequest.append('files', file);
  });

  if(fileType === 'geopackage' ){
    let responseGeopackageLayers = await appAPI.getGeopackageLayersFromFile(dataRequest).catch((error) => {console.log(error)});
    dataRequest.append('layers_geopackage', responseGeopackageLayers['layers'][0]);
  }

  let responseRegions = await appAPI.previewUserRegionFromFile(dataRequest).catch((error) => {console.log(error)});
  let responseRegions_obj = JSON.parse(responseRegions['geom'])
  return responseRegions_obj
}


const handleFileTypeOnChangeEvent = (e) =>{
  const WbdMapLayerURL = 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer'
  const stationsLayerURL = 'https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/references_layers/USGS_Stream_Gauges/MapServer';
  switch (e.value) {
      case "huc":
        const layerHUC =

          {
              layerType: 'OlImageTileLayer',
              options: {
                sourceType: 'TileImageArcGISRest',
                url: WbdMapLayerURL,
                // all the params for the source goes here
                params: {
                  LAYERS:"show:1,2,3,4,5,6,7,8"
                },
                // the rest of the attributes are for the definition of the layer
                zIndex: 2,
                name: "huc_levels"
              },
              extraProperties: {
                  events: [{'type': 'click', 'handler': (layer,event)=>{
                    onClickHucRegion(
                      layer,
                      event,
                    )
                  }}],
                  priority: 2     
              }
          }
        return layerHUC
      case 'file':
        const layerFile = {}
        return layerFile
  }
  


  // if(e == 'file'){

  // }
  // else{
 
  // }
}




// const handleAllFormSubmit = (data,onSubmit) => {
//   onSubmit(data); // Call the onSubmit prop with form data
//   reset(); // Reset form after submission
// };


// const saveRegionsUser = async (e) => {
//   //validation for empty form

//   const dataRequest = new FormData();
//   dataRequest.append('name', formRegionData.name);
//   dataRequest.append('column_name', formRegionData.column_name);
  
//   Array.from(formRegionData.files).forEach(file=>{
//     dataRequest.append('files', file);
//   });
  
//   let responseRegions = await appAPI.saveUserRegionsFromReaches(dataRequest);
//   console.log("save region reach")
//   console.log(responseRegions)
//   if(responseRegions['msge'] === 'Error saving the Regions for current user'){
//     notifyError(responseRegions['msge']);
//   }
//   else{
//     setAvailableRegions(currentRegions => [...currentRegions, responseRegions['regions'][0]]);
//   }

//   setSelectedRegions({type:"reset", region: {}});
//   setFormRegionData({
//     name:'',
//     files:[],
//   })
//   handleHideLoading();

// }

// const onSubmit = async (data) => {
//   console.log(data); // Use the data as needed, like sending it to an API endpoint
//   let responseRegions = await appAPI.saveUserRegionsFromHydroShareResource(data);
//   console.log(responseRegions)
//   if(responseRegions['msge'] === 'Error saving the Regions for current user'){
//     let custom_message=<CustomNotification> 
//       <div className='container-row-notification'>
//         <div>
//             <MdError />
//         </div>
//         <div>
//             <em>{responseRegions['msge']}</em>

//         </div>
//       </div>
//       </CustomNotification>
//     showToast('custom',custom_message)
//   }
//   else{
//     setLoadingText(`Region ${data['regionName']} saved`);
//     setAvailableRegions(currentRegions => [...currentRegions, responseRegions['regions'][0]]);
//   }
//   setSelectedRegions({type:"reset", region: {}});
//   handleHideLoading();
// };

export { 
  previewCSVFileData,
  previewFileDataOnChangeGeopackageLayer,
  previewGeometryFileData,
  makeGeoJSONFromArray,
  concatGeoJSON,
  handleFileTypeOnChangeEvent
}