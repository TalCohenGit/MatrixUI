import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Toast = ({ isOpen, text, handleClose }) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={60000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <Alert
        variant="filled"
        dir="ltr"
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%" }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
