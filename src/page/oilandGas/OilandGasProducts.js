import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import PageBannerWithTitle from "../../component/PageBannerWithTitle";
import icons from "../../assets";
import ReadMoreBtn from "../../component/ReadMoreBtn";
import PageMainTitle from "../../component/PageMainTitle";
import { useNavigate, useParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { ImageWithLoader } from "../../component/ImageLoader";
import ChemicalProductsCards from "../offerings/downstream/ChemicalProductsCards";
import { oilandGasCards } from "../../mockData/chemicalsData";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sectors, userInfo } from "../../Recoil";
import { useRecoilValue } from "recoil";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import DynamicForm from "../../component/DynamicForm";
import OilandGasProductsMenu from "../../component/OilandGasProductsMenu";
import { GET_CATEGORIES } from "../../Api";
import { toast } from "react-toastify";

function OilandGasProducts() {
  const token = localStorage.getItem("token");
  const { pageId,id } = useParams();
  const userData = useRecoilValue(userInfo);
  const decodedId = decodeURIComponent(id);
  const decodedPageId = decodeURIComponent(pageId);
  const [pdf, setPdf] = useState(null);
  const [logo, setLogo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOilGasMenu, setShowOilGasMenu] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isSortAsc, setIsSortAsc] = useState(true);
   const sectors = useRecoilValue(Sectors);
  const navigate = useNavigate();
  const currentSubsector = sectors
    ? sectors.find((s) => s.name === decodedPageId) 
    : null;

    const currentSubsectorProduct = currentSubsector?.subsectors.find((s) => s.name === decodedId) 
  
  useEffect(() => {
    const fetchAndMatchCategories = async () => {
      try {
       
        const categoriesData = await GET_CATEGORIES();
        
       
        const subsectorCategoryIds = currentSubsectorProduct?.categories || [];
        
       
        const matchedProducts = categoriesData.filter(category => 
          subsectorCategoryIds.includes(category._id)
        );
        
       
        setProducts(matchedProducts);
        
      } catch (error) {
        console.error("Error fetching and matching categories:", error);
       
      }
    };

    
    if (currentSubsectorProduct) {
      fetchAndMatchCategories();
    }
  }, [currentSubsectorProduct]);
 

   


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  
  const filteredCards = products.filter((card) =>
    card.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
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

  const heroDescription = currentSubsectorProduct?.description

  const handleSort = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (isSortAsc) {
        return a.name.localeCompare(b.name); 
      } else {
        return b.name.localeCompare(a.name); 
      }
    });
    setProducts(sortedProducts); 
    setIsSortAsc(!isSortAsc); 
  };



    const handlePdfDownload = async () => {
      try {
        if (currentSubsectorProduct?.pdf) {
          
          const response = await fetch(currentSubsectorProduct.pdf, {
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
          const filename = `${currentSubsectorProduct.name}-document.pdf`;
  
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

 
  return (
    <>
      <Header />
      <PageBannerWithTitle
        backgroundImage={icons.offeringsOilandGas}
        title={decodedPageId}
      />
      <div className="mt-11 w-full grid place-items-center">
        <PageMainTitle blackColorText={decodedId} />
        <div className="flex flex-col items-center justify-center gap-9 mb-11">
          <p className="flex font-normal mt-5 md:text-[1.25rem] text-base w-[70vw] lg:w-[80vw] text-center items-center justify-center text-[#10100f] font-[Poppins] leading-6">
            {heroDescription}
            
          </p>

          <ReadMoreBtn text="Download PDF" onClick={handlePdfDownload} />
        </div>
        <div className="h-[1px] w-[90%] bg-black"></div>
        <div className="w-[90%] mt-11 relative">
          <div className=" flex items-center justify-between">
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
            <button className=" mr-4" onClick={handleSort}>
              <ImageWithLoader src={icons.sortSvg} alt="sort" />
            </button>
          </div>
          {userData && (
            <GiHamburgerMenu
              color="black"
              className=" absolute right-[4%] top-[20%] size-6 cursor-pointer"
              onClick={() => setShowOilGasMenu(true)}
            />
          )}
        </div>

        <div className=" mt-11 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11 w-[90%] mx-auto my-12 ">
        
              <ChemicalProductsCards
               items={filteredCards}
                navigate={navigate}
                sector={decodedPageId}
                splitTextInSpans={splitTextInSpans}
                sectorSection={decodedId}
              />
           
          </div>
        </div>
      </div>

      {showOilGasMenu && (
         <OilandGasProductsMenu
         services={products}
         setServices={setProducts}
         setShowChemicalMenu={setShowOilGasMenu}
         currentSecId={currentSubsectorProduct?._id}
         pageDecode={currentSubsectorProduct?.name}
       />
      )}
    </>
  );
}

export default OilandGasProducts;
