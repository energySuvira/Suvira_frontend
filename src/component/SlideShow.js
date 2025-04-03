import React from "react";

import icons from "../assets";

function SlideShow({ Slides }) {
  return (
    <div className="relative lg:h-[786px] md:h-[500px] h-[300px] w-full border-gray-600 shadow-lg overflow-hidden">
      <div className="flex items-center w-full justify-center h-full select-none">
        {Slides?.map((slide, index) => (
          <video
            loop
            autoPlay
            muted
            key={index}
            className=" w-full h-full lg:object-cover transition-opacity object-cover"
          >
            <source src={icons.bannerVideo} type="video/mp4" />
          </video>
        ))}
      </div>
      {/* Forward and backward buttons */}
    </div>
  );
}

export default SlideShow;
