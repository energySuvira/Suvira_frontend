import React from "react";
import icons from "../assets";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { BlogDetails } from "../Recoil";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import ReadMoreBtn from "./ReadMoreBtn";

function CutomerCard({
  index,
  img,
  name,
  profileIcon,
  desc,
  date,
  time,
  Blogss,
  handlePrevious,
  handleNext,
  blogsPerPage,
  length,
  showOrHide = false,
  navigateTo,
  className
}) {
  const setBlogDetails = useSetRecoilState(BlogDetails);
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  let todaysDate = today.toLocaleDateString();
  return (
    <>
      <div className={`${className} h-[459px]  bg-white  rounded-lg font-[Poppins] pb-3 flex flex-col gap-6 shadow-[inset_0px_0px_0px_1px_#05A6F0]`} >
        <div
          className="w-full h-[262px] bg-no-repeat bg-cover rounded-lg blogCard relative"
          style={{ backgroundImage: `url(${img})` }}
        >
          <span className="absolute text-white top-2 right-2">
            {date || todaysDate}
          </span>

          <div className="absolute bottom-0 left-0 w-full flex items-center justify-between p-3">
            <div className="flex gap-3 items-center">
              <img
                src={profileIcon}
                alt="profile"
                className="size-8 rounded-full border-black border-[1px] object-cover object-center"
              />
              <span className="text-white text-base">{name}</span>
            </div>
            <button className="size-7 rounded-full ">
              <img
                src={icons.heart}
                alt="Like Button"
                className="size-7 rounded-full"
              />
            </button>
          </div>
        </div>
        <div className=" flex flex-col items-center gap-4">
          <p className="flex text-lg px-2">
            {desc.split(" ").length < 6 ? desc : desc.slice(0, 30) + "..."}
          </p>
          <Link
            to={navigateTo}
            state={{ blogDetails: Blogss }}
            className=" w-full grid place-items-center"
          >
            <ReadMoreBtn
              text="Read More"
              onClick={() => setBlogDetails(Blogss)}
            />
          </Link>
        </div>
      </div>

      {showOrHide && index === 0 && (
        <div className="absolute flex items-start justify-start  gap-6 bottom-[-7%] md:bottom-[-15%] left-[50%] translate-x-[-50%]">
          <BiLeftArrowAlt
            onClick={handlePrevious}
            className={`p-2 cursor-pointer hover:bg-[#C5F200] text-5xl rounded-full bg-[#81BC06] select-none ${
              index === 0 ? "text-white" : "text-white"
            } `}
          />
          <BiRightArrowAlt
            onClick={handleNext}
            className={`p-2 select-none cursor-pointer hover:bg-blue-500 text-5xl rounded-full bg-[#05A6F0] ${
              index + blogsPerPage >= length ? "text-white" : "text-white"
            }`}
          />
        </div>
      )}
    </>
  );
}

export default CutomerCard;
