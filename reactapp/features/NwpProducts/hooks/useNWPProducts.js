import { useReducer } from "react"
import { reducerProducts, initialCurrentNwpProducts } from "../store/reducers/nwpProductsReducer"
import { nwpmActionsTypes } from "../store/actions/actionsTypes"

// Custom hook for managing the state of the NWP products
export const useNwpProducts = ({reducer = reducerProducts} = {}) => {
    const [state, updateProducts] = useReducer(reducer, initialCurrentNwpProducts)
    const actions = {
      updateProductsState: (product,ts) => updateProducts({type: nwpmActionsTypes[product], data: ts}),
      updateCurrentGeometry: (geometry) => updateProducts({type: nwpmActionsTypes.set_current_geometry, geometry: geometry}),
      updateCurrentMetadata: (metadata) => updateProducts({type: nwpmActionsTypes.set_current_metadata, metadata: metadata}),
      resetProducts: () => updateProducts({type:nwpmActionsTypes.reset}),
      handleModalState: (isModalOpen) => updateProducts({type: nwpmActionsTypes.set_modal_state, isModalOpen: isModalOpen}),
      toggleProduct: (product) => updateProducts({type: nwpmActionsTypes.toggle_product, product: product}),
      updateCurrentStationID: (stationID) => updateProducts({type: nwpmActionsTypes.set_current_station_id, stationID: stationID}),
      setProductsLoading: (isLoaded) => updateProducts({type: nwpmActionsTypes.are_products_loading, areProductsLoading: isLoaded}),
      //gauge data
      setGaugeObserved: (data) => updateProducts({type: nwpmActionsTypes.set_gauge_observed, data: data}),
      setGaugeForecast: (data) => updateProducts({type: nwpmActionsTypes.set_gauge_forecast, data: data}),
      setGaugeDisplay: (display) => updateProducts({type: nwpmActionsTypes.set_gauge_display, display: display})
      
    }

    return {
      state, 
      actions
    }
}