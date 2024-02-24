
const handleMessage = (
    message,
    updateProductsState,
    handleModalState
    ) =>{
    let data = JSON.parse(message);
    let command = data['command']
    console.log("command", data)
    if(command ==='Plot_Data_Retrieved'){
      let product_name = data['product'];
      console.log("receiving data socket")
      let ts = data['data'][0]['data'].map(obj => ({
        value: obj.value,
        'forecast-time': new Date(obj['forecast-time']).getTime()
      }));
      updateProductsState(product_name, ts);
      handleModalState(true);
    }
    if(command ==='show_hydroshare_regions_notifications'){
      console.log(data['data'])
      // if (data['message'] ==='Not logged in through HydroShare'){
      //   setIsHydroShareLogin(false)
      // }
      // else{
      //   setIsHydroShareLogin(true);
      // }
      // setHydroShareRegionsOptions(data['data'])
    }
}

export { handleMessage }