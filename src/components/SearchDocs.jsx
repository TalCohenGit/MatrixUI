import React from "react";
import NoResults from "./NoResults";

const SearchDocs = ({ noResults }) => {
  return noResults ? <NoResults>לא נמצאו מסמכים</NoResults> : <div />;
};


export default SearchDocs;
