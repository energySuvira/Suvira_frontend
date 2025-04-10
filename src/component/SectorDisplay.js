import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GET_CATEGORIES } from "../Api";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// Adjust the import path based on your project structure

const SectorDisplay = ({ sectors }) => {
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);
  const [firstProducts, setFirstProducts] = useState([]);

  const productRef = useRef(null);

  const getFirstCustomFieldValue = (customFields) =>
    customFields?.[0]?.value || "";

  useEffect(() => {
    const fetchAndMapFirstProducts = async () => {
      try {
        const categoriesData = await GET_CATEGORIES();
        const results = [];
  
        sectors?.forEach((sector) => {
          sector.subsectors?.forEach((subsector) => {
            if (!subsector.categories?.length) return;
  
            const matchedCategories = categoriesData.filter((cat) =>
              subsector.categories.includes(cat._id)
            );
  
            const firstProduct = matchedCategories[0];
            if (firstProduct) {
              results.push({
                sectorName: sector.name,
                sectorSection: subsector.name,
                product: firstProduct,
              });
            }
          });
        });
  
        setFirstProducts(results);
        setActiveSectorIndex(0);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
  
    fetchAndMapFirstProducts();
  }, [sectors]);

  useEffect(() => {
    if (firstProducts.length > 0) {
      console.log(
        "Currently showing sector:",
        firstProducts[activeSectorIndex].sectorName
      );
    }
  }, [activeSectorIndex, firstProducts]);

  const handleNext = () => {
    setActiveSectorIndex((prev) => (prev + 1) % firstProducts.length);
  };

  const handlePrev = () => {
    setActiveSectorIndex(
      (prev) => (prev - 1 + firstProducts.length) % firstProducts.length
    );
  };

  return (
    <div className="space-y-10">
      {firstProducts?.length > 0 && (
        <div className="flex items-center w-full mb-16">
          <div className="flex items-center gap-7 mb-10 md:gap-20 xl:gap-[8rem] flex-col-reverse w-full lg:flex-row-reverse">
            <div className="flex lg:ml-[-4.5rem] md:w-[45%] w-[80%] h-[500px] max-w-[810px] lg:h-[715px] relative">
              <motion.div
                ref={productRef}
                className="relative flex w-full h-full bg-cover bg-no-repeat lg:rounded-l-xl rounded-xl"
                style={{
                  backgroundImage: `url(${firstProducts[activeSectorIndex].product.logo})`,
                  backgroundPositionX: "center",
                }}
              >
                <div className="absolute flex items-start justify-start flex-col gap-5 left-[-1.5rem] top-[16%]">
                  <div
                    onClick={handlePrev}
                    className="w-[50px] h-[50px] bg-[#81BC06] rounded-full cursor-pointer  grid place-items-center"
                  >
                    <BiLeftArrowAlt className=" text-white text-[1.8rem]" />
                  </div>
                  <div
                    onClick={handleNext}
                    className="w-[50px] h-[50px] bg-[#05A6F0] rounded-full cursor-pointer grid place-items-center"
                  >
                    <BiRightArrowAlt className=" text-white text-[1.8rem]" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center justify-start">
              <div className="flex items-center justify-center">
                <h1 className="text-center w-full flex flex-col items-center">
                  <span className="text-lg md:text-2xl lg:text-4xl font-[Poppins] font-medium">
                    <span className="text-[#81BC06]">
                      {firstProducts[activeSectorIndex].product.name}
                    </span>
                  </span>
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="flex font-normal mt-5 md:text-[1.25rem] text-sm w-[90vw] leading-5 lg:w-[41vw] pb-4 text-center text-[#10100F] font-[Poppins] md:leading-7">
                  {firstProducts[activeSectorIndex].product.description}
                </p>
                <div className="flex items-center w-full justify-center lg:mt-8 mt-4">
                  <Link
                    to={{
                      pathname: `/offerings/${encodeURIComponent(
                        firstProducts[activeSectorIndex]?.sectorName
                      )}/${encodeURIComponent(
                        sectors.find(
                          (sec) =>
                            sec.name ===
                            firstProducts[activeSectorIndex]?.sectorName
                        )?.subsectors?.[0]?.name
                      )}/${encodeURIComponent(
                        firstProducts[activeSectorIndex]?.product?.name
                      )}`,
                    }}
                    state={{
                      productData: {
                        ...firstProducts[activeSectorIndex]?.product,
                        sector: firstProducts[activeSectorIndex]?.sectorName,
                        sectorSection: sectors.find(
                          (sec) =>
                            sec.name ===
                            firstProducts[activeSectorIndex]?.sectorName
                        )?.subsectors?.[0]?.name,
                        appearance: getFirstCustomFieldValue(
                          firstProducts[activeSectorIndex]?.product
                            ?.customFields
                        ),
                      },
                    }}
                  >
                    <button className="bg-[#05A6F01A] hover:bg-[#05A6F0] hover:text-white transition-all duration-300 ease-linear h-11 w-[40vw] md:w-[20vw] lg:w-[11.6vw] rounded-md text-[#05A6F0] border-[#05A6F0] border-2 font-medium text-xl leading-6 font-[Poppins]">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorDisplay;