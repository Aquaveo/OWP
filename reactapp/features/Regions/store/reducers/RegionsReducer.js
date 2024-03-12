import {RegionsActionsTypes} from "../actions/RegionsActionsTypes"

const initalRegionsStoreState = {
    state:{
        regions: [],
        pagination:{
            currentPageNumber: 1,
            totalPageNumber: 0,
            searchReachInput: "",
            limitPageNumber: 10
        },
        currentRegionReaches:[],
        isVisible: false
    },
    actions:{}
}


const regionsReducer = (state, action) => {
    switch (action.type) {
        case RegionsActionsTypes.load_regions:
            console.log(state,action)
            return {
                ...state,
                state: {
                    ...state.state,
                    regions: action.payload
                }
            }
        case RegionsActionsTypes.add_region:
            return {
                ...state,
                state: {
                    ...state.state,
                    regions: [...state.state.regions, action.payload]
                }
            }
        case RegionsActionsTypes.set_total_page_number:
            return {
                ...state,
                state: {
                    ...state.state,
                    pagination: {
                        ...state.state.pagination,
                        totalPageNumber: action.payload
                    }
                }
            }
        case RegionsActionsTypes.update_current_page:
            return {
                ...state,
                state: {
                    ...state.state,
                    pagination: {
                        ...state.state.pagination,
                        currentPageNumber: action.payload
                    }
                }
            }
        case RegionsActionsTypes.update_current_region_reaches:
            return {
                ...state,
                state: {
                    ...state.state,
                    currentRegionReaches: action.payload
                }
            }
        case RegionsActionsTypes.set_search_input:
            return {
                ...state,
                state: {
                    ...state.state,
                    pagination: {
                        ...state.state.pagination,
                        searchReachInput: action.payload
                    }
                }
            }
        case RegionsActionsTypes.set_is_visible:
            return {
                ...state,
                state: {
                    ...state.state,
                    isVisible: action.payload
                }
            }
        default:
            return state;
    }
}

export {regionsReducer, initalRegionsStoreState}