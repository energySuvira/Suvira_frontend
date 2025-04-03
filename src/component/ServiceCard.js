import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ServiceReadMore } from "../Recoil";

function ServiceCard({ icon, heading, id, detail, index, services }) {
  const [lastbox, setLastBox] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLastBox(index === services.length - 1);
  }, [index, services]);

  return (
    <>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="bg-white w-[255px] py-10 px-2 min-h-[300px] h-[300px] rounded-xl gap-12 hover:bg-[#81BC06] cursor-pointer flex flex-col justify-center"
      >
        <div
          className={`${
            lastbox && "relative"
          } flex items-center justify-center flex-col text-center`}
        >
          <div className="flex items-center justify-center w-[80px] h-[80px] bg-[#05A6F0] rounded-full">
            <img
              src={icon}
              alt="icon"
              className="w-[50px] h-[50px] object-cover"
            />
          </div>
          <p className="font-semibold text-xl mt-4 mb-2">{heading}</p>
          <p className="text-center flex flex-col items-center justify-center text-[#10100F] px-5">
            {detail.slice(0, 40) + "..."}
            <br />
            <br />
            <span
              className={`text-left ${
                show ? "flex" : "hidden"
              } border-2 p-2 w-[126px]  hover:bg-[#81BC06] rounded-lg flex items-center justify-center h-[39px] border-[#878787] text-black cursor-pointer`}
              onClick={() =>
                navigate(`/services/${encodeURIComponent(heading)}`)
              }
            >
              Explore
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default ServiceCard;
