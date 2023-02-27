import React, { useState } from "react";
import Input from "@mui/material/Input";
import { docConfigOptions, actionConfigOptions } from "../utils/constants";
import ConfigPageRowSelect from "../components/ConfigPageRowSelect";
import Checkbox from "@mui/material/Checkbox";
import { useLocation } from "react-router-dom";
import RegisterConfigUserDetails from "../components/RegisterConfigUserDetails";
import ConfigPageTable from "../components/ConfigPageTable";
import { initvalidateAPI, setConfigAPI } from "../api";

const ConfigPage = ({ axiosPrivate }) => {
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
    // warehouse: { radio: "single", input: "" },
    detailsCode: { radio: "single", dataType: "sort", input: "" },
    customersCode: { radio: "single", input: "" },
  });

  const location = useLocation();
  const { inputs, from, erpName } = location.state || {};
  console.log("location", location?.state);

  const parseTableInput = (str) => {
    let splitingChar = "-";
    if (str.includes(",")) {
      splitingChar = ",";
    }
    return str.split(splitingChar).map((el) => Number(el));
  };

  const handleChange = (e) => {
    setSelectedDoc(e);
  };
 
  const getCustomersReport = () => {
    return {
        sortingKey: "קוד מיון",
        sortingType: value.customersCode.radio,
        sortingValue: parseTableInput(value.customersCode.input)
    };
  };

  const getProductsReport = () => {
    return {
      sortingKey: value.detailsCode.dataType,
      sortingType: value.detailsCode.radio,
      sortingValue: parseTableInput(value.detailsCode.input),
    }
  }

  const saveConfig = async () => {
    const res = initvalidateAPI(axiosPrivate, {
      castumers: [getCustomersReport()],
      products: [getProductsReport()]
    }, "reports")
    // if res is ok
    const configData = {
      Reports: {
        defaultReports: {
          castumers: [getCustomersReport()],
          products: [getProductsReport()]
        },
      },
      mtxConfig: {
        // documentDef: {
        //   isDefault: { type: Boolean, default: false },
        //   DocumentNumber: String,
        // },
        docLimit: {
          isLimited: docsAmount > 0,
          Amount: docsAmount ? Number(docsAmount) : null,
        },
        // sumLimit: { isLimited: Boolean, Amount: Number },
        taxDocs: {
          isAllow: isRefoundMaxAmount,
          Refund: {
            // isAllow: {
            //   type: Boolean,
            //   default: true,
            // },
            // isLimited: {
            //   type: Boolean,
            //   default: false,
            // },

            Amount: refoundMaxAmount,
          },
          // Discount: { isAllow: Boolean, isLimited: Boolean, Amount: Number },
          // ObligoPass: { isAllow: Boolean },
        },
      },
      selectedDoc: selectedDoc["value"], //string
      selectedAction: selectedAction["value"], //string
      docsAmount: docsAmount ? Number(docsAmount) : null, // number
      refoundMaxAmount: refoundMaxAmount ? Number(refoundMaxAmount) : null, // number
      detailsCode: value.detailsCode.input.split("-").map((el) => Number(el)), // array of numbers
      customersCode: value.customersCode.input
        .split("-")
        .map((el) => Number(el)), // array of numbers
      erpSelect: {
        ...inputs,
      },
    };
    console.log("configData", configData, from.pathname);
    await setConfigAPI(axiosPrivate, configData);
  };

  if (location?.state?.from?.pathname !== "/erp") {
    return (
      <h1 style={{ textAlign: "center" }}>
        Please go to login page and start the registration process
      </h1>
    );
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
      <ConfigPageTable value={value} setValue={setValue} />
      <RegisterConfigUserDetails location={location} />
      <button
        className="next-button"
        onClick={(e) => {
          saveConfig();
        }}
      >
        המשך לעמוד הבא
      </button>
    </div>
  );
};

export default ConfigPage;
