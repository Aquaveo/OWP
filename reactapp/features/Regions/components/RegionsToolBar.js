import React from 'react';
import { FormGroup,Input,SubmitButton } from 'components/UI/StyleComponents/Form.styled';
import {FlexContainer} from 'components/UI/StyleComponents/ui';
import { Paginate } from './Paginate';
const RegionToolBar = (
    {
        currentPageNumber,
        totalPageNumber,
        updateCurrentPage,
        setInputSearchTerm
    }
)=>{
    const handleSearchInputChange = () => {
        const valueSearch = document.getElementById('search_reach').value;
        //console.log(valueSearch);
        setInputSearchTerm(valueSearch)
    };
    // setInputSearchTerm(e.target.value);

    return(
        <FormGroup>
            <FlexContainer>
            <Input
                id="search_reach"
                placeholder='Type a Reach ID or Name'
                type="text"
                size="sm"
                multiple
                onChange={(e) => {
                    //console.log(e.target.value);
                    if(!e.target.value){
                        setInputSearchTerm(e.target.value);
                    }
                    // rest.onChange([...e.target.files]);
                    // if (onChange) onChange(e);
                }}

            />
            <SubmitButton onClick={()=>{handleSearchInputChange()}}  >Search</SubmitButton>

            </FlexContainer>


            {totalPageNumber > 1 &&  //  make sure we have more than one page to show the pagination
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
