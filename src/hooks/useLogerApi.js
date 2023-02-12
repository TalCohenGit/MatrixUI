import { useEffect, useState } from "react";
import axios from "axios";

//https://script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec?type=updatedocslog&pb=JJJJJJJ
const updateErrorLogApi = (data) => {
  console.log("updateErrorLogApi");
  const stringefyProgressBar = JSON.stringify(data);
  console.log(stringefyProgressBar);
  fetch(
    `https://script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec?type=updatedocslog&pb=${stringefyProgressBar}`,
    { mode: "no-cors" }
  );
};

export const useLoggerApi = (data, delay) => {
  const [isStuck, setIsStack] = useState(false);

  useEffect(() => {
    if (!delay) return updateErrorLogApi(data);
    const handler = setTimeout(() => {
      setIsStack(true);
      updateErrorLogApi(data);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [data, delay]);
  return isStuck;
};

export const molestLoggerApi = (data) => {
  console.log("molest loger api....", data);
  updateErrorLogApi(data);
  return true;
};

//script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec?type=getdocslog
