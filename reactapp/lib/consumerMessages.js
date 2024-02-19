
const handleMessage = (
    message,
    updateProductsState
    ) =>{
    let data = JSON.parse(message);
    let command = data['command']
    if(command ==='Plot_Data_Retrieved'){
      let product_name = data['product'];
      console.log("receiving data socket")
      let ts = data['data'][0]['data'].map(obj => ({
        value: obj.value,
        'forecast-time': new Date(obj['forecast-time']).getTime()
      }));
      updateProductsState(product_name, ts);
    }
}

export { handleMessage }