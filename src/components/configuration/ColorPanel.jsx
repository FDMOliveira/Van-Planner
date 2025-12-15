import { useState } from "react";
import { motion } from "framer-motion";
import { useCustomization } from "@/context/CustomizationContext";
import classNames from "classnames";

export const vanColors = [
  // Sólidas
  { name: "Pure White", hex: "#FFFFFF", category: "Solid" },
  { name: "Jet Black", hex: "#0D0D0D", category: "Solid" },
  { name: "Slate Gray", hex: "#5A5A5A", category: "Solid" },
  { name: "Navy Blue", hex: "#1A2C56", category: "Solid" },
  { name: "Crimson Red", hex: "#B11226", category: "Solid" },

  // Metálicas
  { name: "Silver Metallic", hex: "#C0C0C0", category: "Metallic" },
  { name: "Gunmetal Gray", hex: "#2A3439", category: "Metallic" },
  { name: "Champagne Gold", hex: "#D4AF37", category: "Metallic" },
  { name: "Midnight Blue Metallic", hex: "#2C3E50", category: "Metallic" },
  { name: "Forest Green Metallic", hex: "#1E4038", category: "Metallic" },
  { name: "Copper Bronze", hex: "#B87333", category: "Metallic" },
  { name: "Pearl White", hex: "#F5F5F5", category: "Metallic" },

  // Premium
  { name: "Matte Charcoal", hex: "#3B3B3B", category: "Premium" },
  { name: "Ocean Teal", hex: "#007B7F", category: "Premium" },
  { name: "Sunset Orange", hex: "#E4572E", category: "Premium" },
  { name: "Graphite Blue", hex: "#4A6FA5", category: "Premium" },
  { name: "Steel Olive", hex: "#5E6E56", category: "Premium" },
];

export default function ColorPanel({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const { step, setSelectedColor } = useCustomization();
  const categories = ["Solid", "Metallic", "Premium"];

  return (
    <div
      className={classNames(
        "transition-all ease-out duration-300",
        step !== 1
          ? "opacity-0 -translate-x-4 pointer-events-none"
          : " delay-500 "
      )}
    >
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        Choose Exterior Color
      </h2>

      {categories.map((cat) => (
        <div key={cat} className="mb-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 tracking-wide">
            {cat}
          </h3>

          <div className="flex flex-wrap gap-3">
            {vanColors
              .filter((c) => c.category === cat)
              .map((c) => (
                <div
                  key={c.name}
                  className={`relative color w-10 h-10 rounded-full border-2 cursor-pointer transition-all ${
                    selected === c.name
                      ? "border-gray-900 ring-2 ring-offset-2 ring-gray-800 scale-105"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedColor(c.hex);
                  }}
                  style={{ backgroundColor: c.hex }}
                ></div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
