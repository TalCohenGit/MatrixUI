const saveTables = async (matrixDate, isBI, action, newIsInitiated, newMatrixName) => {
  const date = getMatrixFormatedDate(matrixDate);
  const newMatrixId = await getMatrixID(action);
  localStorage.setItem("newMatrixId", newMatrixId);

  const { validatedData, cellsData, docCommentsToSend, metaDataToSend } = await getMatrixesData(
    matrixData,
    productsMap,
    matrixComments,
    matrixID,
    action
  );

  const matrixesUiData = JSON.stringify([matrixData, matrixComments, selectedProducts, balanceTableData]);

  const returnedValue = await saveTablesAPI(
    axiosPrivate,
    newMatrixId,
    validatedData,
    matrixesUiData,
    cellsData,
    docCommentsToSend,
    metaDataToSend,
    isBI,
    date,
    newMatrixName,
    productsMap,
    newIsInitiated
  );
  return newMatrixId;

  const expectedReturn = {
    status: "yes" | "no",
    data: any,
    saveStatus: {
      status: "",
    },

    //status: 'yes'
    //zero action
    //status: 'no'
    //data:
    //error:null |{int:str},
    //newName: null |string
    //  תאריך 15-2 משוכפל 3
    // (2) תאריך 15-2 משוכפל 3
  };

  //if(name)
  // update state
  // if(error)
  // show message

  returnValue;
};

const f = {
  1: "תקלה בשרת 2223",
  2: "אמש של משה לא בסדר",
};
