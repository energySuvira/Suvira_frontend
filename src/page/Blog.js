import Header from "../component/Header";
import Footer from "../component/Footer";
import { useRef, useState, useEffect } from "react";
import BlogCardMenu from "../component/BlogCardMenu";
import { useRecoilValue } from "recoil";
import { Blogs, userInfo } from "../Recoil";
import { GiHamburgerMenu } from "react-icons/gi";
import icons from "../assets";
import { HiOutlineSortAscending } from "react-icons/hi";
import { ImageWithLoader } from "../component/ImageLoader";
import PageBannerWithTitle from "../component/PageBannerWithTitle";
import { FiSearch } from "react-icons/fi";

import CutomerCard from "../component/CutomerCard";

const Blog = () => {
  const targetDivRef = useRef(null);

  const Blogss = useRecoilValue(Blogs) || [];

  const userData = useRecoilValue(userInfo);
  const [blogMenu, setBlogMenu] = useState(undefined);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const blogsPerPage = 3;
  const [sortOrder, setSortOrder] = useState(true);

  const handleSortClick = () => {
    setSortOrder(!sortOrder);
  };

  const handleNext = () => {
    if (currentIndex + blogsPerPage < Blogss.length) {
      setCurrentIndex(currentIndex + blogsPerPage);
    }
  };

  const handlePrevious = () => {
    if (currentIndex - blogsPerPage >= 0) {
      setCurrentIndex(currentIndex - blogsPerPage);
    }
  };



  const filteredBlogs = Blogss.filter(
    (blog) =>
      (selectedSector ? blog.sector === selectedSector : true) &&
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedBlogs = filteredBlogs.length > 0 ? filteredBlogs : Blogss;

  const handleExploreClick = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      <PageBannerWithTitle
        backgroundImage={icons.blogs1}
        title="Blogs"
        ref={targetTopRef}
      />

      <div className="xl:px-12 lg:px-10 md:px-4 mt-10 flex items-center justify-center flex-col font-[Poppins] w-full">
        <div className="flex items-center justify-between w-[90%]">
          <h1 className="text-left text-2xl md:text-4xl font-medium">Latest Blogs :</h1>
          <FiSearch
            className="size-7 text-[#000000] cursor-pointer "
            onClick={() => {
              setShowSearchBar(!showSearchBar);
              !showSearchBar && handleExploreClick();
            }}
          />
        </div>
        <div className=" h-[1px] w-[90%] bg-black mt-10"></div>

        <div className="flex flex-wrap items-center justify-center mt-5 w-full">
          {userData && (
            <span className="w-[90%] flex items-end justify-end ">
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
              className="outline-none bg-[#05A6F01A] border border-[#05A6F0] p-2 px-5 rounded-xl w-[90%] md:w-[60%] lg:w-[50%] "
              placeholder="Search Blogs Title"
            />
          </div>
        )}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-[100%] place-items-center">
          {displayedBlogs.length > 0 ? (
            displayedBlogs
              .slice(currentIndex, currentIndex + blogsPerPage)
              .map((blog, index) => (
                <CutomerCard
                  blogsPerPage={blogsPerPage}
                  length={displayedBlogs.length}
                  handlePrevious={handlePrevious}
                  handleNext={handleNext}
                  Blogss={blog}
                  key={index}
                  index={index}
                  img={blog.blogImg}
                  name={blog.author}
                  profileIcon={blog.authorImg}
                  desc={blog.title}
                  date={blog.Date}
                  time={blog.time}
                  navigateTo={"/blogs/blog-details"}
                  className={" w-[90%] md:w-[90%] lg:w-[95%] xl:w-[95%]"}
                />
              ))
          ) : (
            <div className="text-center text-4xl flex items-center justify-center mb-10 font-bold text-[#81BC06] mt-10">
              <ImageWithLoader src="/oops.jpg" className="w-[300px]" />
              OOPS! No Blogs Found
            </div>
          )}
        </div>
        <div className=" h-[1px] w-[90%] bg-black mt-10"></div>
        <div className="flex items-center justify-between w-[90%] mt-10">
          <h1 className="text-left text-2xl md:text-4xl font-medium">
            {sortOrder ? "Most Famous" : "Latest "} Blogs :
          </h1>
          {sortOrder ? (
            <img
              src={icons.sortSvg}
              alt="sort"
              className="cursor-pointer"
              onClick={handleSortClick}
            />
          ) : (
            <HiOutlineSortAscending
              onClick={handleSortClick}
              size={32}
              cursor="pointer"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-[100%]  mb-10">
          {Blogss?.length > 0 ? (
            [...Blogss]
              .sort((a, b) => {
                const likesComparison = sortOrder
                  ? b.likes - a.likes
                  : a.likes - b.likes;
                if (likesComparison !== 0) return likesComparison;
                return b.views - a.views;
              })
              .map((e, index) => (
                <div
                  key={index}
                  className="mt-10 mb-10 flex flex-col items-center justify-center"
                >
                  <CutomerCard
                    blogsPerPage={blogsPerPage}
                    length={Blogss.length}
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                    Blogss={e}
                    key={index}
                    index={index}
                    img={e.blogImg}
                    name={e.author}
                    profileIcon={e.authorImg}
                    desc={e.title}
                    date={e.Date}
                    time={e.time}
                    navigateTo={"/blogs/blog-details"}
                    className={" w-[90%] md:w-[90%] lg:w-[95%] xl:w-[95%]"}
                  />
                </div>
              ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      </div>
      <Footer />
      {blogMenu && (
        <BlogCardMenu setShowBlogCardMenu={setBlogMenu} Blogss={Blogss} />
      )}
    </>
  );
};

export default Blog;
