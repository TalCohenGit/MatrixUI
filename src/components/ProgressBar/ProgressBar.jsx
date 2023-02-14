import React, { useEffect, useState } from "react";

import { LinearProgress, Box, Typography } from "@mui/material";
import { useLoggerApi } from "../../hooks/useLogerApi";

const ProgressBar = ({ isInProgress, progressValue }) => {
  const [pval, setPval] = useState(null);
  const isStuck = useLoggerApi(pval, 200000);
  useEffect(() => {
    setPval(progressValue);
    console.log({ isStuck });
    if (isStuck) {
      console.log("tal say is stuck !!!!!", isStuck);
    }
  }, [progressValue]);

  return (
    isInProgress && (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" value={progressValue} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(progressValue)}%`}</Typography>
          </Box>
        </Box>
      </>
    )
  );
};

export default ProgressBar;
