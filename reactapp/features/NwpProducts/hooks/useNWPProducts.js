import { useReducer } from "react"
import { reducerProducts, initialCurrentNwpProducts } from "../store/reducers/nwpProductsReducer"
import { nwpmActionsTypes } from "../store/actions/actionsTypes"

// Custom hook for managing the state of the NWP products
export const useNwpProducts = ({reducer = reducerProducts} = {}) => {
    const [currentProducts, updateProducts] = useReducer(reducer, initialCurrentNwpProducts )
    const updateProductsState = (product,ts) => updateProducts({type: nwpmActionsTypes[product], data: ts});
    const updateCurrentGeometry = (geometry) => updateProducts({type: nwpmActionsTypes.set_current_geometry, geometry: geometry});
    const updateCurrentMetadata = (metadata) => updateProducts({type: nwpmActionsTypes.set_current_metadata, metadata: metadata});
    const resetProducts = () => updateProducts({type:nwpmActionsTypes.reset});
    const handleModalState = (isModalOpen) => updateProducts({type: nwpmActionsTypes.set_modal_state, isModalOpen: isModalOpen});
    const toggleProduct = (product) => updateProducts({type: nwpmActionsTypes.toggle_product, product: product});
    const updateCurrentStationID = (stationID) => updateProducts({type: nwpmActionsTypes.set_current_station_id, stationID: stationID});
    return {
      currentProducts, 
      updateProductsState,
      updateCurrentGeometry,
      updateCurrentMetadata,
      resetProducts,
      handleModalState,
      toggleProduct,
      updateCurrentStationID
    }
}