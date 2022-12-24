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

  const location = useLocation();

  console.log("ttttt", selectedAction, selectedDoc, docsAmount, canMakeRefound);

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
      <ConfigPageTable/>
      <RegisterConfigUserDetails location={location} />
    </div>
  );
};

export default ConfigPage;
