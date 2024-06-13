
const handleMessage = (
    message,
    updateProductsState,
    handleModalState,
    setProductsLoading
    ) =>{
    //console.log("handleMessage")
    let data = JSON.parse(message);
    let command = data['command']
    if(command ==='Plot_Data_Retrieved'){
      let product_name = data['product'];
      //console.log("receiving data socket")
      if (data['data'].hasOwnProperty('message')) {
        return;
      }
      if (product_name == 'long_range') {  
        let ts_mean = data['data']['longRange']['mean']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));

        let ts_1 = data['data']['longRange']['member1']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        
        let ts_2 = data['data']['longRange']['member2']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));

        let ts_3 = data['data']['longRange']['member3']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        let ts_4 = data['data']['longRange']['member4']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        updateProductsState('long_range_ensemble_mean', ts_mean);
        updateProductsState('long_range_ensemble_member_1', ts_1);
        updateProductsState('long_range_ensemble_member_2', ts_2);
        updateProductsState('long_range_ensemble_member_3', ts_3);
        updateProductsState('long_range_ensemble_member_4', ts_4);
      }
      if (product_name == 'medium_range') {  
        let ts_mean = data['data']['mediumRange']['mean']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));

        let ts_1 = data['data']['mediumRange']['member1']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        
        let ts_2 = data['data']['mediumRange']['member2']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));

        let ts_3 = data['data']['mediumRange']['member3']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        let ts_4 = data['data']['mediumRange']['member4']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        let ts_5 = data['data']['mediumRange']['member5']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        let ts_6 = data['data']['mediumRange']['member6']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));

        updateProductsState('medium_range_ensemble_mean', ts_mean);
        updateProductsState('medium_range_ensemble_member_1', ts_1);
        updateProductsState('medium_range_ensemble_member_2', ts_2);
        updateProductsState('medium_range_ensemble_member_3', ts_3);
        updateProductsState('medium_range_ensemble_member_4', ts_4);
        updateProductsState('medium_range_ensemble_member_5', ts_5);
        updateProductsState('medium_range_ensemble_member_6', ts_6);
      }

      if (product_name == 'analysis_assimilation') {
        let series = data['data']['analysisAssimilation']['series']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        updateProductsState('analysis_assimilation', series);
      }

      if (product_name == 'short_range') {
        let series = data['data']['shortRange']['series']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        updateProductsState('short_range', series);
      }
      if (product_name == 'medium_range_blend') {
        let series = data['data']['mediumRangeBlend']['series']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        updateProductsState('medium_range_blend', series);
      }

      handleModalState(true);
      setProductsLoading(false);
    }
}

export { handleMessage }