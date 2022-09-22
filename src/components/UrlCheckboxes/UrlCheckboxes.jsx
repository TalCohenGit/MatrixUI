import React, { useEffect, useState } from "react";
import "./UrlCheckboxes.scss";
import PropTypes from "prop-types";
import {mergePdfAPI} from "../../api"

const UrlCheckboxes = ({ axiosPrivate, producedUrls, toggleModal }) => {
  const [printUrls, setPrintUrls] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const handleChange = (url) => {
    const currentUrls = [...printUrls];
    const urlIndex = currentUrls.findIndex((urlObj) => {
      return urlObj.DocUrl === url;
    });
    currentUrls[urlIndex].checked = !currentUrls[urlIndex].checked;
    if (currentUrls.every((urlObj) => urlObj.checked)) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    setPrintUrls(currentUrls);
  };

  const handleCheckAll = () => {
    setCheckAll(!checkAll);
    const currentUrls = printUrls.map((urlObj) => {
      return {
        ...urlObj,
        checked: !checkAll,
      };
    });
    setPrintUrls(currentUrls);
  };

  const sendUrlToPrint = async() => {
   const filteredUrls =  printUrls
      .filter((urlObj) => urlObj.checked); 
   let fileURL = filteredUrls[0]["DocUrl"]  
   if(filteredUrls.length > 1) {
    const file = await mergePdfAPI(axiosPrivate, filteredUrls)
    fileURL = URL.createObjectURL(file);
   }
   window.open(fileURL, "PRINT", "height=400,width=600");
  };

  const urls = printUrls.map((urlObj) => {
    const { DocUrl, checked } = urlObj;
    return (
      <div key={DocUrl} className="url-row">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => handleChange(DocUrl)}
        />
        <a href={DocUrl}>{DocUrl}</a>
        <br />
      </div>
    );
  });

  useEffect(() => {
    const parsedPrintUrls = producedUrls.map((url) => {
     url["checked"] = false
     return url
    });
    setPrintUrls(parsedPrintUrls);
  }, []);

  return (
    <>
      <div className="url-row">
        <input
          type="checkbox"
          checked={checkAll}
          onChange={(e) => handleCheckAll()}
        />
        <p>בחר הכל</p>
        <br />
      </div>
      <div>{urls}</div>{" "}
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>
        <button
          className="send-to-print"
          disabled={printUrls.every((urlObj) => !urlObj.checked)}
          onClick={() => sendUrlToPrint()}
        >
          שלח להדפסה
        </button>
      </div>
    </>
  );
};

UrlCheckboxes.propTypes = {
  producedUrls: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UrlCheckboxes;
