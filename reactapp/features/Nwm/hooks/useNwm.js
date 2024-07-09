import { useReducer } from "react"
import { reducerNwm, initialCurrentNwm } from "../store/reducers/nwmReducer"
import { nwmActionsTypes } from "../store/actions/actionsTypes"

// Higher-order function for logging
const withLogging = (fn, name) => (...args) => {
  console.log(`Function called: ${name}`);
  return fn(...args);
}

// Custom hook for managing the state of the NWP products
export const useNwm = ({ reducer = reducerNwm } = {}) => {
  const [state, updateNwm] = useReducer(reducer, initialCurrentNwm)
  const actions = {
    // Reach data
    updateReachProductsState: withLogging((product, ts) => updateNwm({ type: nwmActionsTypes[product], data: ts }), 'updateReachProductsState'),
    updateReachCurrentGeometry: withLogging((geometry) => updateNwm({ type: nwmActionsTypes.set_reach_current_geometry, geometry: geometry }), 'updateReachCurrentGeometry'),
    updateReachCurrentMetadata: withLogging((metadata) => updateNwm({ type: nwmActionsTypes.set_reach_current_metadata, metadata: metadata }), 'updateReachCurrentMetadata'),
    toggleReachProduct: withLogging((product) => updateNwm({ type: nwmActionsTypes.reach_toggle_product, product: product }), 'toggleReachProduct'),
    updateCurrentReachID: withLogging((stationID) => updateNwm({ type: nwmActionsTypes.set_current_reach_id, stationID: stationID }), 'updateCurrentReachID'),
    setReachProductsLoading: withLogging((isLoaded) => updateNwm({ type: nwmActionsTypes.are_products_loading, areProductsLoading: isLoaded }), 'setReachProductsLoading'),
    resetReaches: withLogging(() => updateNwm({ type: nwmActionsTypes.reset_reaches }), 'resetReaches'),

    // Gauge data
    setGaugeData: withLogging((dataType, ts) => updateNwm({ type: nwmActionsTypes[dataType], data: ts }), 'setGaugeData'),
    toggleGaugeData: withLogging((dataType) => updateNwm({ type: nwmActionsTypes.gauge_toggle_data, data: dataType }), 'toggleGaugeData'),
    setGaugeDisplay: withLogging((display) => updateNwm({ type: nwmActionsTypes.set_gauge_display, display: display }), 'setGaugeDisplay'),
    setGaugeCurrentID: withLogging((gaugeID) => updateNwm({ type: nwmActionsTypes.set_gauge_current_id, gaugeID: gaugeID }), 'setGaugeCurrentID'),
    setGaugeCurrentGeometry: withLogging((geometry) => updateNwm({ type: nwmActionsTypes.set_gauge_current_geometry, geometry: geometry }), 'setGaugeCurrentGeometry'),
    resetGauges: withLogging(() => updateNwm({ type: nwmActionsTypes.reset_gauges }), 'resetGauges'),
    setGaugeCurrentMetadata: withLogging((metadata) => updateNwm({ type: nwmActionsTypes.set_gauge_current_metadata, metadata: metadata }), 'setGaugeCurrentMetadata'),
    
    // All
    resetAll: withLogging(() => updateNwm({ type: nwmActionsTypes.reset }), 'resetAll'),

    handleModalState: withLogging((isModalOpen) => updateNwm({ type: nwmActionsTypes.set_modal_state, isModalOpen: isModalOpen }), 'handleModalState'),
  }

  return {
    state,
    actions
  }
}
