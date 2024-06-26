import { regionsFormsActionsTypes } from "../actions/RegionsFormsActionsTypes";



const regionsFormInitialState={
    state:{
        addForms:{
            regionFormTypes: [
                { value: 'geometry', label: 'Region from Geometry' },
                { value: 'hydroshare', label: 'Region from Hydroshare' },
                { value: 'reachesList', label: 'Region from Reaches List' },
            ],
            subForms:[],
            isVisible: false
        }
    },
    actions: {}
}


const regionsFormReducer = (state, action) => {
    switch (action.type) {
        case regionsFormsActionsTypes.add_region_form_types:
            // Corrected to use action.payload for adding new form types
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        regionFormTypes: [
                            ...state.state.addForms.regionFormTypes,
                            ...action.payload // Corrected from action.formType to action.payload
                        ],
                    },
                },
            };
        case regionsFormsActionsTypes.delete_region_form_types:
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        regionFormTypes: state.state.addForms.regionFormTypes.filter(
                            (formType) => formType.value !== action.formType
                        ),
                    },
                },
            };
        case regionsFormsActionsTypes.add_sub_form:
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        subForms: [
                            ...state.state.addForms.subForms,
                            action.subForm,
                        ],
                    },
                },
            };
        case regionsFormsActionsTypes.delete_sub_form:
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        subForms: state.state.addForms.subForms.filter(
                            (subForm) => subForm.id !== action.subFormId
                        ),
                    },
                },
            };

        case regionsFormsActionsTypes.delete_all_sub_forms:
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        subForms: [],
                    },
                },
            };
        case regionsFormsActionsTypes.set_is_visible:
            //console.log("set_is_visible", action.is_visible);
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        isVisible: action.is_visible,
                    },
                },
            };
        case regionsFormsActionsTypes.set_regions_form_types:
            //console.log(action.formTypes)
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        regionFormTypes: action.formTypes,
                    },
                },
            };
        default:
            return state; // In case of an unrecognized action, return the current state
    }
}

export { regionsFormReducer, regionsFormInitialState}