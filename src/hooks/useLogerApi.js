import { useEffect, useState } from "react";
import axios from "axios";
const updateErrorLogApi = (data) => {
  const stringefyProgressBar = JSON.stringify(data);

  axios.get(
    `https://script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec?type=updatedocslog&pb=${stringefyProgressBar}`,
    { withCredentials: false }
  );
};

function useLoggerApi(data, delay) {
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
}

export default useLoggerApi;

export const molestLoggerApi = (data) => {
  console.log("molest loger api....", data);
  updateErrorLogApi(data);
  return true;
};

//script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec?type=getdocslog
