import { useReducer } from "react"
import { regionsReducer,initalRegionsStoreState } from "../store/reducers/RegionsReducer"
import { RegionsActionsTypes } from "../store/actions/RegionsActionsTypes"


// Custom hook for managing the state of the NWP products
export const useRegions = ({reducer = regionsReducer} = {}) => {
    const [state, updateRegions] = useReducer(reducer, initalRegionsStoreState)

    const actions = {
        loadRegions: (regions)=> updateRegions({type: RegionsActionsTypes.load_regions, payload: regions}),
        addRegion: (region)=> updateRegions({type: RegionsActionsTypes.add_region, payload: region}),
        setTotalPageNumber: (totalPageNumber)=> updateRegions({type: RegionsActionsTypes.set_total_page_number, payload: totalPageNumber}),
        updateCurrentPage: (currentPageNumber)=> updateRegions({type: RegionsActionsTypes.update_current_page, payload: currentPageNumber}),
        updateCurrentRegionReaches: (reaches)=> updateRegions({type: RegionsActionsTypes.update_current_region_reaches, payload: reaches}),
        setSearchInput: (searchInput)=> updateRegions({type: RegionsActionsTypes.set_search_input, payload: searchInput}),
        setIsVisible: (isVisible)=> updateRegions({type: RegionsActionsTypes.set_is_visible, payload: isVisible}),
        appendRegionReaches: (reaches)=> updateRegions({type: RegionsActionsTypes.append_region_reaches, payload: reaches})
    };

    return {
        state,
        actions
    }
}