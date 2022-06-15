import React from "react";

const AddCustomer = ({ customerName, setCustomerName, addCustomerToTable }) => {
  return (
    <div className="addCustomer-wrapper">
      <button className="addCustomer-button" onClick={addCustomerToTable}>
        שלח
      </button>
      <input
        type="text"
        value={customerName}
        placeholder={"הזן שם לקוח"}
        onChange={(e) => setCustomerName(e.target.value)}
        dir="rtl"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addCustomerToTable();
          }
        }}
      />
    </div>
  );
};

export default AddCustomer;
