import React, { useEffect, useState } from "react";
import "./UrlCheckboxes.scss";
import PropTypes from "prop-types";
import { mergePdfAPI, sendMsgsAPI } from "../../api";
import InvoiceTable from "../InvoiceTable";
import { getInternationalNum } from "../../utils/utils";
import { Tooltip } from "@mui/material";

const UrlCheckboxes = ({ axiosPrivate, invoiceData, toggleModal }) => {
  const [invoiceTableData, setInvoiceTableData] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const handleChange = (url) => {
    const currentInvoiceTableData = [...invoiceTableData];
    const invoiceIndex = currentInvoiceTableData.findIndex((invoiceObject) => {
      return invoiceObject.DocUrl === url;
    });
    currentInvoiceTableData[invoiceIndex].checked =
      !currentInvoiceTableData[invoiceIndex].checked;
    if (currentInvoiceTableData.every((urlObj) => urlObj.checked)) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    setInvoiceTableData(currentInvoiceTableData);
  };

  const handleCheckAll = () => {
    setCheckAll(!checkAll);
    const currentUrls = invoiceTableData.map((invoiceObject) => {
      return {
        ...invoiceObject,
        checked: !checkAll,
      };
    });
    setInvoiceTableData(currentUrls);
  };

  const checkedUrl = (urls) => {
    return urls.filter((urlObj) => urlObj.checked);
  };

  const sendUrlToPrint = async () => {
    const filteredUrls = checkedUrl(invoiceTableData);
    let fileURL = filteredUrls[0]["DocUrl"];
    if (filteredUrls.length > 1) {
      const file = await mergePdfAPI(axiosPrivate, filteredUrls);
      fileURL = URL.createObjectURL(file);
    }
    window.open(fileURL, "PRINT", "height=400,width=600");
  };

  const sendMessages = async () => {
    const filteredUrls = checkedUrl(invoiceTableData);
    const msgs = [];
    const numbers = [];
    const businessName = localStorage.getItem("businessName");
    filteredUrls.map((checkedUrl) => {
      const url = checkedUrl["DocUrl"];
      const accountName = checkedUrl["Accountname"];
      const docNumber = checkedUrl["DocNumber"];
      const phoneNumber = checkedUrl["DocumentDetails"];
      const fixedNum = getInternationalNum(phoneNumber);
      const msg =
        `הודעה מעסק ${businessName}\n` +
        `שלום ${accountName}\n` +
        `מצורפת בזאת חשבונית מס ${docNumber}\n` +
        `${url}`;
      console.log("msg: ", msg);
      msgs.push(msg);
      numbers.push("972526544346");
    });
    await sendMsgsAPI(numbers, msgs);
  };

  const invoiceDataToShow = invoiceTableData.map((invoice) => {
    const { DocUrl, checked } = invoice;
    return {
      ...invoice,
      checked: (
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => handleChange(DocUrl)}
        />
      ),
      DocUrl: <a href={DocUrl}>קישור למסמך</a>,
    };
  });

  useEffect(() => {
    const parsedInvoiceData = invoiceData.map((invoice) => {
      return { checked: false, ...invoice };
    });
    setInvoiceTableData(parsedInvoiceData);
  }, []);

  useEffect(() => {
    console.log("fffff");
  }, [invoiceData]);

  const checkAllHeader = (
    <div className="url-row">
      <input
        type="checkbox"
        checked={checkAll}
        onChange={(e) => handleCheckAll()}
      />
      <p>בחר הכל</p>
      <br />
    </div>
  );

  const hasPermission = localStorage.getItem("whatsapp") === "true";
  const sendingDisabled = invoiceTableData.every((urlObj) => !urlObj.checked);
  const enableMessagesFeature = hasPermission && !sendingDisabled;

  return (
    <>
      <InvoiceTable
        tableData={invoiceDataToShow}
        tableHeader={[
          checkAllHeader,
          "קישור",
          "שם",
          "מס פעולה",
          "תאריך",
          "סכום",
          "מס' מסמך",
          "מס' טלפון",
        ]}
      />
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>
        <button
          className={"send-to-print" + (sendingDisabled ? " disabled" : "")}
          onClick={() => sendUrlToPrint()}
        >
          שלח להדפסה
        </button>
        <Tooltip
          title={
            <p style={{ fontSize: "15px", textAlign: "center" }}>
              בכדי לאפשר שליחת הודעות עם מסמך מצורף ללקוחות, אנא פנה למייל הבא
            </p>
          }
          placement="top"
          disableHoverListener={hasPermission}
        >
          <button
            className={
              "send-to-print" + (enableMessagesFeature ? "" : " hasOpacity")
            }
            onClick={(e) => {
              if (enableMessagesFeature) {
                sendMessages();
              }
            }}
          >
            שליחת הודעות
          </button>
        </Tooltip>
      </div>
    </>
  );
};

UrlCheckboxes.propTypes = {
  invoiceData: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UrlCheckboxes;
