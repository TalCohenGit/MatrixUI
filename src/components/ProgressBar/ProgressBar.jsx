import React, { useEffect, useState } from "react";

import { LinearProgress, Box, Typography } from "@mui/material";
import { useLoggerApi } from "../../hooks/useLogerApi";

const ProgressBar = ({ isInProgress, progressValue }) => {
  const [pval, setPval] = useState(null);
  const isStuck = useLoggerApi(pval, 200000);

  //[
  // RowPosition: idx,
  // DocumentID: matrixesData.matrixesData.mainMatrix.DocumentID[idx],
  // AccountKey: matrixesData.matrixesData.mainMatrix.AccountKey[idx],
  // forProduce: false,
  // errors: [{ number: 1001, content: "invalide document type" }] | null,
  //]
  useEffect(() => {
    setPval(progressValue.prec);
    console.log({ isStuck });
    if (isStuck) {
      console.log("tal say is stuck !!!!!", isStuck);
    }
    if (progressValue?.content?.stageName == "finish") {
      console.log("tal do somthing with it !!!!", progressValue?.content?.errors.errorsMatrix);
    }
  }, [progressValue]);

  return (
    isInProgress && (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" value={progressValue.prec} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(progressValue.prec)}%`}</Typography>
          </Box>
        </Box>
      </>
    )
  );
};

export default ProgressBar;
