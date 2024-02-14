import * as React from 'react'


const initialCurrentNwpProducts =
{
  analysis_assim:{
    'is_requested': true,
    'name_product': 'analysis_assim',
    'color':'#ff8c66',
    'data':[],
    'is_latest': true,
    'tooltip_text':'AnA'
  },
  short_range: {
    'is_requested': false,
    'name_product': 'short_range',
    'color':'#ff6699',
    'data':[],
    'is_latest': true,
    'tooltip_text':'SR'
  },    

  long_range_ensemble_mean: {
    'is_requested': false,
    'name_product': 'long_range_ensemble_mean',
    'color': '#8ca9ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'LR-Mean'
  },
  long_range_ensemble_member_1:{
    'is_requested': false,
    'name_product': 'long_range_ensemble_member_1',
    'color': '#8ca9ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'LR-1'
  },
  long_range_ensemble_member_2: {
    'is_requested': false,
    'name_product': 'long_range_ensemble_member_2',
    'color': '#8ca9ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'LR-2'
  },
  long_range_ensemble_member_3: {
    'is_requested': false,
    'name_product': 'long_range_ensemble_member_3',
    'color': '#8ca9ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'LR-3'
  },
  long_range_ensemble_member_4: {
    'is_requested': false,
    'name_product': 'long_range_ensemble_member_4',
    'color': '#8ca9ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'LR-4'
  },
  medium_range_ensemble_mean:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_mean',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-Mean'
  },
  medium_range_ensemble_member_1:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_1',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-1'
  },
  medium_range_ensemble_member_2:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_2',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-2'
  },
  medium_range_ensemble_member_3:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_3',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-3'
  },
  medium_range_ensemble_member_4:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_4',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-4'
  },
  medium_range_ensemble_member_5:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_5',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-5'
  },
  medium_range_ensemble_member_6:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_6',
    'color': '#d966ff',
    'data':[],
    'is_latest': true,
    'tooltip_text':'MR-6'
  },
  medium_range_ensemble_member_7:{
    'is_requested': false,
    'name_product': 'medium_range_ensemble_member_7',
    'color': '#d966ff',
    'data': [],
    'is_latest': true,
    'tooltip_text':'MR-7'
  }
}


const productTypes = {
    analysis_assim: 'analysis_assim',
    short_range: 'short_range',
    long_range_ensemble_mean: 'long_range_ensemble_mean',
    long_range_ensemble_member_1: 'long_range_ensemble_member_1',
    long_range_ensemble_member_2: 'long_range_ensemble_member_2',
    long_range_ensemble_member_3: 'long_range_ensemble_member_3',
    long_range_ensemble_member_4: 'long_range_ensemble_member_4',
    medium_range_ensemble_mean: 'medium_range_ensemble_mean',
    medium_range_ensemble_member_1: 'medium_range_ensemble_member_1',
    medium_range_ensemble_member_2: 'medium_range_ensemble_member_2',
    medium_range_ensemble_member_3: 'medium_range_ensemble_member_3',
    medium_range_ensemble_member_4: 'medium_range_ensemble_member_4',
    medium_range_ensemble_member_5: 'medium_range_ensemble_member_5',
    medium_range_ensemble_member_6: 'medium_range_ensemble_member_6',
    medium_range_ensemble_member_7: 'medium_range_ensemble_member_7',
    reset: 'reset'
}
  

const reducerProducts = (state, action) => {

    switch (action.type) {
      case productTypes.analysis_assim:
        return { ...state, analysis_assim : {... state['analysis_assim'], 'is_requested': action.is_requested,'data': action.data } };
      case productTypes.short_range:
        return { ...state, short_range: {... state['short_range'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.long_range_ensemble_mean:
          return { ...state, long_range_ensemble_mean: {... state['long_range_ensemble_mean'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.long_range_ensemble_member_1:
        return { ...state, long_range_ensemble_member_1: {... state['long_range_ensemble_member_1'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.long_range_ensemble_member_2:
        return { ...state, long_range_ensemble_member_2: {... state['long_range_ensemble_member_2'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.long_range_ensemble_member_3:
        return { ...state, long_range_ensemble_member_3: {... state['long_range_ensemble_member_3'], 'is_requested': action.is_requested, 'data': action.data }};   
      case productTypes.long_range_ensemble_member_4:
        return { ...state, long_range_ensemble_member_4: {... state['long_range_ensemble_member_4'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case productTypes.medium_range_ensemble_mean:
        return { ...state, medium_range_ensemble_mean: {... state['medium_range_ensemble_mean'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.medium_range_ensemble_member_1:
        return { ...state, medium_range_ensemble_member_1: {... state['medium_range_ensemble_member_1'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.medium_range_ensemble_member_2:
        return { ...state, medium_range_ensemble_member_2: {... state['medium_range_ensemble_member_2'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.medium_range_ensemble_member_3:
        return { ...state, medium_range_ensemble_member_3: {... state['medium_range_ensemble_member_3'], 'is_requested': action.is_requested, 'data': action.data }};   
      case productTypes.medium_range_ensemble_member_4:
        return { ...state, medium_range_ensemble_member_4: {... state['medium_range_ensemble_member_4'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case productTypes.medium_range_ensemble_member_5:
        return { ...state, medium_range_ensemble_member_5: {... state['medium_range_ensemble_member_5'], 'is_requested': action.is_requested, 'data': action.data }};
      case productTypes.medium_range_ensemble_member_6:
          return { ...state, medium_range_ensemble_member_6: {... state['medium_range_ensemble_member_6'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case productTypes.medium_range_ensemble_member_7:
          return { ...state, medium_range_ensemble_member_7: {... state['medium_range_ensemble_member_7'], 'is_requested': action.is_requested, 'data': action.data }}; 
      case productTypes.reset:
        return initialCurrentNwpProducts
      
      default:
        throw new Error();
    }
  }


export const useNwpProducts = ({reducer = reducerProducts} = {}, ts) => {
    const [currentProducts, updateProducts] = React.useReducer(reducer, initialCurrentNwpProducts )
  
    const addAA = () => updateProducts({type: productTypes.analysis_assim,is_requested:true, data: ts})
    const addSR = () => updateProducts({type: productTypes.short_range,is_requested:true, data: ts})
    const addLRMean = () => updateProducts({type: productTypes.long_range_ensemble_mean,is_requested:true, data: ts})
    const addLREnsemble1 = () => updateProducts({type: productTypes.long_range_ensemble_member_1,is_requested:true, data: ts})
    const addLREnsemble2 = () => updateProducts({type: productTypes.long_range_ensemble_member_2,is_requested:true, data: ts})
    const addLREnsemble3 = () => updateProducts({type: productTypes.long_range_ensemble_member_3,is_requested:true, data: ts})
    const addLREnsemble4 = () => updateProducts({type: productTypes.long_range_ensemble_member_4,is_requested:true, data: ts})
    const addMRMean = () => updateProducts({type: productTypes.medium_range_ensemble_mean,is_requested:true, data: ts})
    const addMREnsemble1 = () => updateProducts({type: productTypes.medium_range_ensemble_member_1,is_requested:true, data: ts})
    const addMREnsemble2 = () => updateProducts({type: productTypes.medium_range_ensemble_member_2,is_requested:true, data: ts})
    const addMREnsemble3 = () => updateProducts({type: productTypes.medium_range_ensemble_member_3,is_requested:true, data: ts})
    const addMREnsemble4 = () => updateProducts({type: productTypes.medium_range_ensemble_member_4,is_requested:true, data: ts})
    const addMREnsemble5 = () => updateProducts({type: productTypes.medium_range_ensemble_member_5,is_requested:true, data: ts})
    const addMREnsemble6 = () => updateProducts({type: productTypes.medium_range_ensemble_member_6,is_requested:true, data: ts})
    const addMREnsemble7 = () => updateProducts({type: productTypes.medium_range_ensemble_member_7,is_requested:true, data: ts})
    const resetProducts = () => updateProducts({type:productTypes.reset})
    
    return {
      currentProducts, 
      addAA,
      addSR, 
      addLRMean,
      addLREnsemble1,
      addLREnsemble2,
      addLREnsemble3,
      addLREnsemble4,
      addMRMean,
      addMREnsemble1,
      addMREnsemble2,
      addMREnsemble3,
      addMREnsemble4,
      addMREnsemble5,
      addMREnsemble6,
      addMREnsemble7,
      resetProducts
    }
}