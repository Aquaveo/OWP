import { useReducer } from "react"
import { reducerNwm, initialCurrentNwm } from "../store/reducers/nwmReducer"
import { nwmActionsTypes } from "../store/actions/actionsTypes"

// Custom hook for managing the state of the NWP products
export const useNwm= ({reducer = reducerNwm} = {}) => {
    const [state, updateNwm] = useReducer(reducer, initialCurrentNwm)
    const actions = {
      // Reach data
      updateReachProductsState: (product,ts) => updateNwm({type: nwmActionsTypes[product], data: ts}),
      updateReachCurrentGeometry: (geometry) => updateNwm({type: nwmActionsTypes.set_reach_current_geometry, geometry: geometry}),
      updateReachCurrentMetadata: (metadata) => updateNwm({type: nwmActionsTypes.set_reach_current_metadata, metadata: metadata}),
      toggleReachProduct: (product) => updateNwm({type: nwmActionsTypes.reach_toggle_product, product: product}),
      updateCurrentReachID: (stationID) => updateNwm({type: nwmActionsTypes.set_current_reach_id, stationID: stationID}),
      setReachProductsLoading: (isLoaded) => updateNwm({type: nwmActionsTypes.are_products_loading, areProductsLoading: isLoaded}),
      resetReaches: () => updateNwm({type: nwmActionsTypes.reset_reaches}),

      //Gauge data
      setGaugeData: (type,data) => updateNwm({type: nwmActionsTypes[type], data: data}),
      toggleGaugeData: (type) => updateNwm({type: nwmActionsTypes.gauge_toggle_data, data: type}),
      setGaugeDisplay: (display) => updateNwm({type: nwmActionsTypes.set_gauge_display, display: display}),
      setGaugeCurrentID: (gaugeID) => updateNwm({type: nwmActionsTypes.set_gauge_current_id, gaugeID: gaugeID}),
      setGaugeCurrentGeometry: (geometry) => updateNwm({type: nwmActionsTypes.set_gauge_current_geometry, geometry: geometry}),
      resetGauges: () => updateNwm({type: nwmActionsTypes.reset_gauges}),
      setGaugeCurrentMetadata: (metadata) => updateNwm({type: nwmActionsTypes.set_gauge_current_metadata, metadata: metadata}),
      // All
      resetAll: () => updateNwm({type:nwmActionsTypes.reset}),
      handleModalState: (isModalOpen) => updateNwm({type: nwmActionsTypes.set_modal_state, isModalOpen: isModalOpen}),

    }

    return {
      state, 
      actions
    }
}
