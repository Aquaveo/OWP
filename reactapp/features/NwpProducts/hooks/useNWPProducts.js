import { useReducer } from "react"
import { reducerProducts, initialCurrentNwpProducts } from "../store/reducers/nwpProductsReducer"
import { productTypes } from "../store/actions/actionsTypes"

// Custom hook for managing the state of the NWP products
export const useNwpProducts = ({reducer = reducerProducts} = {}, ts) => {
    const [currentProducts, updateProducts] = useReducer(reducer, initialCurrentNwpProducts )
    const updateProductsState = (typeProduct) => updateProducts({type: productTypes.typeProduct, data: ts});
    
    // const updateAA = () => updateProducts({type: productTypes.analysis_assim,is_requested:true, data: ts})
    // const updateSR = () => updateProducts({type: productTypes.short_range,is_requested:true, data: ts})
    // const updateLRMean = () => updateProducts({type: productTypes.long_range_ensemble_mean,is_requested:true, data: ts})
    // const updateLREnsemble1 = () => updateProducts({type: productTypes.long_range_ensemble_member_1,is_requested:true, data: ts})
    // const updateLREnsemble2 = () => updateProducts({type: productTypes.long_range_ensemble_member_2,is_requested:true, data: ts})
    // const updateLREnsemble3 = () => updateProducts({type: productTypes.long_range_ensemble_member_3,is_requested:true, data: ts})
    // const updateLREnsemble4 = () => updateProducts({type: productTypes.long_range_ensemble_member_4,is_requested:true, data: ts})
    // const updateMRMean = () => updateProducts({type: productTypes.medium_range_ensemble_mean,is_requested:true, data: ts})
    // const updateMREnsemble1 = () => updateProducts({type: productTypes.medium_range_ensemble_member_1,is_requested:true, data: ts})
    // const updateMREnsemble2 = () => updateProducts({type: productTypes.medium_range_ensemble_member_2,is_requested:true, data: ts})
    // const updateMREnsemble3 = () => updateProducts({type: productTypes.medium_range_ensemble_member_3,is_requested:true, data: ts})
    // const updateMREnsemble4 = () => updateProducts({type: productTypes.medium_range_ensemble_member_4,is_requested:true, data: ts})
    // const updateMREnsemble5 = () => updateProducts({type: productTypes.medium_range_ensemble_member_5,is_requested:true, data: ts})
    // const updateMREnsemble6 = () => updateProducts({type: productTypes.medium_range_ensemble_member_6,is_requested:true, data: ts})
    // const updateMREnsemble7 = () => updateProducts({type: productTypes.medium_range_ensemble_member_7,is_requested:true, data: ts})
    const updateCurrentGeometry = (geometry) => updateProducts({type: productTypes.set_current_geometry, geometry: geometry})
    const updateCurrentMetadata = (metadata) => updateProducts({type: productTypes.set_current_metadata, metadata: metadata})
    const resetProducts = () => updateProducts({type:productTypes.reset})
    
    return {
      currentProducts, 
      // updateAA,
      // updateSR, 
      // updateLRMean,
      // updateLREnsemble1,
      // updateLREnsemble2,
      // updateLREnsemble3,
      // updateLREnsemble4,
      // updateMRMean,
      // updateMREnsemble1,
      // updateMREnsemble2,
      // updateMREnsemble3,
      // updateMREnsemble4,
      // updateMREnsemble5,
      // updateMREnsemble6,
      // updateMREnsemble7,
      updateProductsState,
      updateCurrentGeometry,
      updateCurrentMetadata,
      resetProducts
    }
}