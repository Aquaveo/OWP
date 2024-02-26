import { regionsFormsActionsTypes } from "../actions/HydroShareRegionsActionsTypes";



const regionsFormInitialState={
    state:{
        addForms:{
            regionFormTypes: [
                { value: 'geometry', label: 'Region from Geometry' },
                { value: 'hydroshare', label: 'Region from Hydroshare' },
                { value: 'reachesList', label: 'Region from Reaches List' },
            ],
            visibleForms:{
                hydroShareRegionForm: false,
                reachListRegionForm: false,
                geometryRegionForm: false,
            }
        }
    },
    actions:{
        onSubmitForm: null,
    }
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
        
        case regionsFormsActionsTypes.toggle_form_visibility:
            // Corrected to use action.payload for toggling form visibility
            const { formName } = action.payload; // Destructure formName from action.payload
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        visibleForms: {
                            ...state.state.addForms.visibleForms,
                            [formName]: !state.state.addForms.visibleForms[formName], // Corrected toggle syntax
                        },
                    },
                },
            };

        case regionsFormsActionsTypes.set_single_form_visible:
            const formToBeVisible = action.payload; // Assuming payload is the form name to be visible
            const updatedVisibleForms = Object.keys(state.state.addForms.visibleForms).reduce((acc, formName) => {
                acc[formName] = (formName === formToBeVisible);
                return acc;
            }, {});
            return {
                ...state,
                state: {
                    ...state.state,
                    addForms: {
                        ...state.state.addForms,
                        visibleForms: updatedVisibleForms,
                    },
                },
            };


        default:
            return state; // In case of an unrecognized action, return the current state
    }
}

export { regionsFormReducer, regionsFormInitialState}