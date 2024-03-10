import React, { useReducer } from 'react';
import { regionsFormReducer, regionsFormInitialState } from '../../store/reducers/RegionsFormReducer';
import { regionsFormsActionsTypes } from '../../store/actions/RegionsFormsActionsTypes';


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
    const set_is_visible = (isVisible) => {
        dispatch({
            type: regionsFormsActionsTypes.set_is_visible,
            is_visible: isVisible,
        });
    }


    return {
        addForms,
        addSubForm,
        deleteAllSubForms,
        deleteSubForm,
        addRegionFormType,
        set_is_visible
    };
    
}

export { useAddRegionForm }