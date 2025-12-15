import { useState } from "react";
import classNames from "classnames";
import { useCustomization } from "@/context/CustomizationContext";
import HowManySlider from "./HowManySlider";

export default function DesignPanel() {
  const { step } = useCustomization();
  const [selected, setSelected] = useState(null);
  const [fullOptions, setFullOptions] = useState(false);
  const initialVanProfiles = [
    "Weekend Adventurer – Hiking & Camping",
    "Couple – Extended Travel",
    "Digital Nomad – Work on the Road",
    "Minimalist – Sustainable Living",
  ];

  const vanProfilesAdditional = [
    "Outdoor Enthusiast – Sports & Gear",
    "Surf Van – Beach & Waves Lifestyle",
    "Pet-Friendly – Travel with Dogs & Cats",
    "Tiny Home Explorer – Compact Comfort",
  ];

  const [vanProfiles, setVanProfiles] = useState(initialVanProfiles);

  const handleAddMore = () => {
    setFullOptions(true);
    setVanProfiles((prev) => [...prev, ...vanProfilesAdditional]);
  };

  return (
    <div
      className={classNames(
        "transition-all ease-out duration-300 absolute top-0 left-0 px-8 items-center justify-between h-[80%] flex flex-col",
        step < 2 ? "opacity-0 -translate-x-4 pointer-events-none" : "delay-300"
      )}
    >
      <HowManySlider />
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">
          What are your plans?
        </h2>
        <div className="flex justify-center flex-wrap gap-4">
          {vanProfiles.map((label, i) => (
            <label
              key={`label-${i}`}
              className={classNames(
                "relative px-2.5 py-2 text-sm duration-300 ease-out transition-all rounded-3xl border border-gray-600 cursor-pointer hover:bg-gray-600 hover:text-white hover:scale-[1.04]",
                selected === label
                  ? "bg-gray-600 text-white scale-[1.04]"
                  : "bg-white text-gray-600 scale-[1]"
              )}
            >
              <input
                type="radio"
                name="vanProfile"
                value={label}
                className="sr-only"
                onChange={() => setSelected(label)}
              />
              {label}
            </label>
          ))}

          <button
            onClick={handleAddMore}
            className={classNames(
              "px-2.5 py-2 text-sm text-white border rounded-3xl cursor-pointer hover:bg-gray-600 hover:text-white transition-all duration-300",
              fullOptions ? "opacity-0" : "opacity-100"
            )}
          >
            + More
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-8 w-full max-w-[500px]">
        <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
          Custom notes
        </h2>

        <textarea
          className="px-3 py-2 rounded-3xl border border-gray-600 bg-white text-gray-600 
               focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-700
               transition-all duration-300 resize-none w-full h-24 placeholder-gray-400"
          placeholder="Anything specific we should know? (e.g. “No kitchen needed”, “room for bikes”, “traveling with my dog”)"
        />
      </div>
    </div>
  );
}
