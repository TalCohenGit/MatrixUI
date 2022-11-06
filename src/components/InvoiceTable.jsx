import React from "react";
import PropTypes from "prop-types";

const InvoiceTable = ({ tableData,tableHeader }) => {
  return (
    <table>
      <thead>
        <tr>
          {tableHeader.map((tHead) => {
            return <th>{tHead}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tableData.map((invoice) => {
          const invoiceKeys = Object.keys(invoice);
          return (
            <tr key={invoice.DocNumber}>
              {invoiceKeys.map((key) => (
                <td key={key}>{invoice[key]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

InvoiceTable.propTypes = {
    tableData:PropTypes.array.isRequired,
    tableHeader:PropTypes.array.isRequired
};

export default InvoiceTable;
