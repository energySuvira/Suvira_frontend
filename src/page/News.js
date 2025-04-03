import Header from "../component/Header";
import Footer from "../component/Footer";
import { useRef, useState, useEffect } from "react";
import NewsCardMenu from "../component/NewsCardMenu";
import { useRecoilValue } from "recoil";
import { News, userInfo } from "../Recoil";
import { GiHamburgerMenu } from "react-icons/gi";
import icons from "../assets";
import NewsViewCard from "../component/NewsCard";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { ImageWithLoader } from "../component/ImageLoader";
import PageBannerWithTitle from "../component/PageBannerWithTitle";

const NewsCard = () => {
  const targetDivRef = useRef(null);
  const news = useRecoilValue(News);
  const userData = useRecoilValue(userInfo);
  const [blogMenu, setBlogMenu] = useState(undefined);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [ViewNews, setViewNews] = useState(undefined);
  const Products = [
    { name: "All News" },
    { name: "Renewable Sector" },
    { name: "Water Treatment & Filtration" },
    { name: "Downhole & Wellbore" },
    { name: "Exploration & Production" },
    { name: "Chemical" },
    { name: "IT / IOT" },
    { name: "Pipeline Division" },
    { name: "Drilling Services" },
  ];

  const filteredBlogs = news?.filter(
    (blog) =>
      (selectedSector ? blog.sector === selectedSector : true) &&
      blog?.headline?.toLowerCase().includes(searchQuery?.toLowerCase())
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

  return (
    <>
      <Header />
      <PageBannerWithTitle backgroundImage={icons.newsBanner}  ref={targetTopRef} title={"News"}/>
     
      <div className="lg:px-6 px-4 mt-20 flex items-center justify-center flex-col font-[Poppins]">
        <div className="flex items-center justify-center w-[90%]">
          <h1
            className={`text-left text-2xl md:text-4xl ${
              ViewNews ? "w-[90%]" : "w-[90%]"
            } font-medium`}
          >
            Latest News
          </h1>
          {ViewNews ? (
            <IoIosCloseCircle
              onClick={() => setViewNews(undefined)}
              className="text-3xl cursor-pointer text-[#10100f] hover:text-black"
            />
          ) : (

            !showSearchBar ? ( <FiSearch
              className="size-7 text-[#000000] cursor-pointer "
              onClick={() => {
                setShowSearchBar(!showSearchBar);
                !showSearchBar && handleExploreClick();
              }}
            />) : ( <IoIosCloseCircle
               className="size-7 text-[#000000] cursor-pointer "
              onClick={() => {
              setShowSearchBar(false);
              !showSearchBar && handleExploreClick();
            }}/>)
           
          )}
         
        </div>
        <div className=" h-[1px] w-[90%] bg-black mt-10"></div>
        {ViewNews ? (
          <div className="mt-10 mb-10 flex flex-col items-center justify-center w-[90%]">
            <NewsViewCard Data={ViewNews} />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center mt-5 w-[90%]">
             
              {userData && (
                <span className="w-full mt-5 flex items-end justify-end">
                  <GiHamburgerMenu
                    onClick={() => setBlogMenu(true)}
                    className="cursor-pointer flex items-center justify-center text-2xl"
                  />
                </span>
              )}
            </div>
            {showSearchBar && (
              <div className="mt-10   w-[90%] ">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none  lg:w-[60] md:w-[80%] w-full xl:w-[50%] border border-[#05A6F0] bg-[#05A6F01A] p-2 px-5 rounded-xl"
                  placeholder="Search News Headline"
                />
              </div>
            )}
            <div
              className={`grid w-[98%]  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10 place-items-center`}
            >
              {filteredBlogs?.length > 0 ? (
                filteredBlogs?.map((e, index) => (
                  <div
                    key={index}
                    className="xl:w-full flex flex-col justify-between w-[90%] mt-10 rounded-3xl h-[650px] border-2 shadow-[inset_0px_0px_0px_1.5px_#05A6F0] bg-white text-black overflow-hidden"
                  >
                    <img
                      src={e.newsImg}
                      className="h-64 w-full object-cover"
                      alt="news banner"
                    />
                    <div className="w-full flex items-end justify-between">
                      <div className="flex text-[#10100f] font-semibold items-center justify-between py-2 px-6 w-full">
                        <div>
                          <span className="">{e.date}</span>
                        </div>
                        <div className="flex items-center justify-center gap-5">
                          <span className="">{e.publishedBy}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2  h-auto w-full text-2xl text-start flex font-semibold items-center">
                      {e.headline.slice(0, 100)}
                      {e.headline.length > 100 && "..."}
                    </span>
                    <div className="p-2">
                      <span className="text-[#10100f] h-[170px] flex text-left overflow-hidden text-[1rem]">
                        {e.news.slice(0, 300)}
                        {e.news.length > 300 && "..."}
                      </span>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className=" text-black font-semibold">
                            {e.sector}
                          </span>
                        </div>
                        <button
                          onClick={() => setViewNews(e)}
                          className="p-2 border-2 rounded-xl border-[#05A6F0] hover:text-white duration-500 cursor-pointer hover:bg-[#05A6F0] text-[#05A6F0] bg-[#05A6F01A]"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-4xl flex items-center justify-center mb-10 font-bold text-[#81BC06] mt-10">
                  <ImageWithLoader  src="/oops.jpg" className="w-[300px]" />
                  OOPS! No News Found
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
      {blogMenu && (
        <NewsCardMenu setShowBlogCardMenu={setBlogMenu} Blogss={news} />
      )}
    </>
  );
};

export default NewsCard;
