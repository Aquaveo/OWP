import React, { useEffect , useRef } from 'react';
import NwpContext from 'features/NwpProducts/contexts/NwpProductsContext';
import { useNwpProducts } from '../hooks/useNWPProducts';
import appAPI from 'services/api/app';

const NwpProductsProvider = ({ children }) => {
  const {state,actions} = useNwpProducts();


  useEffect(() => {

  }, []);

  //useEffect to request data from the API based on the requested products
//   useEffect(() => {
//     // send the api data here
//     // console.log(currentProducts.state.products);
//     const controller = new AbortController();
//     const signal = controller.signal;
  
//     const requestedProducts = {};
//     if(state.state.currentStationID) {
//       for (const key in state.state.products) {
//         const nestedObject = state.state.products[key];
//         if (nestedObject['is_requested'] === true && nestedObject['data'].length === 0) {
//           requestedProducts[key] = nestedObject;
//         }
//       }
//       let dataRequest = {
//         station_id: state.state.currentStationID,
//         products: requestedProducts
//       };
  
//       // Assuming appAPI.getForecastData supports AbortController signal
//       appAPI.getForecastData(dataRequest, { signal }).catch(error => {
//         if (error.name === 'AbortError') {
//           // Handle fetch abort, ignore because it's expected on component unmount
//           console.log('Fetch aborted');
//         } else {
//           // Handle other errors
//           console.error('Fetch error:', error);
//         }
//       });
//     }
  
//     // Cleanup function to abort the fetch when the component unmounts
//     return () => controller.abort();
//   }, 
//   [
//     state.state.products.analysis_assim.is_requested,
//     state.state.products.short_range.is_requested,
//     state.state.products.long_range_ensemble_mean.is_requested,
//     state.state.products.long_range_ensemble_member_1.is_requested,
//     state.state.products.long_range_ensemble_member_2.is_requested,
//     state.state.products.long_range_ensemble_member_3.is_requested,
//     state.state.products.long_range_ensemble_member_4.is_requested,
//     state.state.products.medium_range_ensemble_mean.is_requested,
//     state.state.products.medium_range_ensemble_member_1.is_requested,
//     state.state.products.medium_range_ensemble_member_2.is_requested,
//     state.state.products.medium_range_ensemble_member_3.is_requested,
//     state.state.products.medium_range_ensemble_member_4.is_requested,
//     state.state.products.medium_range_ensemble_member_5.is_requested,
//     state.state.products.medium_range_ensemble_member_6.is_requested,
//     state.state.products.medium_range_ensemble_member_7.is_requested    
//   ]
// );



  return (
    <NwpContext.Provider value={{ ...state, actions }}>
        {children}
    </NwpContext.Provider>
  );
};

export default NwpProductsProvider;