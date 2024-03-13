import React, { useState } from "react"
import '../styles/paginate.css'

export const Paginate = ({
  totalPageNumber, 
  updateCurrentPage,
  currentPageNumber
}) => {
    let items = [];
    let leftSide = currentPageNumber - 1;
    if(leftSide <= 0 ) leftSide=1;
    let rightSide = currentPageNumber + 1;
    if(rightSide>totalPageNumber) rightSide = totalPageNumber;
    for (let number = leftSide ; number <= rightSide; number++) {
      items.push(
        <div key={number} className={(number === currentPageNumber ? 'round-effect-pagination active-pagination' : 'round-effect-pagination')} onClick={()=>{ updateCurrentPage(number)}}>
          {number}
        </div>,
      );
    }
  const nextPage = () => {
    if(currentPageNumber<totalPageNumber){
      console.log("nextPage")
      updateCurrentPage(currentPageNumber+1)
    }
  }
  
  const prevPage = () => {
    if(currentPageNumber>1){
      console.log("prevPage")
      updateCurrentPage(currentPageNumber-1)
    }
  }
  const firstPage = () => {
    if(currentPageNumber>1){
      console.log("firstPage")
      updateCurrentPage(1);
    }
  }
  const lastPage = () => {
    console.log("lastPage")

    if(currentPageNumber> 0 ){
      updateCurrentPage(totalPageNumber);
    }
  }

    const paginationRender = (
      <div className="flex-container-pagination">        
        <div className="paginate-ctn">
          <div className="round-effect-pagination" onClick={firstPage}> &lsaquo;&lsaquo; </div>
          <div className="round-effect-pagination" onClick={prevPage}> &lsaquo; </div>
          {/* {items} */}
          <div className="round-effect-pagination" onClick={nextPage}> &rsaquo; </div>
          <div className="round-effect-pagination" onClick={lastPage}> &rsaquo;&rsaquo; </div>
        </div>
      </div>
    );
    return (paginationRender);
  }
  