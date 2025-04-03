import React from 'react'
import { motion } from "framer-motion";
function AnimatedLineSvg({
    width = "100%",
    height = "3px",
    bgColor = "#05a6f0",
    animationDuration = 8,
  }) {
  return (
    <motion.div
    style={{
      width: 0, // Start with 0 width
      height: height,
      backgroundColor: bgColor,
    }}
    initial={{ width: 0 }}
    whileInView={{
      width: width, // Expand to full width
      transition: { duration: animationDuration, ease: "linear" },
    }}
    viewport={{ once: true, amount: 0.5 }}
  />
  )
}

export default AnimatedLineSvg