import React from "react";
import PropTypes from "prop-types";
import NoResults from "./NoResults";

const SearchDocs = ({ noResults }) => {
  return noResults ? <NoResults>לא נמצאו מסמכים</NoResults> : <div />;
};

SearchDocs.propTypes = {};

export default SearchDocs;
