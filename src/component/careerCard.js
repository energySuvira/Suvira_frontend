import React from "react";
import ReadMoreBtn from "./ReadMoreBtn";
import { useNavigate } from "react-router-dom";

function CareerCard({
  Date,
  handleExploreClick,
  jobId,
  setjobid,
  City,
  name,
  Tag,
  details,
}) {
  const Details = details
    .split(",")
    .map((app) => app.trim())
    .filter((app) => app);
    const navigate = useNavigate();
  return (
    <div className="bg-white border-[1px] border-[#000000] py-7 px-5 xl:max-w-[24rem] md:w-[24rem] rounded-xl flex flex-col items-center justify-between min-h-[460px] font-[Poppins]">
      <span className="flex items-center justify-center w-full overflow-hidden">
        <span className="flex px-2 text-xl items-start text-[#878787] justify-between w-full mb-2">
          <span className=" whitespace-nowrap">{Date}</span>
          <span className=" whitespace-nowrap">
            {City.length > 10 ? City.slice(0, 10) + "..." : City}
          </span>
        </span>
      </span>
      <h3 className="text-[32px]  w-full font-semibold flex items-center justify-center capitalize">
        {name}
      </h3>
      <span className="flex w-full px-2 flex-wrap items-center justify-center mb-5 gap-3">
        {Tag &&
          Tag.map((e, index) => {
            return (
              <span
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-[#81BC06]" : "bg-[#05A6F0]"
                } text-[16px] h-[39px] px-3  text-white p-2 rounded-xl font-normal flex items-center justify-center mb-2 capitalize`}
              >
                {e}
              </span>
            );
          })}
      </span>
      <ul className=" text-[#10100f] font-medium mb-2 text-[1.1rem] list-disc xl:w-[100%] w-[90%] xl:ml-10 lg:ml-7 md:ml-3 ml-1 overflow-hidden">
        {Details.map((app, index) => (
          <li className=" xl:w-[100%] w-[80%]" key={index}>
            {app.slice(0, 30) + "..."}
          </li>
        ))}
      </ul>

      <ReadMoreBtn
        text={"Apply Now"}
        onClick={() => {
          setjobid(jobId);
          handleExploreClick();
          navigate(`${encodeURIComponent(name)}/${encodeURIComponent(jobId)}`)
        }}
      />
    </div>
  );
}

export default CareerCard;
