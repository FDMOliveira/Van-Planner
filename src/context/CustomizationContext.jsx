import { createContext, useContext, useState } from "react";

const CustomizationContext = createContext({
  currentModel: {},
  setCurrentModel: () => {},
  isTransformingModel: false,
  setIsTransformingModel: () => {},
});

export async function getModelObject(name) {
  try {
    switch (name) {
      default:
        return null;
    }
  } catch (err) {
    console.error("Failed to load model:", name, err);
    return null;
  }
}

export const CustomizationProvider = ({ children }) => {
  const [isFadeOut, setIsFadeOut] = useState(false);
  const [vanIndex, setVanIndex] = useState(0);
  const [selectedVan, setSelectedVan] = useState(-1);
  const [currentModel, setCurrentModel] = useState({});
  const [isTransformingModel, setIsTransformingModel] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [draggingModel, setDraggingModel] = useState(null);
  const [newModelId, setNewModelId] = useState(null);
  const [movingModelId, setMovingModelId] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [vans, setVans] = useState([]);

  function updateModel(id, updates) {
    setSelectedModels((prev) =>
      prev.map((model) => (model.id === id ? { ...model, ...updates } : model))
    );
  }

  return (
    <CustomizationContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        setStep,
        step,
        isFadeOut,
        setIsFadeOut,
        vanIndex,
        setVanIndex,
        vans,
        setVans,
        setSelectedVan,
        selectedVan,
        currentModel,
        setCurrentModel,
        isTransformingModel,
        setIsTransformingModel,
        selectedModels,
        setSelectedModels,
        draggingModel,
        setDraggingModel,
        getModelObject,
        newModelId,
        setNewModelId,
        movingModelId,
        setMovingModelId,
        updateModel,
        isMoving,
        setIsMoving,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error(
      "useCustomization must be used within a CustomizationProvider"
    );
  }
  return context;
};
