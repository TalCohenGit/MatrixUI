import React, { useState } from "react";
import Input from "@mui/material/Input";
import { docConfigOptions, actionConfigOptions } from "../utils/constants";
import ConfigPageRowSelect from "../components/ConfigPageRowSelect";
import Checkbox from "@mui/material/Checkbox";
import { useLocation } from "react-router-dom";
import RegisterConfigUserDetails from "../components/RegisterConfigUserDetails";
import ConfigPageTable from "../components/ConfigPageTable";

const ConfigPage = () => {
  const initialState = {
    value: "none",
    label: "ללא",
  };
  const [selectedDoc, setSelectedDoc] = useState(initialState);
  const [selectedAction, setSelectedAction] = useState(initialState);
  const [docsAmount, setDocsAmount] = useState(null);
  const [canMakeRefound, setCanMakeRefound] = useState(false);
  const [isRefoundMaxAmount, setIsRefoundMaxAmount] = useState(false);
  const [refoundMaxAmount, setRefoundMaxAmount] = useState(null);
  const [value, setValue] = useState({
    warehouse: { radio: "singleChoice", input: "" },
    detailsCode: { radio: "singleChoice", input: "" },
    customersCode: { radio: "singleChoice", input: "" },
  });
  
  const location = useLocation();
  const { inputs,from } = location.state || {};
  console.log("location",location?.state)
  const saveConfig = () => {
    const configData = {
      selectedDoc: selectedDoc["value"], //string
      selectedAction: selectedAction["value"], //string
      docsAmount: docsAmount ? Number(docsAmount) : null, // number
      refoundMaxAmount: refoundMaxAmount ? Number(refoundMaxAmount) : null, // number
      warehouse: value.warehouse.input.split('-').map(el=>Number(el)), // array of numbers
      detailsCode: value.detailsCode.input.split('-').map(el=>Number(el)), // array of numbers
      customersCode: value.customersCode.input.split('-').map(el=>Number(el)), // array of numbers
      erpSelect: {
        ...inputs
      }

    };
    console.log("configData",configData,from.pathname)
  };

  if(location?.state?.from?.pathname !== "/erp") {
    return <h1 style={{textAlign:"center"}}>Please go to login page and start the registration process</h1>
  }


  return (
    <div className="config-page">
      <ConfigPageRowSelect
        options={docConfigOptions}
        label={"סוג מסמך ברירת מחדל"}
        selectedOption={selectedDoc}
        handleChange={setSelectedDoc}
      />
      <ConfigPageRowSelect
        options={actionConfigOptions}
        label={"סוג פעולה ברירת מחדל"}
        selectedOption={selectedAction}
        handleChange={setSelectedAction}
      />
      <div className="config-page-row">
        <p>הגבלת כמות מסמכים</p>
        <Input
          value={docsAmount}
          dir="rtl"
          name="docsAmount"
          onChange={(e) => setDocsAmount(e.target.value)}
          placeholder="כמות"
          type="number"
        />
      </div>
      <div className="config-page-row">
        <p>מורשה לזכות</p>
        <Checkbox
          checked={canMakeRefound}
          onChange={(e) => setCanMakeRefound(e.target.checked)}
        />
        <p>סכום מקסימום</p>
        <Checkbox
          checked={isRefoundMaxAmount}
          onChange={(e) => setIsRefoundMaxAmount(e.target.checked)}
        />
        {canMakeRefound && isRefoundMaxAmount && (
          <Input
            value={refoundMaxAmount}
            dir="rtl"
            name="refoundMaxAmount"
            onChange={(e) => setRefoundMaxAmount(e.target.value)}
            placeholder="סכום"
            type="number"
          />
        )}
      </div>
      <ConfigPageTable
        value={value}
        setValue={setValue}
      />
      <RegisterConfigUserDetails location={location} />
      <button
        className="next-button"
        onClick={(e) => {
          saveConfig()
        }}
      >
        המשך לעמוד הבא
      </button>
    </div>
  );
};

export default ConfigPage;
