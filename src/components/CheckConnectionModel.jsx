import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

import CircularProgress from "@mui/material/CircularProgress";
// const MsgsServerURL = process.env.REACT_APP_MSGS_URL;
const msgsServerURL = "http://localhost:5000";
const getNewQrCode = async () => {
  fetch(msgsServerURL + "/api/getQr", { mode: "no-cors" })
    .then((res) => {
      console.log(res);
      return res.body.json();
    })
    .then((data) => {
      console.log({ data });
      return data;
    });
};
const getUsserState = async (setCurrentState) => {
  console.log("in get usser state");
  return await getUserState().then(async (data) => {
    console.log("in get user state: ", { data });
    return (await data?.status) ? setCurrentState("תקין") : data?.data?.server ? setCurrentState("תקלת שרת") : setCurrentState("יש לסרוק");
  });
};

function CheckConnectionModel() {
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState("בודק שרת וואטסאפ");
  const [dialogKey, setDialogKey] = useState("");
  const useDialogRef = useRef(null);
  const [qr, setQr] = useState("");

  useEffect(() => {
    getUsserState(setCurrentState)
      .then((data) => data)
      .then((data) => {
        console.log({ data });
        console.log("ssss", data);
        if (data?.status) setCurrentState("שרת תקין");
        else data?.data?.server ? setCurrentState("תקלת שרת") : setCurrentState("יש לסרוק");
      })
      .finally(() => console.log("finished"));
  }, []);

  const getQr = async () => {
    console.log("in getQr");
    setLoading(true);
    await getNewQrCode()
      .then((res) => {
        console.log({ qr, newQr: res });
        setLoading(false);
        res !== qr && setQr(res);
      })
      .catch((e) => console.log({ e }));
    const qrInterval =
      (async () => {
        console.log("cycle");
        const usserState = await getUsserState();
        console.log({ usserState });
        if (usserState?.status) {
          clearInterval(qrInterval);
          return;
        }
        getNewQrCode()
          .then((res) => {
            res.data !== qr && setQr(res.data);
          })
          .catch((e) => console.log({ e }));
      },
      [5000]);
  };

  return (
    <div>
      <p>{currentState}</p>
      {currentState == "יש לסרוק" && (
        <button
          onClick={() => {
            console.log("scan");
            setDialogKey(crypto.randomUUID());
            getQr();

            useDialogRef?.current?.showModal();
          }}
        >
          סרוק
        </button>
      )}
      <dialog ref={useDialogRef}>
        <div key={dialogKey}>
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

// const getNewQrCode = async () => {
//   let data = JSON.stringify({
//     password: "eeeeeeeqwqww",
//     numbers: [972506655699],
//     msg: "בדיקה של שליחה ללקוחות",
//   });

//   let config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: msgsServerURL + "/api/getQr",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   return axios
//     .request({ ...config, withCredentials: false, "Cache-Control": "no-cache" })
//     .then((response) => response.data)
//     .then((data) => {
//       console.log({ data });
//       return data;
//     })
//     .catch((error) => ({ status: false, data: { Error: error, server: true } }));
// };
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
