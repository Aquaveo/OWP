import {productTypes} from '../actions/actionsTypes'


const initialCurrentNwpProducts =
{
  state:{
    products:{
      analysis_assim:{
        'is_requested': true,
        'name_product': productTypes.analysis_assim,
        'color':'#ff8c66',
        'data':[],
        'is_latest': true,
        'tooltip_text':'AnA'
    },
    short_range: {
        'is_requested': false,
        'name_product': productTypes.short_range,
        'color':'#ff6699',
        'data':[],
        'is_latest': true,
        'tooltip_text':'SR'
    },    

    long_range_ensemble_mean: {
        'is_requested': false,
        'name_product': productTypes.long_range_ensemble_mean,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-Mean'
    },
    long_range_ensemble_member_1:{
        'is_requested': false,
        'name_product': productTypes.long_range_ensemble_member_1,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-1'
    },
    long_range_ensemble_member_2: {
        'is_requested': false,
        'name_product': productTypes.long_range_ensemble_member_2,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-2'
    },
    long_range_ensemble_member_3: {
        'is_requested': false,
        'name_product': productTypes.long_range_ensemble_member_3,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-3'
    },
    long_range_ensemble_member_4: {
        'is_requested': false,
        'name_product': productTypes.long_range_ensemble_member_4,
        'color': '#8ca9ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'LR-4'
    },
    medium_range_ensemble_mean:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_mean,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-Mean'
    },
    medium_range_ensemble_member_1:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_1,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-1'
    },
    medium_range_ensemble_member_2:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_2,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-2'
    },
    medium_range_ensemble_member_3:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_3,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-3'
    },
    medium_range_ensemble_member_4:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_4,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-4'
    },
    medium_range_ensemble_member_5:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_5,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-5'
    },
    medium_range_ensemble_member_6:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_6,
        'color': '#d966ff',
        'data':[],
        'is_latest': true,
        'tooltip_text':'MR-6'
    },
    medium_range_ensemble_member_7:{
        'is_requested': false,
        'name_product': productTypes.medium_range_ensemble_member_7,
        'color': '#d966ff',
        'data': [],
        'is_latest': true,
        'tooltip_text':'MR-7'
    }
    },
    currentGeometry: {},
    currentMetadata:[]
  }
}

const reducerProducts = (state, action) => {
  switch (action.type) {
    case productTypes.analysis_assim:
    case productTypes.short_range:
    case productTypes.long_range_ensemble_mean:
    case productTypes.long_range_ensemble_member_1:
    case productTypes.long_range_ensemble_member_2:
    case productTypes.long_range_ensemble_member_3:
    case productTypes.long_range_ensemble_member_4:
    case productTypes.medium_range_ensemble_mean:
    case productTypes.medium_range_ensemble_member_1:
    case productTypes.medium_range_ensemble_member_2:
    case productTypes.medium_range_ensemble_member_3:
    case productTypes.medium_range_ensemble_member_4:
    case productTypes.medium_range_ensemble_member_5:
    case productTypes.medium_range_ensemble_member_6:
    case productTypes.medium_range_ensemble_member_7:
      // Correctly update the nested structure, maintaining other properties
      return {
        ...state,
        state: {
          ...state.state,
          products: {
            ...state.state.products,
            [action.type]: {
              ...state.state.products[action.type],
              'is_requested': true,
              'data': action.data
            }
          }
        }
      };
    case productTypes.set_current_geometry:
      return {
        ...state,
        state: {
          ...state.state,
          currentGeometry: action.geometry
        }
    };
    case productTypes.set_current_metadata:
      return {
        ...state,
        state: {
          ...state.state,
          currentMetadata: action.metadata
        }
    };
    case productTypes.reset:
      return initialCurrentNwpProducts;
    default:
      throw new Error();
  }
};

export {reducerProducts, initialCurrentNwpProducts}