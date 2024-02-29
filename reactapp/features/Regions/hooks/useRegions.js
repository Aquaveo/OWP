import { useReducer } from "react"
import { regionsReducer,initalRegionsStoreState } from "../store/reducers/RegionsReducer"
import { RegionsActionsTypes } from "../store/actions/RegionsActionsTypes"


// Custom hook for managing the state of the NWP products
export const useRegions = ({reducer = regionsReducer} = {}) => {
    const [state, updateRegions] = useReducer(reducer, initalRegionsStoreState)

    const actions = {
        loadRegions: (regions)=> updateRegions({type: RegionsActionsTypes.load_regions, payload: regions}),
        addRegion: (region)=> updateRegions({type: RegionsActionsTypes.add_region, payload: region})
    };

    return {
        state,
        actions
    }
}