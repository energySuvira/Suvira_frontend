import React, { useEffect, useState } from 'react'
import ChemicalProductsCards from '../downstream/ChemicalProductsCards'
import Header from '../../../component/Header'
import PageBannerWithTitle from '../../../component/PageBannerWithTitle'
import icons from '../../../assets'
import PageMainTitle from '../../../component/PageMainTitle'
import { chemicalsCards, renewableCards } from '../../../mockData/chemicalsData'
import { useNavigate, useParams } from 'react-router-dom'
import ReadMoreBtn from '../../../component/ReadMoreBtn'
import { IoSearchOutline } from 'react-icons/io5'
import { ImageWithLoader } from '../../../component/ImageLoader'
import Footer from '../../../component/Footer'
import DynamicForm from '../../../component/DynamicForm'
import { IoIosCloseCircle } from 'react-icons/io'
import { LuUpload } from 'react-icons/lu'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../../Recoil'
import { GiHamburgerMenu } from 'react-icons/gi'

function RenewableProducts() {
    const { id } = useParams();
    const decodedId = decodeURIComponent(id);
    const [searchQuery, setSearchQuery] = useState("");
    const [showChemicalMenu, setShowChemicalMEnu] = useState(false);
    const [logo, setLogo] = useState(null); // State to hold the uploaded logo
    const [description, setDescription] = useState("");
    const [pdf, setPdf] = useState(null);
    const userData = useRecoilValue(userInfo);
    const navigate = useNavigate();
    const heroDescription = () => {
      if (decodedId === "Well Cementing Additives") {
        return "yayaya";
      } else if (decodedId === "Speciality Chemicals") {
        return "Our range of Speciality Chemicals is designed to enhance the performance and reliability of cementing operations in the oil and gas industry. These additives improve cement properties such as strength, setting time, fluid loss control, and resistance to harsh downhole conditions, ensuring optimal zonal isolation and long-term well integrity. Whether you're drilling in challenging environments or standard operations, our cost-effective and high-performance additives deliver superior results, tailored to meet your specific project needs.";
      } else if (decodedId === "Fracking Chemicals") {
        return "Our range of Fracking Chemicals is designed to enhance the performance and reliability of cementing operations in the oil and gas industry. These additives improve cement properties such as strength, setting time, fluid loss control, and resistance to harsh downhole conditions, ensuring optimal zonal isolation and long-term well integrity. Whether you're drilling in challenging environments or standard operations, our cost-effective and high-performance additives deliver superior results, tailored to meet your specific project needs.";
      } else if (decodedId === "Crude Additives") {
        return "Our range of Fracking Chemicals is designed to enhance the performance and reliability of cementing operations in the oil and gas industry. These additives improve cement properties such as strength, setting time, fluid loss control, and resistance to harsh downhole conditions, ensuring optimal zonal isolation and long-term well integrity. Whether you're drilling in challenging environments or standard operations, our cost-effective and high-performance additives deliver superior results, tailored to meet your specific project needs.";
      }
    };
  
    const filteredCards = renewableCards.filter(
      (card) =>
        card.sectorSection === decodedId &&
        card.cardTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const splitTextInSpans = (
      text,
      firstSpanClassName = "",
      secondSpanClassName = "",
      firstSpanWordCount = 1 
    ) => {
      if (!text) return null;
  
      const words = text.split(" ");
      const firstWords = words.slice(0, firstSpanWordCount).join(" ");
      const remainingWords = words.slice(firstSpanWordCount).join(" ");
  
      return (
        <>
          <span className={firstSpanClassName}>{firstWords}</span>
          {remainingWords && (
            <span className={secondSpanClassName}> {remainingWords}</span>
          )}
        </>
      );
    };
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
    <Header />
    <PageBannerWithTitle title="Renewable" backgroundImage={icons.AboutUs} />
    <div className="mt-11 w-full grid place-items-center">
      <PageMainTitle blackColorText={decodedId} />
      <div className="flex flex-col items-center justify-center gap-9 mb-11">
        <p className="flex font-normal mt-5 md:text-[1.25rem] text-base w-[70vw] lg:w-[80vw] text-center items-center justify-center text-[#10100f] font-[Poppins] leading-6">
          {heroDescription()}
        </p>

        <ReadMoreBtn text="Download PDF" />
      </div>

      <div className="h-[1px] w-[90%] bg-black"></div>
      <div className="w-[90%] mt-11">
        <div className=" flex items-center justify-between relative">
          <div className=" w-[70%] xl:w-[530px]  bg-[#05A6F01A] border border-[#05A6F0] p-[11px] rounded-[50px] flex items-center hover:border-[#0c8ce9]">
            <IoSearchOutline className=" size-6 mr-3" />
            <input
              type="text"
              placeholder="Search Products"
              className=" w-full h-full border-none outline-none focus:border-[1px] focus:border-black placeholder:text-black bg-transparent "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className=" mr-4">
            <ImageWithLoader src={icons.sortSvg} alt="sort" />
          </button>
          {userData &&(
              <GiHamburgerMenu color="black" className=" absolute right-[4%] size-6 cursor-pointer" onClick={()=> setShowChemicalMEnu(true)} />
            )}
        </div>

        <div className=" mt-11">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11 w-[90%] mx-auto my-12 ">
            {filteredCards.map((item, index) => (
              <ChemicalProductsCards
                key={item.cardTitle}
                cardData={item}
                navigate={navigate}
                sector="renewable"
                splitTextInSpans={splitTextInSpans}
                sectorSection={item.sectorSection}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />

    {showChemicalMenu&&(
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
              <div className="p-7 bg-white w-[50%] relative rounded-md">
                <div className="absolute right-1 top-1">
                  <IoIosCloseCircle
                    onClick={() => setShowChemicalMEnu(false)}
                    className="cursor-pointer text-3xl text-black hover:text-gray-400"
                  />
                </div>
                <h3 className="text-4xl mb-4 w-full text-center">
                  Add Section to Chemicals
                </h3>
      
                {/* Name Input */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-xl font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] "
                  />
                </div>
      
                {/* Logo Upload */}
                <div className="mb-4">
                  <label
                    htmlFor="logo"
                    className=" flex items-center justify-center gap-5 cursor-pointer w-full p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]  text-center"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    Upload Logo
                    {logo && (
                      <div className="mt-2">
                        <img
                          src={logo}
                          alt="Logo Preview"
                          className="size-12 object-contain border border-gray-300 rounded-full"
                        />
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    
                    className="hidden"
                  />
                </div>
      
                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="w-full p-2 border h-40 border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] "
                  ></textarea>
                </div>
      
                {/* PDF Upload */}
                <div className="mb-4 p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]">
                  <label
                    htmlFor="pdf"
                    className="flex items-center justify-center gap-5 "
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    Upload PDF
                  </label>
                  <input
                    type="file"
                    id="pdf"
                    name="pdf"
                    accept="application/pdf"
                    className="w-full hidden "
                  />
                  {pdf && (
                    <div className="mt-2 text-sm text-gray-600">
                      Uploaded File: {pdf.name}
                    </div>
                  )}
                </div>
                {/* <div className="mb-4 p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"> */}
                  <DynamicForm/>
                {/* </div> */}
                
      
                <div className=" w-full grid place-items-center mt-9">
                  <ReadMoreBtn text="Submit"  />
                </div>
              </div>
            </div>
)}
  </>
  )
}

export default RenewableProducts