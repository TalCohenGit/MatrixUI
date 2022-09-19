import React, { useContext, useRef } from "react";
import { DataContext } from "../context/DataContext";
import PropTypes from "prop-types";
import useClickOutside from "../hooks/useClickOutside";
import { filterCustomers } from "../utils/utils";

const SearchList = ({ matrixData }) => {
  const {
    customers,
    toggleList,
    isListVisible,
    customerName,
    setCustomerName,
  } = useContext(DataContext);

  const clickRef = useRef(null);
  useClickOutside(clickRef, () => toggleList(false));

  
  const handleCustomerClick = (parsedName) => {
    setCustomerName(parsedName);
    toggleList(false);
  };

  const filteredCustomers = customers?.filter(({ userName }) => filterCustomers(userName, customerName));

  const liStyle = (userName) => {
    return matrixData?.length > 1 &&
      matrixData
        .slice(1)
        .map((rowData) => {
          return rowData[0];
        })
        .includes(userName)
      ? { pointerEvents: "none", opacity: "0.5" }
      : { pointerEvents: "auto", opacity: "1" };
  };
  const customersList = filteredCustomers?.map(({ userName }, index) => (
    <li
      key={index}
      onClick={() => handleCustomerClick(userName)}
      style={liStyle(userName)}
    >
      <p>{userName}</p>
    </li>
  ));

  return (
    isListVisible && (
      <div className="search-list" ref={clickRef}>
        <ul>
          {filteredCustomers?.length ? (
            customersList
          ) : (
            <li className="search-list-noMatchFound">
              <p>No match found</p>
            </li>
          )}
        </ul>
      </div>
    )
  );
};

SearchList.propTypes = {
  customerName: PropTypes.string,
  setCustomerName: PropTypes.func,
};

export default SearchList;
