import React, { useContext, useEffect, useState } from "react";
import "./UrlCheckboxes.scss";
import PropTypes from "prop-types";
import { getUsserMessageAPI, mergePdfAPI, sendMsgsAPI } from "../../api";
import InvoiceTable from "../InvoiceTable";
import { getInternationalNum } from "../../utils/utils";
import { Tooltip } from "@mui/material";
const test = true;
const urlrr = test ? "http://localhost:3000/api/cach/get" : "https://bizmode-featchers.vercel.app/api/cach/get";

const date = new Date();

const options = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jerusalem",
};

const setLocalStorageItems = ({ matrixData, invoiceData }) => {
  const tz = date.toLocaleString("he-IL", options);
  fetch(urlrr, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      type: "SET",
      adminId: "1234",
      app: "bizims",
      db_key: "msgs_data",
      data: { matrixData, invoiceData, tz },
      limit: 5,
    }),
  }).then((res) => {
    console.log("stored items:", { res });
  });
};

const UrlCheckboxes = ({ axiosPrivate, invoiceData, toggleModal, matrixData }) => {
  const [invoiceTableData, setInvoiceTableData] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const date = setLocalStorageItems({ matrixData, invoiceData });
  const handleChange = (url) => {
    const currentInvoiceTableData = [...invoiceTableData];
    const invoiceIndex = currentInvoiceTableData.findIndex((invoiceObject) => {
      return invoiceObject.DocUrl === url;
    });
    currentInvoiceTableData[invoiceIndex].checked = !currentInvoiceTableData[invoiceIndex].checked;
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
    console.log({ matrixData });
    const msgs = [];
    const numbers = [];
    let businessName = localStorage.getItem("businessName");
    businessName = businessName ? businessName : "";
    console.log("businessName", businessName);
    const usserMessage = await getUsserMessageAPI();

    console.log({});
    filteredUrls.map((checkedUrl) => {
      const url = checkedUrl["DocUrl"];
      const accountName = checkedUrl["Accountname"];
      const docNumber = checkedUrl["DocNumber"];
      const phoneNumber = matrixData.filter((r) => r[0] == accountName)[0][2];
      const fixedNum = getInternationalNum(usserMessage?.inTesting ? usserMessage?.testingNum : phoneNumber);
      // console.log({ url, accountName, docNumber, phoneNumber, fixedNum });
      // the returned object !!
      // {
      //   businessNameText: "הודעה מעסק ",
      //   castumerNameText: "שלום",
      //   invoiceText: "מצורפת בזאת חשבונית מס ",
      //   inTesting: false,
      //   testingNum: ""
      //   }
      console.log("accountName", accountName);
      console.log("docNumber", docNumber);
      console.log("url", url);

      const msg =
        `${usserMessage?.businessNameText ?? "הודעה מעסק"} ${businessName}\n` +
        `${usserMessage?.castumerNameText ?? " שלום"} ${accountName}\n` +
        `${usserMessage?.invoiceText ?? "מצורפת בזאת חשבונית מס "}${docNumber}\n` +
        `${url}`;
      console.log("msg: ", msg);
      msgs.push(msg);
      numbers.push(fixedNum);
    });
    console.log({ numbers, msgs });
    await sendMsgsAPI(numbers, msgs);
  };

  const invoiceDataToShow = invoiceTableData.map((invoice) => {
    const { DocUrl, checked } = invoice;
    return {
      ...invoice,
      checked: <input type="checkbox" checked={checked} onChange={(e) => handleChange(DocUrl)} />,
      DocUrl: <a href={DocUrl}>קישור למסמך</a>,
    };
  });

  useEffect(() => {
    const parsedInvoiceData = invoiceData.map((invoice) => {
      return { checked: false, ...invoice };
    });
    setInvoiceTableData(parsedInvoiceData);
  }, []);

  useEffect(() => {}, [invoiceData]);

  const checkAllHeader = (
    <div className="url-row">
      <input type="checkbox" checked={checkAll} onChange={(e) => handleCheckAll()} />
      <p>בחר הכל</p>
      <br />
    </div>
  );

  // const hasPermission = localStorage.getItem("whatsapp") === "true";
  const hasPermission = true;
  const sendingDisabled = invoiceTableData.every((urlObj) => !urlObj.checked);
  const enableMessagesFeature = hasPermission && !sendingDisabled;

  return (
    <>
      {invoiceDataToShow?.length ? (
        <InvoiceTable
          tableData={invoiceDataToShow}
          tableHeader={[checkAllHeader, "קישור", "שם", "מס פעולה", "תאריך", "סכום", "מס' מסמך", "מס' טלפון"]}
        />
      ) : null}
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>
        <button className={"send-to-print" + (sendingDisabled ? " disabled" : "")} onClick={() => sendUrlToPrint()}>
          שלח להדפסה
        </button>
        <Tooltip
          title={<p style={{ fontSize: "15px", textAlign: "center" }}>בכדי לאפשר שליחת הודעות עם מסמך מצורף ללקוחות, אנא פנה למייל הבא</p>}
          placement="top"
          disableHoverListener={hasPermission}
        >
          <a
            href="https://bizmode-featchers.vercel.app/featchers/bizims"
            target="_blank"
            className={"send-to-print" + (enableMessagesFeature && "")}
            // className="border-2 border-"
            // onClick={(e) => {
            //   if (enableMessagesFeature) {
            //     sendMessages();
            //   }
            // }}
          >
            שליחת הודעות
          </a>
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
