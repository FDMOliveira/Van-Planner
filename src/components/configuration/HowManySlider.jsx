import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function HowManySlider({ value, onChange }) {
  const [internalValue, setInternalValue] = useState(value ?? 1);
  const trackRef = useRef(null);

  const min = 0;
  const max = 5;

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const setValue = (val) => {
    const clamped = Math.min(max, Math.max(min, Math.round(val)));
    setInternalValue(clamped);
    onChange?.(clamped);
  };

  const pct = (internalValue * 100) / max;

  const handlePointerMove = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = x / rect.width;
    setValue(p * max);
  };

  const startDrag = () => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);
  };

  const stopDrag = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopDrag);
  };

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-center mb-2">
        <h2 className="text-xl font-bold text-gray-800 mt-[10vh] mb-5 text-center">
          How Many ?
        </h2>
      </div>

      <div className="grid gap-8 w-[500px] mx-auto">
        <div
          ref={trackRef}
          className="relative h-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-200 cursor-pointer"
          onPointerDown={(e) => {
            const rect = trackRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const p = x / rect.width;
            const val = min + p * (max - min);
            setValue(val);
          }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all ease-out duration-300 overflow-hidden"
            style={{
              width: `${pct}%`,
            }}
          >
            <div
              className="absolute h-full w-[500px] overflow-hidden"
              style={{
                background: "linear-gradient(90deg,#758bad,#1F2937)",
              }}
            ></div>
          </div>

          <div className="absolute top-full mt-2 left-0 right-0 flex justify-between">
            {Array.from({ length: max - min + 1 }).map((_, i) => (
              <div key={i} className="w-px h-2 bg-gray-300" />
            ))}
          </div>

          <motion.div
            onPointerDown={startDrag}
            animate={{ left: `${pct}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2
             w-6 h-6 rounded-full bg-white border border-gray-600 shadow-md"
          />
        </div>
        <span className="px-3 py-0.5 w-fit text-xl left-1/2 -translate-x-1/2 relative rounded-full border border-gray-600 bg-white text-gray-600">
          {internalValue}
        </span>
      </div>
    </div>
  );
}
