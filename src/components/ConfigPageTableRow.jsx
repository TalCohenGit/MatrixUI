import React from "react";

const ConfigPageTableRow = ({ firstCell, secondCell }) => {
  return (
    <div className="config-page-row-table">
      <div className="config-page-row-table-cell">{firstCell}</div>
      <div className="config-page-row-table-cell">{secondCell}</div>
    </div>
  );
};

export default ConfigPageTableRow;
