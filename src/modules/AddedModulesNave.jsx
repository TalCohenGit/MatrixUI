import React, { useState } from "react";
import ModulesModal from "./ModulesModal";
import Frame from "./Frame";
import IframeModal from "./IframeModule";

function AddedModulesNav() {
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState({ isActive: false, moduleName: null });
  const [activeModules, setActiveModules] = useState([
    {
      name: "הזמנות",
      isOpen: true,
      isCheched: false,
    },
    {
      name: "נהגים",
      isOpen: false,
      isCheched: false,
    },
    {
      name: "הודעות",
      isOpen: true,
      isCheched: false,
    },
    {
      name: "תשלומים",
      isOpen: true,
      isCheched: false,
    },
  ]);
  return (
    <div>
      {" "}
      <button className="moduls-button" onClick={() => setToggleModal(true)}>
        מודולים
      </button>
      {activeModules.map(
        (module, i) =>
          module.isCheched && (
            <button key={i} className="moduls-button" onClick={() => setSelectedModule({ isActive: true, moduleName: module.name })}>
              {module.name}
            </button>
          )
      )}
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
      return null;
    }
    case "תשלומים": {
      return null;
    }
    case "הודעות": {
      return null;
    }
  }
};
