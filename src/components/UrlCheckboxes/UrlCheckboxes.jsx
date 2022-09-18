import React, { useEffect, useState } from "react";
import { customerNumbers } from "../../utils/utils";
import "./UrlCheckboxes.scss";
import PropTypes from "prop-types";

const UrlCheckboxes = ({ producedUrls, toggleModal }) => {
  const [printUrls, setPrintUrls] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const handleChange = (url) => {
    const currentUrls = [...printUrls];
    const urlIndex = currentUrls.findIndex((urlObj) => {
      return urlObj.url === url;
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

  const sendToPrint = () => {
    printUrls
      .filter((urlObj) => urlObj.checked)
      .forEach((urlObj) => {
        window.open(urlObj.url, urlObj.url, "PRINT", "height=400,width=600");
      });
  };
  const urls = printUrls.map((urlObj) => {
    const { url, checked } = urlObj;
    return (
      <div key={url} className="url-row">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => handleChange(url)}
        />
        <a href={url}>{url}</a>
        <br />
      </div>
    );
  });

  useEffect(() => {
    const parsedPrintUrls = producedUrls.map((url) => {
      return { checked: false, url };
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
          onClick={() => sendToPrint()}
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
