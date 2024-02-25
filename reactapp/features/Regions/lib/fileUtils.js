import appAPI from "services/api/app";

const previewCSVFileData = async (e) =>{
    // console.log(e)
    
    const dataRequest = new FormData();
    Array.from(e.target.files).forEach(file=>{
      dataRequest.append('files', file);
    });
    
    let reponse_obj = await appAPI.previewUserColumnsFromFile(dataRequest).catch((error) => {});
    
    return reponse_obj.columns
}

export { previewCSVFileData }