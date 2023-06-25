import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import CircularProgress from "@mui/material/CircularProgress";
const msgsServerURL = process.env.REACT_APP_MSGS_URL;
function CheckConnectionModel() {
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState("בודק שרת וואטסאפ");

  const useDialogRef = useRef(null);
  const [qr, setQr] = useState("");

  useEffect(() => {
    getUserState()
      .then((data) => data)
      .then((data) => {
        console.log({ data });
        console.log("ssss", data);
        if (data.status) setCurrentState("שרת תקין");
        else data?.data?.server ? setCurrentState("תקלת שרת") : setCurrentState("יש לסרוק");
      });
  }, []);

  const getQr = async () => {
    console.log("in getQr");
    setLoading(true);
    const res = await getNewQrCode()
      .then((res) => {
        setLoading(false);
        setQr(res.data);
      })
      .catch((e) => console.log({ e }));
  };

  const getUsserState = async () =>
    getUserState().then((data) =>
      data?.status ? setCurrentState("תקין") : data?.data?.server ? setCurrentState("תקלת שרת") : setCurrentState("יש לסרוק")
    );
  return (
    <div>
      <p>{currentState}</p>
      {currentState == "יש לסרוק" && (
        <button
          onClick={() => {
            getQr();
            useDialogRef?.current?.showModal();
          }}
        >
          סרוק
        </button>
      )}
      <dialog ref={useDialogRef}>
        <div>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={qr} viewBox={`0 0 256 256`} />{" "}
            </div>
          )}
          <button
            onClick={() => {
              useDialogRef.current && useDialogRef.current.close();

              getUsserState();
            }}
          >
            סגור
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default CheckConnectionModel;

// const checkServerStatus = async () => {
//   let data = JSON.stringify({
//     password: "eeeeeeeqwqww",
//     numbers: [972500000100, 972506655699, 972509881787],
//     msg: "server ok",
//   });

//   let config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: "http://localhost:5000/api/sendMsgs",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   return axios
//     .request({ ...config, withCredentials: false })
//     .then((response) => response.data)
//     .catch((error) => ({ status: false, data: { Error: error, server: true } }));
// };

const getNewQrCode = async () => {
  let data = JSON.stringify({
    password: "eeeeeeeqwqww",
    numbers: [972506655699],
    msg: "בדיקה של שליחה ללקוחות",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: msgsServerURL + "/api/getQr",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios
    .request({ ...config, withCredentials: false })
    .then((response) => response.data)
    .then((data) => {
      console.log({ data });
      return data;
    })
    .catch((error) => ({ status: false, data: { Error: error, server: true } }));
};
const getUserState = async () => {
  let data = JSON.stringify({
    password: "eeeeeeeqwqww",
    numbers: [972506655699],
    msg: "בדיקה של שליחה ללקוחות",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: msgsServerURL + "/api/userState",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios
    .request({ ...config, withCredentials: false })
    .then((response) => response.data)
    .then((data) => {
      console.log({ data });
      return data;
    })
    .catch((error) => ({ status: false, data: { error: error, server: true } }));
};
