import React, { useState } from "react"
import 'css/paginate.css'


export const Paginate = ({
  totalPageNumber, 
  updateCurrentPage,
  currentPageNumber
}) => {
    let items = [];
    let leftSide = currentPageNumber - 4;
    if(leftSide <= 0 ) leftSide=1;
    let rightSide = currentPageNumber + 4;
    if(rightSide>totalPageNumber) rightSide = totalPageNumber;
    for (let number = leftSide ; number <= rightSide; number++) {
      items.push(
        <div key={number} className={(number === currentPageNumber ? 'round-effect-pagination active-pagination' : 'round-effect-pagination')} onClick={()=>{ setCurrentPage(number)}}>
          {number}
        </div>,
      );
    }
  const nextPage = () => {
    if(currentPageNumber<totalPageNumber){
      updateCurrentPage(currentPageNumber+1)
    }
  }
  
  const prevPage = () => {
    if(currentPageNumber>1){
      updateCurrentPage(currentPageNumber-1)
    }
  }
  const firstPage = () => {
    if(currentPageNumber>1){
      updateCurrentPage(1);
    }
  }
  const lastPage = () => {
    console.log("s")

    if(currentPageNumber> 0 ){
      updateCurrentPage(totalPageNumber);
    }
  }

    const paginationRender = (
      <div className="flex-container-pagination">        
        <div className="paginate-ctn">
          <div className="round-effect-pagination" onClick={firstPage}> &lsaquo;&lsaquo; </div>
          <div className="round-effect-pagination" onClick={prevPage}> &lsaquo; </div>
          {items}
          <div className="round-effect-pagination" onClick={nextPage}> &rsaquo; </div>
          <div className="round-effect-pagination" onClick={lastPage}> &rsaquo;&rsaquo; </div>
        </div>
      </div>
    );
    return (paginationRender);
  }
  