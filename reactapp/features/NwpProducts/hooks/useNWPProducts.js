import { useReducer } from "react"
import { reducerProducts, initialCurrentNwpProducts } from "../store/reducers/nwpProductsReducer"
import { nwpmActionsTypes } from "../store/actions/actionsTypes"

// Custom hook for managing the state of the NWP products
export const useNwpProducts = ({reducer = reducerProducts} = {}) => {
    const [currentProducts, updateProducts] = useReducer(reducer, initialCurrentNwpProducts )
    const updateProductsState = (typeProduct,ts) => updateProducts({type: nwpmActionsTypes[typeProduct], data: ts});
    const updateCurrentGeometry = (geometry) => updateProducts({type: nwpmActionsTypes.set_current_geometry, geometry: geometry});
    const updateCurrentMetadata = (metadata) => updateProducts({type: nwpmActionsTypes.set_current_metadata, metadata: metadata});
    const resetProducts = () => updateProducts({type:nwpmActionsTypes.reset});
    const handleModalState = (isModalOpen) => updateProducts({type: nwpmActionsTypes.set_modal_state, isModalOpen: isModalOpen});

    return {
      currentProducts, 
      updateProductsState,
      updateCurrentGeometry,
      updateCurrentMetadata,
      resetProducts,
      handleModalState
    }
}