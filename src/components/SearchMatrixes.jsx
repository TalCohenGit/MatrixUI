import { set } from "lodash";
import React, { useState, useEffect, useRef, useContext } from "react";
import Select from "react-select";
import { nameChecker } from "./Modals/CopyDataModal";
import NoResults from "./NoResults";
import { DataContext } from "../context/DataContext";
const SearchMatrixes = ({
  matrixesDetails,
  loadTablesByID,
  noResults,
  isMatrixNames,
  setNewMatrixName,
}) => {
  //   itemKey
  // :
  // "6025"
  // tel
  // :
  // "523640654"
  // userName
  // :
  // "תנובת השדה"
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState({});
  const [updateName, setUpdateName] = useState(false);
  console.log({ matrixesDetails });
  const [castumersIds, setCastumersId] = useState();
  const [didentOrderd, setDidentOrderd] = useState();
  const { customers } = useContext(DataContext);
  const useDialogRef = useRef(null);
  useEffect(() => {
    if (matrixesDetails) {
      let newArray = [];
      matrixesDetails.forEach(
        (e) =>
          (newArray = [
            ...newArray,
            ...e.fullMatrix.matrixesData.mainMatrix.AccountKey,
          ])
      );
      setCastumersId([...new Set(newArray)]);
      // setCastumersId((prev) => {
      //   console.log("castumers ids", { prev });
      // });
    }
    console.log({ customers, didentOrderd });
  }, [matrixesDetails?.length]);
  useEffect(() => {
    console.log("in castum use effect", { castumersIds });
  }, [castumersIds]);
  useEffect(() => {
    console.log({ customers, castumersIds });
    if (castumersIds?.length && customers) {
      try {
        setDidentOrderd(
          customers
            .filter((c) => !castumersIds.find((e) => e == c.itemKey))
            .map((c) => c.userName + " " + c.tel)
        );
      } catch (e) {
        console.log({ e });
      }
      // setDidentOrderd((prev) => {
      //   console.log("dident orders ", prev);
      // });
    }
  }, [castumersIds]);
  useEffect(() => {
    console.log(
      "use effect before condition ",
      matrixesDetails,
      typeof selectedMatrix
    );
    if (
      Array.isArray(matrixesDetails) &&
      matrixesDetails?.length > 1 &&
      typeof selectedMatrix != Object &&
      updateName
    ) {
      console.log({ matrixesDetails, selectedMatrix });
      const name = matrixesDetails.filter(
        (matrix) => matrix.matrixID === selectedMatrix
      )[0].matrixName;
      console.log({ name });
      nameChecker(name, setNewMatrixName, "", true, "onload");
      setUpdateName(true);
    }
  }, [selectedMatrix, updateName]);
  useEffect(() => {
    console.log({ didentOrderd });
  }, [didentOrderd]);
  const handleSelect = (e) => {
    setSelectedOption(e);

    setSelectedMatrix(e.value);
    console.log({ selectedOption });
    console.log({ selectedMatrix });
  };

  const options = [];
  if (matrixesDetails) {
    matrixesDetails.forEach((element) => {
      options.push({ value: element.matrixID, label: element.matrixName });
    });
  }

  return noResults ? (
    <NoResults>לא נמצאו מטריצות</NoResults>
  ) : matrixesDetails?.length && isMatrixNames ? (
    <React.Fragment>
      <div className="search-dropdown-wrapper">
        <Select
          defaultValue={selectedOption}
          onChange={(e) => handleSelect(e)}
          options={options}
          placeholder={"בחירה"}
        />
      </div>
      <button
        className={"save-button" + (!selectedOption ? " disabled" : "")}
        onClick={() => {
          console.log({ selectedMatrix });
          loadTablesByID(selectedMatrix);
          setUpdateName(true);
        }}
      >
        טען מטריצה
      </button>{" "}
      <button
        className={"save-button"}
        onClick={() => useDialogRef?.current?.showModal()}
      >
        שלא הזמינו
      </button>{" "}
      <dialog ref={useDialogRef}>
        <div>
          {didentOrderd?.length ? (
            <div>
              {didentOrderd.map((name) => (
                <p>{name}</p>
              ))}
            </div>
          ) : (
            <p>נראה שכולם הזמינו, החיים יפים</p>
          )}
          <button
            onClick={() => {
              useDialogRef.current && useDialogRef.current.close();
            }}
          >
            סגור
          </button>
        </div>
      </dialog>
    </React.Fragment>
  ) : (
    <div />
  );
};

export default SearchMatrixes;
