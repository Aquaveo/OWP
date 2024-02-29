import {RegionsActionsTypes} from "../actions/RegionsActionsTypes"

const initalRegionsStoreState = {
    state:{
        regions: []
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
        default:
            return state;
    }
}

export {regionsReducer, initalRegionsStoreState}