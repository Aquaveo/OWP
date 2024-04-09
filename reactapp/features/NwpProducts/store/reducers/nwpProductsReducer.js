import { nwpmActionsTypes } from '../actions/actionsTypes'


const initialCurrentNwpProducts =
{
  state:{
    products:{
      analysis_assimilation:{
        'is_visible': true,
        'name_product': nwpmActionsTypes.analysis_assimilation,
        'color':'#ff8c66',
        'data':[],
        'is_latest': true,
        'tooltip_text':'AnA'
    },
    short_range: {
        'is_visible': true,
        'name_product': nwpmActionsTypes.short_range,
        'color':'#ff6699',
        'data':[],
        'is_latest': true,
        'tooltip_text':'SR'
    },    

    long_range_ensemble_mean: {
        'is_visible': false,
        'name_product': nwpmActionsTypes.long_range_ensemble_mean,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-Mean'
    },
    long_range_ensemble_member_1:{
        'is_visible': false,
        'name_product': nwpmActionsTypes.long_range_ensemble_member_1,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-1'
    },
    long_range_ensemble_member_2: {
        'is_visible': false,
        'name_product': nwpmActionsTypes.long_range_ensemble_member_2,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-2'
    },
    long_range_ensemble_member_3: {
        'is_visible': false,
        'name_product': nwpmActionsTypes.long_range_ensemble_member_3,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-3'
    },
    long_range_ensemble_member_4: {
        'is_visible': false,
        'name_product': nwpmActionsTypes.long_range_ensemble_member_4,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-4'
    },
    medium_range_blend: {
      'is_visible': true,
      'name_product': nwpmActionsTypes.medium_range_blend,
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-Blend'
    },
    medium_range_ensemble_mean:{
      'is_visible': false,
      'name_product': nwpmActionsTypes.medium_range_ensemble_mean,
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-Mean'
    },
    medium_range_ensemble_member_1:{
        'is_visible': false,
        'name_product': nwpmActionsTypes.medium_range_ensemble_member_1,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-1'
    },
    medium_range_ensemble_member_2:{
        'is_visible': false,
        'name_product': nwpmActionsTypes.medium_range_ensemble_member_2,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-2'
    },
    medium_range_ensemble_member_3:{
        'is_visible': false,
        'name_product': nwpmActionsTypes.medium_range_ensemble_member_3,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-3'
    },
    medium_range_ensemble_member_4:{
        'is_visible': false,
        'name_product': nwpmActionsTypes.medium_range_ensemble_member_4,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-4'
    },
    medium_range_ensemble_member_5:{
        'is_visible': false,
        'name_product': nwpmActionsTypes.medium_range_ensemble_member_5,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-5'
    },
    medium_range_ensemble_member_6:{
      'is_visible': false,
      'name_product': nwpmActionsTypes.medium_range_ensemble_member_6,
      'color': '#d966ff',
      'data':[],
      'is_latest': true,
      'tooltip_text':'MR-6'
    },
    // medium_range_ensemble_member_7:{
    //     'is_requested': false,
    //     'name_product': nwpmActionsTypes.medium_range_ensemble_member_7,
    //     'color': '#d966ff',
    //     'data': [],
    //     'is_latest': true,
    //     'tooltip_text':'MR-7'
    // }
    },
    currentGeometry: {},
    currentMetadata:[],
    areProductsLoading: false,
    isModalOpen: false,
    currentStationID: null
  }
}

const reducerProducts = (state, action) => {
  switch (action.type) {
    case nwpmActionsTypes.analysis_assimilation:
    case nwpmActionsTypes.short_range:
    case nwpmActionsTypes.long_range_ensemble_mean:
    case nwpmActionsTypes.long_range_ensemble_member_1:
    case nwpmActionsTypes.long_range_ensemble_member_2:
    case nwpmActionsTypes.long_range_ensemble_member_3:
    case nwpmActionsTypes.long_range_ensemble_member_4:
    case nwpmActionsTypes.medium_range_ensemble_mean:
    case nwpmActionsTypes.medium_range_blend:
    case nwpmActionsTypes.medium_range_ensemble_member_1:
    case nwpmActionsTypes.medium_range_ensemble_member_2:
    case nwpmActionsTypes.medium_range_ensemble_member_3:
    case nwpmActionsTypes.medium_range_ensemble_member_4:
    case nwpmActionsTypes.medium_range_ensemble_member_5:
    case nwpmActionsTypes.medium_range_ensemble_member_6:
    case nwpmActionsTypes.medium_range_ensemble_member_7:
      // Correctly update the nested structure, maintaining other properties
      return {
        ...state,
        state: {
          ...state.state,
          products: {
            ...state.state.products,
            [action.type]: {
              ...state.state.products[action.type],
              // 'is_visible': true,
              'data': action.data
            }
          }
        }
      };
    case nwpmActionsTypes.set_current_geometry:
      return {
        ...state,
        state: {
          ...state.state,
          currentGeometry: action.geometry
        }
    };
    case nwpmActionsTypes.set_current_metadata:
      return {
        ...state,
        state: {
          ...state.state,
          currentMetadata: action.metadata
        }
    };
    case nwpmActionsTypes.reset:
      return initialCurrentNwpProducts;
    case nwpmActionsTypes.set_modal_state:
      return {
        ...state,
        state: {
          ...state.state,
          isModalOpen: action.isModalOpen
        }
      };
    case nwpmActionsTypes.toggle_product:
      return {
        ...state,
        state: {
          ...state.state,
          products: {
            ...state.state.products,
            [action.product]: {
              ...state.state.products[action.product],
              'is_visible': !state.state.products[action.product]['is_visible']
            }
          }
        }
      };
    case nwpmActionsTypes.set_current_station_id:
      return {
        ...state,
        state: {
          ...state.state,
          currentStationID: action.stationID
        }
      };
    case nwpmActionsTypes.are_products_loading:
      return {
        ...state,
        state: {
          ...state.state,
          areProductsLoading: action.areProductsLoading
        }
      };
    default:
      throw new Error();
  }
};

export {reducerProducts, initialCurrentNwpProducts}