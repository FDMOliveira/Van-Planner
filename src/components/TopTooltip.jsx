import { motion, AnimatePresence } from "framer-motion";
import { useCustomization } from "../context/CustomizationContext";

function TopTooltip() {
  const { step } = useCustomization();

  return (
    <div className="absolute top-2 left-0 right-0 text-center z-20 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex flex-col items-center gap-2 px-4"
        >
          <motion.p className="text-black text-base">
            {step === 0
              ? "Slide left or right, and hit Enter to pick your ride!"
              : step === 1
              ? "Drag to rotate your van and pick a color!"
              : ""}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default TopTooltip;
