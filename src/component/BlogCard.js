import React from "react";
import icons from "../assets";
import { IoMdEye } from "react-icons/io";
import { IoHeartCircleOutline } from "react-icons/io5";
import { DescriptionComponent } from "./DescriptionComponent";
import { ImageWithLoader } from "./ImageLoader";

function BlogCard({
  img,
  time,
  profileIcon,
  author,
  Date,
  views,
  likes,
  title,
  description,
}) {
  return (
    <div className="w-[1032px] border-2 bg-[#05A6F01A] border-[#05A6F0]  rounded-lg">
      <ImageWithLoader
        src={img}
        className="w-[1037px] h-[450px] rounded-t-lg object-cover"
      />
      <div className="flex items-center justify-between p-10 pb-0">
        <span className="flex items-center justify-center gap-2">
          <ImageWithLoader
            src={profileIcon}
            className="w-[33.73px] h-[34.29px] rounded-full"
          />
          <span>{author}</span>
        </span>
        <span className="flex items-center justify-center gap-2">
          <img loading="lazy" src={icons.clock} />
          <span className="flex items-center justify-center">{`${Date}${" "}|${" "}${time}`}</span>
        </span>
        <span className="flex items-center justify-center gap-2">
          <IoMdEye className="text-2xl" />
          <span>{views}</span>
        </span>
        <span className="flex items-center justify-center gap-2">
          <IoHeartCircleOutline className="text-2xl" />
          <span>{likes}</span>
        </span>
      </div>
      <span className="flex text-start items-center justify-center p-10 text-2xl font-semibold">
        {title}
      </span>
      <span className="flex mb-10 flex-col text-start items-center justify-center px-10 text-2xl font-normal text-[1rem] text-[#10100f] whitespace-pre-line">
        <DescriptionComponent description={description} />
      </span>
    </div>
  );
}

export default BlogCard;
