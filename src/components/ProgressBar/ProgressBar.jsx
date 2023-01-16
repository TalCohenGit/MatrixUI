import React from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

const ProgressBar = ({ isInProgress, progressValue }) => {
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
