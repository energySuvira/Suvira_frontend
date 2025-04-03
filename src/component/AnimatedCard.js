import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedCard = ({ children, bgColor, year, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: {
          delay: index * 0.2,
          duration: 0.8,
          ease: "easeInOut",
        },
      });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={controls}
      className="lg:px-5  lg:py-6 p-2 h-32 text-sm lg:text-base  flex justify-center items-center text-white w-[300px] lg:w-[450px] rounded-lg mb-4 historyCard"
      style={{ backgroundColor: bgColor }}
      data-year={year}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
