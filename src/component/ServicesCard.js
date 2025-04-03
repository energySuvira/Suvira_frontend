import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import icons from "../assets";

function ServicesCard({ serviceCard }) {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    let scrollInterval;

    if (!isHovered && scrollContainer) {
      scrollInterval = setInterval(() => {
        scrollContainer.scrollBy({ left: 1, behavior: "smooth" });
      }, 1);
    }

    return () => {
      clearInterval(scrollInterval);
    };
  }, [isHovered]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full flex flex-row items-center flex-nowrap justify-start overflow-x-scroll overflow-y-hidden gap-4 mt-6 scroll-smooth"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(serviceCard || []).map((item) => (
        <motion.div
          key={item.id}
          className="catCard bg-cover bg-center font-[Poppins] shadow-lg rounded-lg overflow-hidden min-w-[300px] md:min-w-[430px] md:h-[630px] h-[450px] cursor-pointer"
          style={{
            backgroundImage: `url(${item.backgroundImage})`,
          }}
          whileHover={{ scale: 1 }}
        >
          <div className="lowerCatCard bg-[#10100F73] p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 cardHoverTitle">
              <div className="w-2 bg-[#05A6F0] h-12 bluebox"></div>
              <h3
                className="text-[35px] text-white font-normal"
                onClick={() =>
                  item.name === "Down Stream"
                    ? navigate("/offerings/downStream/chemicals")
                    : navigate(`/offerings/${item.cardlinkTitle}/`)
                }
              >
                {item.name}
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {Array.isArray(item.subsectors) &&
                item.subsectors.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start gap-3 text-white cursor-pointer"
                    onClick={() =>
                      link.linkTile === "Renewable Energy"
                        ? navigate(`/offerings/renewable`)
                        : navigate(
                            `/offerings/${
                              item.cardlinkTitle
                            }/${encodeURIComponent(link.linkTile)}`
                          )
                    }
                  >
                    <img
                      src={icons.arrowRight}
                      alt="arrowRight"
                      className="border-none"
                    />
                    <p className="text-[22px]">{link.linkTile}</p>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ServicesCard;
