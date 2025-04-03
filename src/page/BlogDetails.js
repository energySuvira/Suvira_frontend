import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageBannerWithTitle from "../component/PageBannerWithTitle";
import { FaThumbsUp } from "react-icons/fa6";
import Header from "../component/Header";
import icons from "../assets";
import { IoHeartCircleOutline } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
import CutomerCard from "../component/CutomerCard";
import { useRecoilValue } from "recoil";
import { Blogs } from "../Recoil";
import Footer from "../component/Footer";

function BlogDetails() {
  const Blogss = useRecoilValue(Blogs) || [];
  const targetTopRef = useRef(null);
  const location = useLocation();
  const { blogDetails } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const blogsPerPage = 3;

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

  const handlePageLoads = () => {
    if (targetTopRef.current) {
      targetTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handlePageLoads();
  }, []);

  const scrollToTop = () => {
    if (targetTopRef.current) {
      targetTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [location]);

  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  let todaysDate = today.toLocaleDateString();

  function sliceContent(content) {
    if (!content || typeof content !== "string")
      return { part30: "", part70: "" };

    const slicePoint = Math.floor(content.length * 0.3);
    const part30 = content.slice(0, slicePoint);
    const part70 = content.slice(slicePoint);

    return { part30, part70 };
  }

  const { part30, part70 } = sliceContent(blogDetails.content);

  if (!blogDetails) {
    return <p>No blog details available.</p>;
  }

  return (
    <>
      <Header />
      <PageBannerWithTitle
        backgroundImage={icons.blogs1}
        title="Blogs"
        ref={targetTopRef}
      />
      <div className=" mt-10 flex flex-col items-center w-full font-[Poppins]">
        <div className=" h-[1px] w-[90%] bg-black"></div>
        <div className=" w-[85%] mt-6 flex flex-col items-center  text-lg">
          <div className=" w-[84%] flex flex-col sm:flex-row items-center justify-between">
            <h4>{todaysDate}</h4>
            <h4>Published time: {blogDetails.time}</h4>
          </div>
          <div className=" h-[1px] w-full bg-black mt-6"></div>
        </div>

        <h1 className="  text-4xl text-center mt-10">{blogDetails.title}</h1>
        <div className=" h-[1px] w-[85%] bg-black mt-10 "></div>
        <div className=" w-[80%] mt-10 flex flex-col gap-10">
          <p className=" text-xl font-normal text-left leading-9">{part30}</p>
          <img
            src={blogDetails.blogImg}
            alt="Blog"
            className="w-full max-h-[315px] object-cover object-center rounded-lg cursor-pointer"
            onClick={() => handleImageClick(blogDetails.blogImg)}
          />
          <p className=" text-xl font-normal text-left leading-9">{part70}</p>
        </div>
        <div className=" h-[1px] w-[85%] bg-black mt-10 "></div>

        <div className=" flex w-[80%] justify-between items-center mt-10">
          <div>
            <h4 className=" text-black text-[22px] font-medium">
              Blog Writer :
            </h4>
            <h4 className=" text-black text-lg font-normal mt-2">
              {blogDetails.author}
            </h4>
          </div>
          <div className=" flex items-center gap-7 justify-between">
            <div className=" text-center">
              <FaThumbsUp className=" mb-2 size-8" />
              <h4 className=" text-xl">{blogDetails.likes}</h4>
            </div>
            <div className=" text-center">
              <IoMdEye className=" mb-2 size-8" />
              <h4 className=" text-xl"> {blogDetails.views}</h4>
            </div>
          </div>
        </div>
        <div className=" h-[1px] w-[90%] bg-black mt-10"></div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-[90%] place-items-center mt-10 mb-10">
          {Blogss?.length > 0 ? (
            Blogss.filter((e) => e.title !== blogDetails.title)
              .slice(currentIndex, currentIndex + blogsPerPage)
              .map((e, index) => (
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
              ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      </div>

      <Footer />

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative  h-[500px]">
            <img
              src={modalImage}
              alt="Full Preview"
              className="max-w-[90%] max-h-[90%] rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute -top-2 right-1 bg-white text-black size-6 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BlogDetails;
