
const handleMessage = (
    message,
    nwpActions
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
        nwpActions.updateReachProductsState('reach_long_range_ensemble_mean', ts_mean);
        nwpActions.updateReachProductsState('reach_long_range_ensemble_member_1', ts_1);
        nwpActions.updateReachProductsState('reach_long_range_ensemble_member_2', ts_2);
        nwpActions.updateReachProductsState('reach_long_range_ensemble_member_3', ts_3);
        nwpActions.updateReachProductsState('reach_long_range_ensemble_member_4', ts_4);
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

        nwpActions.updateReachProductsState('reach_medium_range_ensemble_mean', ts_mean);
        nwpActions.updateReachProductsState('reach_medium_range_ensemble_member_1', ts_1);
        nwpActions.updateReachProductsState('reach_medium_range_ensemble_member_2', ts_2);
        nwpActions.updateReachProductsState('reach_medium_range_ensemble_member_3', ts_3);
        nwpActions.updateReachProductsState('reach_medium_range_ensemble_member_4', ts_4);
        nwpActions.updateReachProductsState('reach_medium_range_ensemble_member_5', ts_5);
        nwpActions.updateReachProductsState('reach_medium_range_ensemble_member_6', ts_6);
      }

      if (product_name == 'analysis_assimilation') {
        let series = data['data']['analysisAssimilation']['series']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        nwpActions.updateReachProductsState('reach_analysis_assimilation', series);
      }

      if (product_name == 'short_range') {
        let series = data['data']['shortRange']['series']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        nwpActions.updateReachProductsState('reach_short_range', series);
      }
      if (product_name == 'medium_range_blend') {
        let series = data['data']['mediumRangeBlend']['series']['data'].map(obj => ({
          'value': obj.flow,
          'forecast-time': new Date(obj['validTime']).getTime()
        }));
        nwpActions.updateReachProductsState('reach_medium_range_blend', series);
      }

      nwpActions.handleModalState(true);
      nwpActions.setReachProductsLoading(false);
    }
    if(command==='Plot_Gauge_Data_Retrieved'){
      let observed_data = data['data']['observed']['data'].map(obj => ({
        'value': obj.secondary,
        'time': new Date(obj['generatedTime']).getTime()
      }));
      let forecast_data = data['data']['forecast']['data'].map(obj => ({
        'value': obj.secondary,
        'time': new Date(obj['generatedTime']).getTime()
      }));
      console.log('forecast data',forecast_data);
      console.log('observed data',observed_data);

      nwpActions.setGaugeData('gauge_forecast',forecast_data);
      nwpActions.setGaugeData('gauge_observed',observed_data);
      nwpActions.setGaugeDisplay(true);

    }
}

export { handleMessage }