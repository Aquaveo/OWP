import React, { useReducer } from 'react';
import { regionsFormReducer, regionsFormInitialState } from '../store/reducers/regionsFormReducer';
import { regionsFormsActionsTypes } from '../store/actions/HydroShareRegionsActionsTypes';


const useAddRegionForm = () => {
    const [{ state: { addForms } }, dispatch] = useReducer(regionsFormReducer, regionsFormInitialState);

    const toggleFormVisibility = (formName) => {
        dispatch({
            type: regionsFormsActionsTypes.toggle_form_visibility,
            payload: { formName },
        });
    };

    const addRegionFormType = (formType) => {
        dispatch({
            type: regionsFormsActionsTypes.add_region_form_types,
            payload: [formType],
        });
    };
    const setOnlyFormVisible = (formName) => {
        dispatch({
            type: regionsFormsActionsTypes.set_single_form_visible,
            payload: formName // The form you want to be visible
        });
    }

    return {
        addForms,
        toggleFormVisibility,
        addRegionFormType,
        setOnlyFormVisible
    };
    
}

export { useAddRegionForm }