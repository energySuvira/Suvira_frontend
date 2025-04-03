import React from 'react';
import { motion } from 'framer-motion';

function Slder({ slides, duration = 15 }) {
    const duplicatedSlides = [...slides, ...slides];

    return (
        <div
            className="relative h-full overflow-hidden lg:py-12 py-6 mx-auto "
            style={{ width: "100%" }}
        >
            <div className=" absolute inset-0 z-20 before:absolute before:left-0 before:top-0 before:w-1/4 before:h-full before:bg-gradient-to-r  before:to-transparent before:filter before:blur-3 after:absolute after:right-0 after:top-0 after:w-1/4 after:h-full after:bg-gradient-to-l  after:to-transparent after:filter after:blur-3"></div>

            <motion.div
                className="flex gap-14"
                animate={{
                    x: ['-100%', '0%'], 
                }}
                transition={{
                    ease: 'linear',
                    duration, 
                    repeat: Infinity,
                }}
            >
                {duplicatedSlides.map((slide, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0  flex items-center justify-center flex-col rounded-lg"
                        style={{ width: `${100 / slides.length}%` }}
                    >
                        <img
                            src={slide.img}
                            alt={slide.alt || `slide-${index}`}
                            className="xl:min-w-52 xl:max-w-56 lg:min-w-40 lg:max-w-40 min-w-24 w-28 max-w-28   object-cover cursor-pointer"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default Slder;
