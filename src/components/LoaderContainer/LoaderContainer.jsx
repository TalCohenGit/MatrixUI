import React from "react";
import { CircularProgress } from "@mui/material";
import "./LoaderContainer.scss";

const LoaderContainer = () => {
  return (
    <div className="LoaderContainer">
      <CircularProgress />
    </div>
  );
};

export default LoaderContainer;
