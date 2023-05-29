import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { getMatrixIDAPI, saveTablesForDriversAPI, saveSelectedDriversMatrixID } from "../api";
import { savingAction, savingAsAction } from "../utils/constants";
import { getMatrixesData } from "../utils/utils";
import { formatDateWhenSaving } from "../utils/utils";
const getSavedValue = async (key, axiosPrivate, getMatrixIDAPI) => {
  let action = "";
  let newMatrixId = "";
  if (typeof window === "undefined") return;

  const storageType = localStorage.getItem(key);

  if (storageType) {
    action = savingAction;

    return storageType;
  }
  newMatrixId = await getMatrixIDAPI(axiosPrivate);

  localStorage.setItem("driversMatrixID", newMatrixId);

  action = savingAsAction;

  return { newMatrixId, action };
};

const getSaveVersion = () => {
  return crypto.randomUUID().slice(0, 5);
};

export const SaveDriversMatrix = async (
  axiosPrivate,
  productsMap,
  newMatrixName,
  matrixDate,
  matrixData,
  matrixComments,
  selectedProducts,
  balanceTableData,
  matrixID
) => {
  const { newMatrixId, action } = await getSavedValue("newDriversMatrixId", axiosPrivate, getMatrixIDAPI);

  const date = formatDateWhenSaving(matrixDate);

  const { validatedData, cellsData, docCommentsToSend, metaDataToSend } = await getMatrixesData(
    matrixData,
    productsMap,
    matrixComments,
    matrixID,
    action
  );

  const matrixesUiData = JSON.stringify([matrixData, matrixComments, selectedProducts, balanceTableData]);
  console.log(
    { axiosPrivate, newMatrixId, validatedData, matrixesUiData, cellsData, docCommentsToSend, metaDataToSend, date, productsMap },
    newMatrixName + "נהגים" + getSaveVersion()
  );
  const returnedValue = await saveTablesForDriversAPI(
    axiosPrivate,
    newMatrixId,
    validatedData,
    matrixesUiData,
    cellsData,
    docCommentsToSend,
    metaDataToSend,
    date,
    newMatrixName + "נהגים" + getSaveVersion(),
    productsMap
  )
    .then(() => saveSelectedDriversMatrixID(newMatrixId))
    .catch((error) => console.log("error in save matrix to drivers", { error }));
  console.log({ returnedValue });
  //   return true;
};
