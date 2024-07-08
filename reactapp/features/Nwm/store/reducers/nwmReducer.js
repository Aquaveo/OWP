import { nwmActionsTypes } from '../actions/actionsTypes'


const initialCurrentNwm =
{
  state:{
    reaches:{
      products:{
        reach_analysis_assimilation:{
          'is_visible': true,
          'name_product': nwmActionsTypes.reach_analysis_assimilation,
          'color':'#ff8c66',
          'data':[],
          'is_latest': true,
          'tooltip_text':'AnA'
      },
      reach_short_range: {
          'is_visible': true,
          'name_product': nwmActionsTypes.reach_short_range,
          'color':'#ff6699',
          'data':[],
          'is_latest': true,
          'tooltip_text':'SR'
      },    
  
      reach_long_range_ensemble_mean: {
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_long_range_ensemble_mean,
          'color': '#8ca9ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'LR-Mean'
      },
      reach_long_range_ensemble_member_1:{
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_long_range_ensemble_member_1,
          'color': '#8ca9ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'LR-1'
      },
      reach_long_range_ensemble_member_2: {
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_long_range_ensemble_member_2,
          'color': '#8ca9ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'LR-2'
      },
      reach_long_range_ensemble_member_3: {
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_long_range_ensemble_member_3,
          'color': '#8ca9ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'LR-3'
      },
      reach_long_range_ensemble_member_4: {
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_long_range_ensemble_member_4,
          'color': '#8ca9ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'LR-4'
      },
      reach_medium_range_blend: {
        'is_visible': true,
        'name_product': nwmActionsTypes.reach_medium_range_blend,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-Blend'
      },
      reach_medium_range_ensemble_mean:{
        'is_visible': false,
        'name_product': nwmActionsTypes.reach_medium_range_ensemble_mean,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-Mean'
      },
      reach_medium_range_ensemble_member_1:{
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_medium_range_ensemble_member_1,
          'color': '#d966ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'MR-1'
      },
      reach_medium_range_ensemble_member_2:{
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_medium_range_ensemble_member_2,
          'color': '#d966ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'MR-2'
      },
      reach_medium_range_ensemble_member_3:{
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_medium_range_ensemble_member_3,
          'color': '#d966ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'MR-3'
      },
      reach_medium_range_ensemble_member_4:{
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_medium_range_ensemble_member_4,
          'color': '#d966ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'MR-4'
      },
      reach_medium_range_ensemble_member_5:{
          'is_visible': false,
          'name_product': nwmActionsTypes.reach_medium_range_ensemble_member_5,
          'color': '#d966ff',
          'data':[],
          'is_latest': true,
          'tooltip_text':'MR-5'
      },
      reach_medium_range_ensemble_member_6:{
        'is_visible': false,
        'name_product': nwmActionsTypes.reach_medium_range_ensemble_member_6,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-6'
      },
      },
      currentGeometry: {},
      currentMetadata:[],
      areProductsLoading: false,
      currentReachID: null,
    },
    isModalOpen: false,
    gauges:{
      gauge_forecast: {
        'is_visible': true,
        'name': 'gauge_forecast',
        'color':'#ff8c66',
        'data':[],
        'tooltip_text':'Forecast'
      },
      gauge_observed: {
        'is_visible': true,
        'name': 'gauge_observed',
        'color':'#ff8c66',
        'data':[],
        'tooltip_text':'Observed'
      },
      display: false,
      metadata: {},
      currentGaugeID: null,
      currentGeometry: {},
    }
  }
}

const reducerNwm = (state, action) => {
  console.log(state, action)
  switch (action.type) {
    case nwmActionsTypes.reach_analysis_assimilation:
    case nwmActionsTypes.reach_short_range:
    case nwmActionsTypes.reach_long_range_ensemble_mean:
    case nwmActionsTypes.reach_long_range_ensemble_member_1:
    case nwmActionsTypes.reach_long_range_ensemble_member_2:
    case nwmActionsTypes.reach_long_range_ensemble_member_3:
    case nwmActionsTypes.reach_long_range_ensemble_member_4:
    case nwmActionsTypes.reach_medium_range_ensemble_mean:
    case nwmActionsTypes.reach_medium_range_blend:
    case nwmActionsTypes.reach_medium_range_ensemble_member_1:
    case nwmActionsTypes.reach_medium_range_ensemble_member_2:
    case nwmActionsTypes.reach_medium_range_ensemble_member_3:
    case nwmActionsTypes.reach_medium_range_ensemble_member_4:
    case nwmActionsTypes.reach_medium_range_ensemble_member_5:
    case nwmActionsTypes.reach_medium_range_ensemble_member_6:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: {
            ...state.state.reaches,
            products: {
              ...state.state.reaches.products,
              [action.type]: {
                ...state.state.reaches.products[action.type],
                data: action.data
              }
            }
          }
        }
      };
    case nwmActionsTypes.set_reach_current_geometry:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: {
            ...state.state.reaches,
            currentGeometry: action.geometry
          }
        }
      };
    case nwmActionsTypes.set_reach_current_metadata:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: {
            ...state.state.reaches,
            currentMetadata: action.metadata
          }
        }
      };
    case nwmActionsTypes.reset_reaches:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: initialCurrentNwm.state.reaches
        }
      };
    case nwmActionsTypes.reset_gauges:
      return {
        ...state,
        state: {
          ...state.state,
          gauges: initialCurrentNwm.state.gauges
        }
      };
    case nwmActionsTypes.set_modal_state:
      return {
        ...state,
        state: {
          ...state.state,
          isModalOpen: action.isModalOpen
        }
      };
    case nwmActionsTypes.reach_toggle_product:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: {
            ...state.state.reaches,
            products: {
              ...state.state.reaches.products,
              [action.product]: {
                ...state.state.reaches.products[action.product],
                is_visible: !state.state.reaches.products[action.product].is_visible
              }
            }
          }
        }
      };
    case nwmActionsTypes.set_current_reach_id:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: {
            ...state.state.reaches,
            currentReachID: action.reachID
          }
        }
      };
    case nwmActionsTypes.are_products_loading:
      return {
        ...state,
        state: {
          ...state.state,
          reaches: {
            ...state.state.reaches,
            areProductsLoading: action.areProductsLoading
          }
        }
      };
    case nwmActionsTypes.gauge_observed:
    case nwmActionsTypes.gauge_forecast:  
      return {
        ...state,
        state: {
          ...state.state,
          gauges: {
            ...state.state.gauges,
            [action.dataType]: {
              ...state.state.gauges[action.dataType],
              data: action.data
            }            
          }
        }
      };

    case nwmActionsTypes.set_gauge_display:
      return {
        ...state,
        state: {
          ...state.state,
          gauges: {
            ...state.state.gauges,
            display: action.display
          }
        }
      };
    case nwmActionsTypes.set_gauge_current_id:
      return {
        ...state,
        state: {
          ...state.state,
          gauges: {
            ...state.state.gauges,
            currentGaugeID: action.gaugeID
          }
        }
      };
    case nwmActionsTypes.set_gauge_current_geometry:
      return {
        ...state,
        state: {
          ...state.state,
          gauges: {
            ...state.state.gauges,
            currentGeometry: action.geometry
          }
        }
      };
    case nwmActionsTypes.reset_all:
      return initialCurrentNwm;

    case nwmActionsTypes.set_gauge_current_metadata:
      return {
        ...state,
        state: {
          ...state.state,
          gauges: {
            ...state.state.gauges,
            metadata: action.metadata
          }
        }
      };
    case nwmActionsTypes.gauge_toggle_data:
      return {
        ...state,
        state: {
          ...state.state,
          gauges: {
            ...state.state.gauges,
            [action.dataType]: {
              ...state.state.gauges[action.dataType],
              is_visible: !state.state.gauges[action.dataType].is_visible
            }
          }
        }
      };
    default:
      throw new Error();
  }
};

export {reducerNwm, initialCurrentNwm}