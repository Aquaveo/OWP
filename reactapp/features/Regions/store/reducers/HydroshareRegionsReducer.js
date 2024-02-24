

const HydroShareRegionsInitial={
    state:{
        regions:[]
    },
}


// const reducerHydroShareRegions = (state, action) => {
//     switch (action.type) {

//       case nwpmActionsTypes.set_current_geometry:
//         return {
//           ...state,
//           state: {
//             ...state.state,
//             currentGeometry: action.geometry
//           }
//       };
//       case nwpmActionsTypes.set_current_metadata:
//         return {
//           ...state,
//           state: {
//             ...state.state,
//             currentMetadata: action.metadata
//           }
//       };
//       case nwpmActionsTypes.reset:
//         return initialCurrentNwpProducts;
//       case nwpmActionsTypes.set_modal_state:
//         return {
//           ...state,
//           state: {
//             ...state.state,
//             isModalOpen: action.isModalOpen
//           }
//         };
//       case nwpmActionsTypes.toggle_product:
//         return {
//           ...state,
//           state: {
//             ...state.state,
//             products: {
//               ...state.state.products,
//               [action.product]: {
//                 ...state.state.products[action.product],
//                 'is_requested': !state.state.products[action.product]['is_requested']
//               }
//             }
//           }
//         };
//       case nwpmActionsTypes.set_current_station_id:
//         return {
//           ...state,
//           state: {
//             ...state.state,
//             currentStationID: action.stationID
//           }
//         };
//       default:
//         throw new Error();
//     }
//   };

// resource_data["value"]
// resource_data["label"]
// resource_data["public"]
// resource_data["color"]