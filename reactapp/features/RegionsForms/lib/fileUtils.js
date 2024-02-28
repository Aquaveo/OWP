import appAPI from "services/api/app";
import { onClickHucRegion, onClickPreviewFile } from "lib/mapEvents";
import {Stroke, Style} from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON';

const previewCSVFileData = async (e) =>{
    console.log(e)
    
    const dataRequest = new FormData();
    Array.from(e.target.files).forEach(file=>{
      dataRequest.append('files', file);
    });
    
    let reponse_obj = await appAPI.previewUserColumnsFromFile(dataRequest).catch((error) => {});
    
    return reponse_obj.columns
}

const previewFileDataOnChangeGeopackageLayer = async (e,files) =>{
  console.log(e,files)

  const dataRequest = new FormData();
  dataRequest.append('layers_geopackage', e.value);

  Array.from(files).forEach(file=>{
    dataRequest.append('files', file);
  });

  let responseRegions = await appAPI.previewUserRegionFromFile(dataRequest).catch((error) => {console.log(error)});
  let responseRegions_obj = JSON.parse(responseRegions['geom'])
  const layerFile = {
    layerType: 'VectorLayer',
    options: {
      sourceType: 'VectorSourceLayer',
      // all the params for the source goes here
      params: {
        format: new GeoJSON(),
        features: new GeoJSON().readFeatures(responseRegions_obj)
      },
      // the rest of the attributes are for the definition of the layer
      zIndex: 2,
      name: "preview_file_region",
      style:
        new Style({
          stroke: new Stroke({
            color: 'green',
            width: 3,
          })
        })
      
    },
    extraProperties: {
        events: [{'type': 'click', 'handler': (layer,event)=>{
          onClickPreviewFile(
            layer,
            event,
          )
        }}],
        priority: 2
    }

  }

  return layerFile
}


const concatGeoJSON = (g1, g2) => {
  return { 
      "type" : "FeatureCollection",
      "features": [... g1.features, ... g2.features]
  }
}

const makeGeoJSONFromArray = (selectedRegions) =>{
  console.log(selectedRegions)
  let finalGeoJSON = {}
  if(selectedRegions.length < 1){
    return finalGeoJSON
  }
  else{
      finalGeoJSON = selectedRegions[0];
    for (let i = 1; i < selectedRegions.length; i++) {
      finalGeoJSON = concatGeoJSON(finalGeoJSON, selectedRegions[i]);
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
  const responseObject={};

  const dataRequest = new FormData();
  let fileType = 'shapefile'
  Array.from(e.target.files).forEach(file=>{
    fileType = checkFileTypeForPreview(file.name)
    dataRequest.append('files', file);
  });

  if(fileType === 'geopackage' ){
    let responseGeopackageLayers = await appAPI.getGeopackageLayersFromFile(dataRequest).catch((error) => { 
      console.log(error) 
      responseObject['geopackage_layers'] = null;
    });
    dataRequest.append('layers_geopackage', responseGeopackageLayers['layers'][0]);
    console.log(responseGeopackageLayers['layers'])
    responseObject['geopackage_layers'] = responseGeopackageLayers['layers'].map(column => ({ value: column, label: column }));
  }

  let responseRegions = await appAPI.previewUserRegionFromFile(dataRequest).catch((error) => {console.log(error)});
  let responseRegions_obj = JSON.parse(responseRegions['geom'])
  const layerFile = {
    layerType: 'VectorLayer',
    options: {
      sourceType: 'VectorSourceLayer',
      // all the params for the source goes here
      params: {
        format: new GeoJSON(),
        features: new GeoJSON().readFeatures(responseRegions_obj)
      },
      // the rest of the attributes are for the definition of the layer
      zIndex: 2,
      name: "preview_file_region",
      style:
        new Style({
          stroke: new Stroke({
            color: 'green',
            width: 3,
          })
        })
      
    },
    extraProperties: {
        events: [{'type': 'click', 'handler': (layer,event)=>{
          onClickPreviewFile(
            layer,
            event,
          )
        }}],
        priority: 2
    }

  }
  responseObject['layer'] = layerFile;

  return responseObject
}

const handleFileTypeOnChangeEvent = (e,mapActions) =>{
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
                      mapActions
                    )
                  }}],
                  priority: 2     
              }
          }
        return layerHUC
      case 'file':
        const layerFile = null
        return layerFile
  }
  


  // if(e == 'file'){

  // }
  // else{
 
  // }
}

const handleHydroshareSubForm = (websocketActions,setIsLoading) => {
  setIsLoading(true);
  websocketActions.client.send(JSON.stringify({ type: "retrieve_hydroshare_regions" }));
};

const handleReachesListSubForm = async (addSubForm,setIsLoading) => {
  addSubForm({
    id: "input-file-reaches-regions",
    type: 'inputFile',
    name: 'input-file-reaches-regions',
    label: "Upload File (*.csv, *.xlsx)",
    onChange: async (e) => {
      console.log(e);
      setIsLoading(true);
      let columns = await previewCSVFileData(e);
      addSubForm({
        id: "select-reach-columns",
        type: 'select',
        name: "select-reach-columns",
        label: "Select Reach ID Column",
        options: columns.map(column => ({ value: column, label: column })),
      });
      setIsLoading(false);
    }
  });
};

const handleGeometrySubForm = async (addSubForm,deleteSubForm,mapActions,setIsLoading) => {
  let WMSLayer = null
  addSubForm({
    id: "select-file-geometry-type",
    type: 'select',
    name: "select-file-geometry-type",
    label:"Select the Geometry source",
    options: [
      { value: 'file', label: 'File' },
      { value: 'huc', label: 'WMS Huc Layer' },
    ],
    onChange: async (selectedSourceType) => {
     
      // remove if there is a previous layer
      if (WMSLayer) {
        mapActions.removeLayer(WMSLayer);
      }
     
      // get the new layer
      WMSLayer = await  handleFileTypeOnChangeEvent(selectedSourceType,mapActions);

      // added if it is no null, which means the selected option is not file
      if(WMSLayer){
        deleteSubForm("input-file-geometry-regions");
        deleteSubForm("select-geopackage_layers");
        mapActions.addLayer(WMSLayer);
      }
      else{
        addSubForm({
          id: "input-file-geometry-regions",
          type: 'inputFile',
          name: 'input-file-geometry-regions',
          label: "Upload File (*.shp, *.json, geopackage)",
          onChange: async (e) => {
            console.log(e);
            setIsLoading(true);
            let {geopackage_layers, layer} = await previewGeometryFileData(e);
            mapActions.addLayer(layer);
            if (geopackage_layers){
              addSubForm({
                id: "select-geopackage_layers",
                type: 'select',
                name: "select-geopackage_layers",
                label:"Select Geopackage Layer",
                options: geopackage_layers,
                onChange: async (selectedLayer) => {
                  console.log(selectedLayer);
                  mapActions.removeLayer(layer); //remove the previous layer
                  setIsLoading(true);                
                  let selectLayer = await previewFileDataOnChangeGeopackageLayer(selectedLayer, e.target.files);
                  mapActions.addLayer(selectLayer); //add the new layer
                  layer = selectLayer;
                  setIsLoading(false);
                }
              });
            }
            setIsLoading(false);
          }
        });
      }
    }
  });
};


const deleteAllAddFormLayers = (mapState, mapActions)=>{
  //delete all the layers
  const selectedHucsLayers = mapState.layers.filter(layer => layer.options.name.includes('_huc_vector_selection'));
  const selectedHucsLayersNames = selectedHucsLayers.map(layer => layer.options.name);
  selectedHucsLayersNames.forEach(layerName => mapActions.delete_layer_by_name(layerName));
  mapActions.delete_layer_by_name("huc_levels")
  mapActions.delete_layer_by_name("preview_file_region")
}

const getDataForm = (formData, mapState) => {
  switch (formData.regionType) {
    case 'hydroshare':
      return formData;
    case 'reachesList':
      return formData;
    case 'geometry':
      const selectedHucsLayers = mapState.layers.filter(layer => layer.options.name.includes('_huc_vector_selection'));
      let finalGeoJSON = makeGeoJSONFromArray(selectedHucsLayers);
      formData ={
        ...formData,
        'region_data': JSON.stringify(finalGeoJSON)
      }
      return formData;
    default:
      console.log("Unhandled region type:", formData.regionType);
  }
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
  handleFileTypeOnChangeEvent,
  handleHydroshareSubForm,
  handleReachesListSubForm,
  handleGeometrySubForm,
  deleteAllAddFormLayers,
  getDataForm
}