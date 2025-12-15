import { motion, AnimatePresence } from "framer-motion";
import { useCustomization } from "../context/CustomizationContext";
import classNames from "classnames";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

function VanInfoText() {
  const { vans, vanIndex, step } = useCustomization();
  const van = vans[vanIndex];

  return (
    <div
      className={classNames(
        "absolute bottom-50 left-5 max-w-[700px] text-center z-20 transition-all ease-out duration-300 pointer-events-none",
        step < 1 ? "opacity-100 translate-y-3" : "opacity-0"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={vanIndex}
          className="flex flex-col text-left gap-2 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h2
            className="text-black text-2xl italic mb-1 font-bold tracking-wide drop-shadow-[0_0_10px_rgba(0,0,0,0.4)]"
            variants={itemVariants}
          >
            {van.title}
          </motion.h2>
          <motion.p
            className="text-black text-lg tracking-wide max-w-[600px]"
            variants={itemVariants}
          >
            {van.description}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default VanInfoText;
