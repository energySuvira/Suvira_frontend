import React from "react";
import { BiRightArrowAlt, BiLeftArrowAlt } from "react-icons/bi";
import icons from "../assets";
import { FaStar } from "react-icons/fa";

function FeedbackCard({
  img,
  desc,
  author,
  rating,
  index,
  setFeedbackIndex,
  Feebacks,
  hidden = false,
}) {
  const returnRating = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-3xl ${
            i < rating ? "text-[#F2CE0C]" : "text-gray-400"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="  flex gap-10   items-center w-full font-[Poppins] md:gap-16 md:justify-center flex-col md:flex-row justify-center mt-3 pb-14">
      <div
        className=" rounded-xl lg:w-[350px] lg:h-[500px] md:w-[250px] md:h-[350px] sm:w-[50%] sm:h-[400px] w-[80%] h-[450px]"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover ",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="  bg-no-repeat max-w-[90%] min-w-[300px] md:max-w-[50%] lg:min-w-[450px] xl:max-w-[80%] relative">
        <div className="lg:p-5 p-2 relative text-[#10100F] lg:text-2xl text-lg font-normal">
          <p className="lg:text-xl md:text-base sm:text-base text-sm md:w-[90%] xl:min-w-[350px] w-full relative break-words">
            <img
              loading="lazy"
              src={icons.doublearrowend}
              alt="arrow-img"
              className=" absolute -top-8 -left-8 rotate-180"
            />
            {desc}
            <img
              loading="lazy"
              src={icons.doublearrowend}
              alt="arrow-img"
              className=" absolute -bottom-8 right-0"
            />
          </p>
        </div>

        <div className="px-5 flex items-center justify-between w-full">
          <span>{author}</span>
        </div>
        <div className="py-5 flex items-center justify-between w-full">
          <span className="flex items-center justify-center">
            {returnRating()}
          </span>
        </div>
        <div className="absolute xl:bottom-[-2%] xl:right-[10%] lg:right-[15%] lg:bottom-[0%] md:right-[20%] md:bottom-[-10%] flex-row flex gap-2 md:flex-col">
          <BiLeftArrowAlt
            onClick={() => {
              index > 0
                ? setFeedbackIndex(index - 1)
                : setFeedbackIndex(Feebacks.length - 1);
            }}
            className={`p-2 cursor-pointer   hover:bg-[#C5F200] text-5xl rounded-full bg-[#81BC06] select-none text-white ${
              hidden && "hidden"
            }`}
          />
          <BiRightArrowAlt
            onClick={() => {
              index + 1 < Feebacks.length
                ? setFeedbackIndex(index + 1)
                : setFeedbackIndex(0);
            }}
            className={`p-2 select-none  cursor-pointer hover:bg-blue-500 text-5xl rounded-full bg-[#05A6F0]  text-white ${
              hidden && "hidden"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedbackCard;
