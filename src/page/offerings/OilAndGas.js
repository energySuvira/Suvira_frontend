import React, { useEffect, useRef, useState } from "react";
import Header from "../../component/Header";
import PageBannerWithTitle from "../../component/PageBannerWithTitle";
import icons from "../../assets";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImageWithLoader } from "../../component/ImageLoader";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import PageMainTitle from "../../component/PageMainTitle";
import Footer from "../../component/Footer";
import OfferingsBlueGrid from "../../component/OfferingsBlueGrid";
import { Sectors, userInfo } from "../../Recoil";
import { useRecoilValue } from "recoil";
import { GiHamburgerMenu } from "react-icons/gi";
import OilandGasMenu from "../../component/OilandGasMenu";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "react-toastify";

function OilAndGas() {
  const token = localStorage.getItem("token");
  const userData = useRecoilValue(userInfo);
  const sectors = useRecoilValue(Sectors);
  const navigate = useNavigate();
  const [showChemicalMenu, setShowChemicalMenu] = useState(false);

  const { id, pageId } = useParams();
  const decodedId = decodeURIComponent(id);

  const decodedPageId = decodeURIComponent(pageId);

  const currentSector = sectors
    ? sectors.find((s) => s.name === decodedId)
    : null;
  const [services, setServices] = useState(currentSector?.subsectors || []);

  const sectorDescription = currentSector
    ? currentSector.description
    : "Suvira Energy, headquartered in the dynamic metropolis of Mumbai, stands as a pioneering force in the realm of technology-driven solutions for the Energy sector in India. Renowned for our prowess in cutting-edge Project Management, Sales &amp; Marketing, and Services, we consistently cater to the diverse needs of our esteemed clientele.";

  const handlePdfDownload = async () => {
    try {
      if (currentSector?.pdf) {
        
        const response = await fetch(currentSector.pdf, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/pdf",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the filename from the URL or use a default name
        const filename = `${currentSector.name}-document.pdf`;

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } else {
        toast.error("PDF not available for download");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const handleCardClick = (item) => {
    const path = `/offerings/${encodeURIComponent(
      currentSector.name
    )}/${encodeURIComponent(item.name)}`;
    navigate(path);
  };

  const offeringsOilgasRef = useRef(null);

  const { scrollYProgress: oilGasScrollYProgress } = useScroll({
    target: offeringsOilgasRef,
    offset: ["start end", "end start"],
    smooth: 500,
  });
  const oilGasimageMove = useTransform(
    oilGasScrollYProgress,
    [0, 1],
    [1, -180]
  );

  useEffect(() => {
    if (currentSector?.subsectors) {
      setServices(currentSector.subsectors);
    }
  }, [currentSector]);

  return (
    <>
      <Header />
      <div className="relative font-[Poppins] ">
        <PageBannerWithTitle
          title="Offerings"
          backgroundImage={icons.AboutUs}
        />
        {/* herosection */}
        <div className="flex items-center gap-7 md:gap-20 xl:gap-[8rem] flex-col-reverse w-full lg:flex-row mt-12 overflow-x-clip">
          <div className=" flex justify-center flex-col  rounded-lg lg:ml-[-4.5rem] md:w-[45%] w-[80%] h-[500px] lg:h-[715px]">
            <motion.div
              ref={offeringsOilgasRef}
              className="relative flex w-[100%] h-full bg-cover bg-no-repeat lg:rounded-l-xl rounded-xl"
              style={{
                backgroundImage: `url(${
                  currentSector?.backgroundImage || icons.offeringsOilandGas
                })`,
                backgroundPositionX: oilGasimageMove,
              }}
            >
              <div className="absolute flex items-start justify-start flex-col gap-5 right-[-1.5rem] top-[16%]">
                <div
                  className="w-[50px] h-[50px] bg-[#05A6F0] rounded-full grid place-items-center "
                 
                >
                 
                </div>
                <div
                  className="w-[50px] h-[50px] bg-[#81BC06] rounded-full grid place-items-center "
                 
                >
                 
                </div>
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col items-center justify-start">
            <div className="flex items-center justify-center">
              <PageMainTitle
                greenColorText={currentSector?.name?.split(" ")[0] || "Oil &"}
                blackColorText={
                  currentSector?.name?.split(" ").slice(1).join(" ") || " Gas"
                }
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="flex font-normal h-auto mt-0 lg:mt-5 md:text-[1.25rem] text-base w-[80vw] md:w-[80vw] lg:w-[41vw] text-center items-center justify-center text-[#10100f] font-[Poppins] leading-6 line-clamp-3">
                {sectorDescription}
              </p>
              <div className="flex items-center w-full justify-center mt-8">
                <button
                  className="bg-[#05A6F01A] cursor-pointer hover:bg-[#05A6F0] hover:text-white transition-hover duration-300 ease-linear h-11 w-[40vw] md:w-[20vw]  lg:w-[11.6vw] rounded-md text-[#05A6F0]  border-[#05A6F0] border-solid border-2 font-medium text-xl leading-6 font-[Poppins]"
                  onClick={handlePdfDownload}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" relative w-full">
          {userData && (
            <GiHamburgerMenu
              onClick={() => setShowChemicalMenu(true)}
              className=" cursor-pointer text-2xl absolute right-[2%] -top-[7%]"
            />
          )}
        </div>

        <OfferingsBlueGrid
          items={services}
          bgColor="bg-[#05A6F0]"
          title="Our Offerings"
          onCardClick={handleCardClick}
        />
      </div>
      <Footer />

      {showChemicalMenu && (
        <OilandGasMenu
          services={services}
          setServices={setServices}
          setShowChemicalMenu={setShowChemicalMenu}
          currentSecId={currentSector?._id}
        />
      )}
    </>
  );
}

export default OilAndGas;
