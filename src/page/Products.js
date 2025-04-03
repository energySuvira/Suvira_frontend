import { useEffect, useRef, useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import image77 from "../assets/image/image77.png";
import icons from "../assets";
import ProductDiv from "../component/Product";
import { GiHamburgerMenu } from "react-icons/gi";
import ProductMenu from "../component/ProductMenu";
import { useRecoilValue } from "recoil";
import { Products, selectedIndustries, userInfo } from "../Recoil";
import { BiSolidFileFind } from "react-icons/bi";
import { ImageWithLoader } from "../component/ImageLoader";

const Product = () => {
  const targetDivRef = useRef(null);
  const MainProducts = useRecoilValue(Products);
  const selectedIndustry = useRecoilValue(selectedIndustries);
  const userData = useRecoilValue(userInfo);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [selectedSector, setSelectedSector] = useState(
    selectedIndustry ? selectedIndustry : "Renewable Sector"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const Products1 = [
    { name: "Renewable Sector" },
    { name: "Water Treatment & Filtration" },
    { name: "Downhole & Wellbore" },
    { name: "Exploration & Production" },
    { name: "Chemical" },
    { name: "IT / IOT" },
    { name: "Pipeline Division" },
    { name: "Drilling Services" },
  ];

  const filteredAndSortedProducts = MainProducts?.filter(
    (product) =>
      (selectedSector ? product.sector === selectedSector : true) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExploreClick = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
    }
  };

  // Ensure the ref is correctly set after showSearchBar changes
  useEffect(() => {
    if (showSearchBar && targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showSearchBar]);

  const targetTopRef = useRef(null);

  const handlePageLoads = () => {
    if (targetTopRef.current) {
      targetTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handlePageLoads();
  }, []);

  useEffect(() => {
    if (selectedIndustry) {
      setSelectedSector(selectedIndustry);
    }
  }, [selectedIndustry]);

  return (
    <>
      <Header />
      <img
        ref={targetTopRef}
        src={"/product-new.jpg"}
        className="w-full h-[374px] object-cover"
        alt=""
      />
      <div className="px-16 flex font-semibold">
        <p className="text-white text-5xl mt-[-6rem]">Offerings</p>
      </div>
      <div className="px-12 mt-20 flex items-center justify-center flex-col">
        <div className="flex items-start justify-start w-[1032px] gap-10">
          <h1 className="text-left text-5xl w-[60vw] font-bold">
            <span className="text-[#81BC06]">Explore Our Offerings:</span>{" "}
            Unveiling Innovative Solutions for Every Need
          </h1>
          <BiSolidFileFind
            className="text-5xl text-[#81BC06] cursor-pointer "
            onClick={() => {
              setShowSearchBar(!showSearchBar);
              !showSearchBar && handleExploreClick();
            }}
          />
        </div>
        <div className=" flex flex-wrap items-center justify-center mt-10  w-[1032px]">
          <div className="flex flex-wrap items-start justify-start w-[1032px]">
            {Products1.map((e, index) => (
              <span
                ref={targetDivRef}
                key={index}
                onClick={() => setSelectedSector(e.name)}
                className={`${
                  selectedSector === e.name ? "bg-[#FFBA08]" : "border-2"
                } text-center cursor-pointer hover:bg-[#FFBA08] mt-4 mr-4 border-[#878787] p-2 rounded-lg`}
              >
                {e.name}
              </span>
            ))}
          </div>
          {userData && (
            <span className="w-full flex items-end justify-end mt-[-2rem]">
              <GiHamburgerMenu
                onClick={() => setShowProductMenu(true)}
                className="cursor-pointer flex items-center justify-center text-2xl"
              />
            </span>
          )}
        </div>
        {showSearchBar && (
          <div className=" mt-10 border-2 border-[#81BC06] p-2 px-5 w-[1032px] rounded-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none w-full"
              placeholder="Search Product Name"
            />
          </div>
        )}
        <div className="mt-10">
          {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((e, index) => (
              <ProductDiv
                key={index}
                img={e.image}
                Appearance={e.appearance}
                Grade={e.grade}
                name={e.name}
                desc={e.desc}
                Applications={e.applications}
              />
            ))
          ) : (
            <div className="text-center text-4xl flex items-center justify-center mb-10 font-bold text-[#81BC06] mt-10">
              <ImageWithLoader
                src="/oops.jpg"
                className="w-[300px]"
                alt="Oops"
              />
              OOPS! No Offerings Found
            </div>
          )}
        </div>
      </div>
      <Footer />
      {showProductMenu && (
        <ProductMenu
          feedbacks={MainProducts}
          setShowFeedbackCardMenu={setShowProductMenu}
        />
      )}
    </>
  );
};

export default Product;
