import React from "react";
import icons from "../assets";
import { DescriptionComponent } from "./DescriptionComponent";

function NewsViewCard({ Data }) {
  return (
    <div className="w-[100%] shadow-[inset_0px_0px_0px_1.5px_#05A6F0] rounded-lg">
      <img
        src={Data?.newsImg}
        className="w-full h-[450px] object-cover object-center rounded-t-lg"
        alt="news banner"
      />
      <div className="flex items-center justify-between px-20 py-10 text-[#10100f] text-[1.2rem] pb-0">
        <span className="flex items-center justify-center gap-2">
          <span>{Data?.publishedBy}</span>
        </span>
        <span className="flex items-center justify-center gap-2">
          <img loading="lazy" src={icons.clock} alt="clock" />
          <span className="flex items-center justify-center">{`${Data?.date}`}</span>
        </span>
        <span className="flex items-center justify-center gap-2">
          <span>{Data?.sector}</span>
        </span>
      </div>
      <span className="flex text-start items-start justify-start px-20 p-10 text-2xl font-semibold">
        {Data?.headline}
      </span>
      <span className="flex mb-10 flex-col text-start items-center justify-center px-20 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
        <DescriptionComponent description={Data?.news} />
      </span>
    </div>
  );
}

export default NewsViewCard;
