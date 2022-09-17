import React, { useEffect, useState } from "react";
import { customerNumbers } from "../../utils/utils";
import "./UrlCheckboxes.scss";
import PropTypes from "prop-types";

const UrlCheckboxes = ({ producedUrls }) => {
  const [printUrls, setPrintUrls] = useState([]);

  const handleChange = (url) => {
    const currentUrls = [...printUrls];
    const urlIndex = currentUrls.findIndex((urlObj) => {
      return urlObj.url === url;
    });
    currentUrls[urlIndex].checked = !currentUrls[urlIndex].checked;
    setPrintUrls(currentUrls);
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

  return <div>{urls}</div>;
};

UrlCheckboxes.propTypes = {
  producedUrls: PropTypes.array.isRequired,
  matrixData: PropTypes.array.isRequired
};

export default UrlCheckboxes;
