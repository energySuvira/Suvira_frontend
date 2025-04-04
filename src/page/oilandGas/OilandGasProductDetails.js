import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import PageBannerWithTitle from "../../component/PageBannerWithTitle";
import icons from "../../assets";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { oilandGasCards } from "../../mockData/chemicalsData";
import ChemicalProductsCards from "../offerings/downstream/ChemicalProductsCards";
import Footer from "../../component/Footer";
import ReadMoreBtn from "../../component/ReadMoreBtn";
import { ImageWithLoader } from "../../component/ImageLoader";
import { IoSearchOutline } from "react-icons/io5";
import { useRecoilValue } from "recoil";
import { Sectors } from "../../Recoil";
import { GET_CATEGORIES } from "../../Api";
import Loading from "../../component/Loading";
import { toast } from "react-toastify";

function OilandGasProductDetails() {
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const { sectorId, pageId, id } = useParams();
  const decodedSectorId = decodeURIComponent(sectorId);
  const decodedPageId = decodeURIComponent(pageId);
  const decodedId = decodeURIComponent(id);
  const location = useLocation();
  const { productData } = location.state || {};
  const sectors = useRecoilValue(Sectors);
  const currentSubsector = sectors
    ? sectors.find((s) => s.name === decodedSectorId)
    : null;

  const currentSubsectorProduct = currentSubsector?.subsectors.find(
    (s) => s.name === decodedPageId
  );


 

 
  const {
    logo,
    item,
    name,
    description,
    pdf,
    customFields = [],
    sector,
    sectorSection,
  } = productData || {};

  const ProductField = ({ label, value, coloredWord }) => {
    if (!value?.trim()) return null;

    return (
      <div className=" flex gap-2">
        <h3 className="text-xl font-medium">
          {coloredWord && <span className="text-[#05A6F0]">{coloredWord}</span>}
          <span>
            {coloredWord ? " " : ""}
            {label}
          </span>
        </h3>
        <p className="text-lg">{value}</p>
      </div>
    );
  };

  const BenefitsField = ({ label, benefits }) => {
    if (!benefits || benefits.length === 0) return null;

    // Function to limit words in a string
    const limitWords = (text, limit = 30) => {
      const words = text.split(" ");
      if (words.length <= limit) return text;
      return words.slice(0, limit).join(" ") + "...";
    };

    return (
      <>
        <h3 className="text-2xl font-medium mt-6">
          <span>{label}</span>
        </h3>
        <ul className="list-disc ml-8 text-lg">
          {benefits.map((benefit, index) => (
            <li key={index}>{limitWords(benefit)}</li>
          ))}
        </ul>
      </>
    );
  };



  const getBenefits = () => {
    const benefitsField = customFields?.find((f) =>
      f.fieldName.toLowerCase().includes("benefits")
    );
    if (!benefitsField?.fieldValue) return [];

    
    return benefitsField.fieldValue
      .split(/[.\n]/)
      .map((benefit) => benefit.trim())
      .filter((benefit) => benefit.length > 0);
  };
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

  const renderLabel = (label) => {
    if (!label || typeof label !== "string") return { first: "", rest: "" };
    const words = label.split(" ");
    return {
      first: words[0] || "",
      rest: words.slice(1).join(" "),
    };
  };

  const leftSideFields = ["composition", "grade", "appearance", "solubility"];

  
  const renderLeftSideFields = (fields) => {
    return fields
      .filter((field) =>
        leftSideFields.some((leftField) =>
          field.fieldName.toLowerCase().includes(leftField.toLowerCase())
        )
      )
      .map((field, index) => (
        <ProductField
          key={index}
          label={`${field.fieldName} :`}
          value={field.fieldValue}
        />
      ));
  };

  const renderRightSideFields = (fields) => {
    return fields
      .filter(
        (field) =>
          !leftSideFields.some((leftField) =>
            field.fieldName.toLowerCase().includes(leftField.toLowerCase())
          ) && !field.fieldName.toLowerCase().includes("benefits")
      )
      .map((field, index) => {
        const { first, rest } = renderLabel(field.fieldName);
        return (
          <div key={index}>
            <h3 className="text-2xl font-medium mt-4">
              <span className="text-[#05A6F0]">{first}</span>
              {rest && <span>{" " + rest}</span>}
            </h3>
            <p className="text-lg font-normal mt-2">{field.fieldValue}</p>
          </div>
        );
      });
  };

  useEffect(() => {
    const fetchAndMatchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await GET_CATEGORIES();
        const currentSector = sectors?.find((s) => s.name === decodedSectorId);
        const currentSubsector = currentSector?.subsectors?.find(
          (s) => s.name === decodedPageId
        );

        if (!currentSubsector?.categories) {
          setProducts([]);
          return;
        }

        const matchedProducts = categoriesData.filter(
          (category) =>
            currentSubsector.categories.includes(category._id) &&
            category._id !== productData?._id
        );

        setProducts(matchedProducts);
        setFilteredProducts(matchedProducts);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setProducts([]);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndMatchCategories();
  }, [sector, currentSubsectorProduct, currentSubsector]);

  const filteredCards = products.filter(card => 
    card.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
    card._id !== productData?._id
  );

    const handlePdfDownload = async () => {
      try {
        if (pdf) {
          
          const response = await fetch(pdf, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/pdf",
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          
          const filename = `${name}-document.pdf`;
  
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
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const filtered = searchQuery.length >= 4 
      ? products.filter((product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  
  return (
    <>
      <Header />
      <PageBannerWithTitle
        backgroundImage={icons.offeringsOilandGas}
        title={decodedPageId}
      />

      <div className="mt-11 w-full flex justify-center items-center flex-col">
        <div className=" flex items-center justify-between w-[80%]">
          <div className=" w-[70%] xl:w-[530px]  bg-[#05A6F01A] border border-[#05A6F0] p-[11px] rounded-[50px] flex items-center hover:border-[#0c8ce9]">
            <IoSearchOutline className=" size-6 mr-3" />
            <input
              type="text"
              placeholder="Search Products"
              className=" w-full h-full border-none outline-none focus:border-[1px] focus:border-black placeholder:text-black bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className=" mr-4">
            <ImageWithLoader src={icons.sortSvg} alt="sort" />
          </button>
        </div>

        <div className="h-[1px] w-[90%] bg-black mt-11 hidden md:block"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11 w-[90%] mx-auto my-11">
        {searchQuery.length < 4 ? (
   ""
  ) : filteredProducts.length > 0 ? (
    <ChemicalProductsCards
      items={filteredProducts}
      navigate={navigate}
      sector={decodedSectorId}
      splitTextInSpans={splitTextInSpans}
      sectorSection={decodedPageId}
    />
  ) : (
    <div className="col-span-full text-center py-8">
      No products found matching your search
    </div>
  )}
        </div>

        <div className="xl:w-[80%] justify-center items-center gap-8   mt-11 flex lg:items-start lg:justify-between mb-11 flex-col lg:flex-row w-[90%]">
          <div className="flex flex-col gap-5 lg:w-[35%] w-full  text-left lg:order-1 order-2">
            <img
              src={logo}
              alt={name}
              className=" h-[700px] xl:w-[470px] w-[90%] object-cover rounded-md"
            />

            {renderLeftSideFields(customFields)}

            <ReadMoreBtn text="Download PDF" onClick={handlePdfDownload} />
          </div>
          <div className=" lg:w-[62%] w-full flex flex-col gap-5 lg:order-2 order-1">
            <h1 className=" md:text-4xl text-3xl  font-[Poppins] font-medium xl:leading-[3rem]">
              {splitTextInSpans(name, "text-[#81BC06]", "text-black", 2)}
            </h1>
            <div className="h-[1px] w-full bg-black mt-5"></div>
            <h3 className=" text-2xl font-medium mt-6">
              <span className=" text-[#05A6F0]">Product</span>
              <span> Description :</span>
            </h3>

            <p className="text-lg font-normal">{description}</p>

            <BenefitsField label="Benefits :" benefits={getBenefits()} />

            {renderRightSideFields(customFields)}
            
          </div>
        </div>
        <div className="h-[1px] w-[90%] bg-black "></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11 w-[90%] mx-auto my-11 ">
          <ChemicalProductsCards
            items={products}
            navigate={navigate}
            sector={decodedSectorId}
            splitTextInSpans={splitTextInSpans}
            sectorSection={decodedPageId}
          />
        </div>
      </div>
      <Footer />
      {isLoading && <Loading />}
    </>
  );
}

export default OilandGasProductDetails;
