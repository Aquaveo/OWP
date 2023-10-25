import React, { useState } from "react"
import 'css/paginate.css'


export const Paginate = ({
  maxPages, 
  setCurrentPageNumber,
  setCurrentPage,
  currentPage
}) => { 
    // const [currentPage, setCurrentPage] = useState(1);
    // let maxPages = 50;
    let items = [];
    let leftSide = currentPage - 4;
    if(leftSide <= 0 ) leftSide=1;
    let rightSide = currentPage + 4;
    if(rightSide>maxPages) rightSide = maxPages;
    for (let number = leftSide ; number <= rightSide; number++) {
      items.push(
        <div key={number} className={(number === currentPage ? 'round-effect-pagination active' : 'round-effect-pagination')} onClick={()=>{ setCurrentPage(number)}}>
          {number}
        </div>,
      );
    }
  const nextPage = () => {
    if(currentPage<maxPages){
      setCurrentPage(currentPage+1)
    }
  }
  
  const prevPage = () => {
    if(currentPage>1){
      setCurrentPage(currentPage-1)
    }
  }
  
    const paginationRender = (
      <div className="flex-container-pagination">        
        <div className="paginate-ctn">
          <div className="round-effect-pagination" onClick={prevPage}> &lsaquo; </div>
          {items}
          <div className="round-effect-pagination" onClick={nextPage}> &rsaquo; </div>
        </div>
      </div>
    );
    return (paginationRender);
  }
  