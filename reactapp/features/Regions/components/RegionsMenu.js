import React,{Fragment, useState} from 'react';
import { RegionsList } from './RegionsList';
import { useRegionsContext } from '../hooks/useRegionsContext';
import { CircularMenu } from 'components/UI/CircularMenu/components/CircularMenu';
import { useAddRegionForm } from '../hooks/forms/useAddRegionForms';
// icons for the circular menu
import { Add } from "@styled-icons/fluentui-system-filled";
import { Minus } from "@styled-icons/boxicons-regular";
import { DataBarHorizontal } from "@styled-icons/fluentui-system-filled";
import {AddRegionForm} from './forms/AddRegionForm';

const RegionsMenu = () => {
  const {state:regionsState, actions:regionsActions} = useRegionsContext();
  const { addForms, set_is_visible } = useAddRegionForm();

  const toggleVisibilityRegionListMenu = () => {
    console.log('toggleVisibilityRegionListMenu');
    regionsActions.setIsVisible(!regionsState.isVisible);
    set_is_visible(false);
  }

  const toggleVisibilityAddRegionMenu = () => {
    regionsActions.setIsVisible(false);
    set_is_visible(!addForms.isVisible);
  }

  // Add Region circular menu items
  const addRegionsItems = [
    { icon: Add, value: "Add region", label: "Add Region", clickEvent:()=>{toggleVisibilityAddRegionMenu()}},
    // { icon: Minus, value: "Delete Region", label: "Delete Region", clickEvent:()=>{console.log('Delete Region Clicked')} },
    { icon: DataBarHorizontal, value: "List Regions", label: "List Regions", clickEvent:()=>{toggleVisibilityRegionListMenu()}},
  ];

 
  return (
    <Fragment>
          {regionsState.isVisible ? <RegionsList/> : null}
          {addForms.isVisible ? <AddRegionForm/> : null}
          <CircularMenu items={addRegionsItems}/>
    </Fragment>

  );
};

export {RegionsMenu}