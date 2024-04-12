import React, { useReducer } from 'react';
import { regionsFormReducer, regionsFormInitialState } from '../store/reducers/RegionsFormReducer';
import { regionsFormsActionsTypes } from '../store/actions/RegionsFormsActionsTypes';


const useAddRegionForm = ({reducer = regionsFormReducer} = {}) => {
    const [state, dispatch] = useReducer(reducer, regionsFormInitialState)
    
    const actions ={
        addForms: (formTypes) => dispatch({
            type: regionsFormsActionsTypes.add_forms,
            formTypes: formTypes,
        }),
        addSubForm: (formType) => dispatch({
            type: regionsFormsActionsTypes.add_sub_form,
            subForm: formType,
        }),
        deleteSubForm: (subFormId) => dispatch({
            type: regionsFormsActionsTypes.delete_sub_form,
            subFormId: subFormId,
        }),
        addRegionFormType: (formType) => dispatch({
            type: regionsFormsActionsTypes.add_region_form_types,
            payload: [formType],
        }),
        deleteAllSubForms: () => dispatch({
            type: regionsFormsActionsTypes.delete_all_sub_forms,
        }),
        set_is_visible: (isVisible) => dispatch({
            type: regionsFormsActionsTypes.set_is_visible,
            is_visible: isVisible,
        }),
        set_regions_form_types: (formTypes) => dispatch({
            type: regionsFormsActionsTypes.set_regions_form_types,
            formTypes: formTypes,
        }),
    }

    return {
        state,
        actions
    };
    
}

export { useAddRegionForm }