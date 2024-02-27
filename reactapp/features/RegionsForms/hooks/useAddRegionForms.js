import React, { useReducer } from 'react';
import { regionsFormReducer, regionsFormInitialState } from '../store/reducers/regionsFormReducer';
import { regionsFormsActionsTypes } from '../store/actions/RegionsFormsActionsTypes';


const useAddRegionForm = () => {
    const [{ state: { addForms } }, dispatch] = useReducer(regionsFormReducer, regionsFormInitialState);

    const addSubForm = (formType) => {
        dispatch({
            type: regionsFormsActionsTypes.add_sub_form,
            subForm: formType,
        });
    }

    const deleteSubForm = (subFormId) => {
        dispatch({
            type: regionsFormsActionsTypes.delete_sub_form,
            subFormId: subFormId,
        });
    }

    const addRegionFormType = (formType) => {
        dispatch({
            type: regionsFormsActionsTypes.add_region_form_types,
            payload: [formType],
        });
    };
    const deleteAllSubForms = () => {
        dispatch({
            type: regionsFormsActionsTypes.delete_all_sub_forms,
        });
    }


    return {
        addForms,
        addSubForm,
        deleteAllSubForms,
        deleteSubForm,
        addRegionFormType,
    };
    
}

export { useAddRegionForm }