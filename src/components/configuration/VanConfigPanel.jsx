import { useCustomization } from "../../context/CustomizationContext";
import classNames from "classnames";
import ColorPanel from "./ColorPanel";
import DesignPanel from "./DesignPanel";

function VanConfigPanel() {
  const { step, setStep } = useCustomization();

  return (
    <>
      <div
        className={classNames(
          "flex flex-col justify-end absolute z-10 left-0 bottom-0 h-screen transition-all ease-out duration-300",
          step >= 1 ? "opacity-100 delay-300" : "opacity-0"
        )}
      >
        <div
          className={classNames(
            "p-6 bg-gray-500/60 relative backdrop-blur-md shadow-lg border border-gray-100/40 flex-1 w-screen transition-all ease-out duration-300",
            step == 1 ? "max-w-[450px] delay-300" : "max-w-[700px]"
          )}
        >
          <ColorPanel />
          <DesignPanel />
        </div>
        <div
          className={classNames(
            "flex z-20 left-0 max-w-[700px] text-center transition-all ease-out duration-500",
            step >= 1 ? "opacity-100 delay-300" : "opacity-0"
          )}
        >
          <div
            className={classNames(
              " flex-1 font-bold cursor-pointer py-4 px-10 transition-all ease-out duration-300 border-r border-r-white/40",
              step == 1 ? "bg-gray-800 text-white " : "bg-white text-gray-800"
            )}
            onClick={() => {
              setStep(1);
            }}
          >
            Style
          </div>
          <div
            className={classNames(
              " flex-1 font-bold py-4 px-10 border transition-all ease-out duration-500 cursor-pointer",
              step > 1
                ? "bg-gray-800 text-white border-white "
                : "bg-white text-gray-800 border-gray-800"
            )}
            onClick={() => {
              setStep(2);
            }}
          >
            Design
          </div>
        </div>
      </div>
    </>
  );
}

export default VanConfigPanel;
