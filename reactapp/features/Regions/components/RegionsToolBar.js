import React, { Fragment, useEffect } from 'react';
import { FormGroup,Label,Input } from 'components/UI/StyleComponents/Form.styled';

import { Paginate } from './Paginate';
const RegionToolBar = (
    {
        currentPageNumber,
        totalPageNumber,
        updateCurrentPage,
        setInputSearchTerm
    }
)=>{

    return(
        <FormGroup>
            
            <Label>Search Reach</Label>
            <Input
                placeholder='Type a Reach ID or Name'
                type="text"
                size="sm"
                multiple
                onChange={(e) => {
                    setInputSearchTerm(e.target.value);
                    // rest.onChange([...e.target.files]);
                    // if (onChange) onChange(e);
                }}
                    // ref={ref}
                />
            {totalPageNumber > 1 && 
                <Paginate 
                    currentPageNumber={currentPageNumber} 
                    totalPageNumber={totalPageNumber} 
                    updateCurrentPage={updateCurrentPage}>
                </Paginate>
            }   
        </FormGroup>
    )

}

export {RegionToolBar}
