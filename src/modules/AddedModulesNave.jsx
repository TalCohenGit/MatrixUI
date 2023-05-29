import React, { useState, useEffect } from "react";
import ModulesModal from "./ModulesModal";
import Frame from "./Frame";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import faRotateRight from "./rotate-solid.svg";
import { SaveDriversMatrix } from "./SaveMatrixToDrivers";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./modules.scss";
import { ModulesData } from "../utils/constants";

function AddedModulesNav() {
  const [isMatrixSavedUpToDate, setIsMatrixSavedUpToDate] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState({ isActive: false, moduleName: null });
  const axiosPrivate = useAxiosPrivate();
  const [activeModules, setActiveModules] = useState([...ModulesData]);
  const { productsMap, newMatrixName, matrixDate, matrixData, matrixComments, selectedProducts, balanceTableData, matrixID } =
    useContext(DataContext);

  useEffect(() => {
    console.log({ productsMap });
  }, [productsMap]);

  useEffect(() => {
    if (!isMatrixSavedUpToDate) setIsMatrixSavedUpToDate(!isMatrixSavedUpToDate);
  }, [matrixData, isMatrixSavedUpToDate]);
  const handleDriversMatrixSave = async () => {
    const x = await SaveDriversMatrix(
      axiosPrivate,
      productsMap,
      newMatrixName,
      matrixDate,
      matrixData,
      matrixComments,
      selectedProducts,
      balanceTableData,
      matrixID
    );
    console.log({ x });
  };
  return (
    <div className="modules-container">
      <button className="moduls-button-main" onClick={() => setToggleModal(true)}>
        מודולים
      </button>
      {activeModules.map((module, i) => (
        <div key={module.id}>
          {module.isCheched && module.name == "נהגים" ? (
            <div className="drivers-container">
              <button className="moduls-button-2" onClick={() => setSelectedModule({ isActive: true, moduleName: module.name })}>
                נהגים
              </button>
              <img
                onClick={() => handleDriversMatrixSave()}
                className="refresh-icon-button"
                height={20}
                width={20}
                color={"white"}
                src={faRotateRight}
              />
            </div>
          ) : (
            module.isCheched && (
              <button key={i} className="moduls-button-2" onClick={() => setSelectedModule({ isActive: true, moduleName: module.name })}>
                {module.name}
              </button>
            )
          )}
        </div>
      ))}
      <ModulesChoices
        activeModules={activeModules}
        setActiveModules={setActiveModules}
        toggleModal={toggleModal}
        setToggleModal={setToggleModal}
      />
      {selectedModule.isActive && selectedModule.moduleName && (
        <ActivateModule name={selectedModule.moduleName} setSelectedModule={setSelectedModule} />
      )}
    </div>
  );
}

export default AddedModulesNav;

const ModulesChoices = ({ activeModules, setActiveModules, toggleModal, setToggleModal }) => {
  return (
    <ModulesModal isOpen={toggleModal}>
      <div className="LoadModal">בחר מודולים להצגה</div>
      {activeModules.map((module, i) => (
        <div className="table-row" key={i}>
          <p className="table-cell">{module.name}</p>
          <input
            className="table-cell"
            type="checkbox"
            name={module.name}
            onChange={(e) => {
              setActiveModules((prev) =>
                prev.map((m) => {
                  if (m.name == e.target.name) return { ...m, isCheched: !m.isCheched };
                  else return m;
                })
              );
            }}
            checked={module.isCheched}
          />
        </div>
      ))}
      <div className="action-buttons">
        <button className="modules-cancel-button" onClick={() => setToggleModal((prev) => !prev)}>
          סגור
        </button>
      </div>
    </ModulesModal>
  );
};

const ActivateModule = ({ name, setSelectedModule }) => {
  console.log({ name });

  return (
    <ModulesModal isOpen={true}>
      <button onClick={() => setSelectedModule({ isActive: false, moduleName: null })}>סגור</button>
      <div className="LoadModal">
        <Frame name={name} src={getSrcByName(name)} />
      </div>
    </ModulesModal>
  );
};
const getOauth = () => "123";

const getSrcByName = (name) => {
  switch (name) {
    case "הזמנות": {
      const authorizedID = getOauth();
      return "https://gat-avigdor-castumers-ui.vercel.app/admin/" + authorizedID;
    }
    case "נהגים": {
      const authorizedID = getOauth();
      return "https://yotamos5699.github.io/drivers_ui_2/";
    }
    case "תשלומים": {
      return null;
    }
    case "הודעות": {
      return null;
    }
  }
};
