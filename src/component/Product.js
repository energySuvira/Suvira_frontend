import React from "react";

function ProductDiv({ img, Appearance, Grade, name, desc, Applications }) {
  const applicationList = Applications.split(",")
    .map((app) => app.trim())
    .filter((app) => app);

  return (
    <div className="max-w-[1030px] border-2 border-[#81BC06] rounded-lg overflow-hidden mb-10 bg-[#F8F8F8]">
      <div>
        <img
          src={img}
          alt="Product"
          className="w-[1030px] object-cover h-[464px]"
        />
      </div>
      <span className="p-5 pb-0 px-10 flex items-center justify-between w-full">
        <span>
          Physical Appearance :{" "}
          {<span className="font-semibold mr-40">Appearance</span>}
        </span>
        <span>
          Grade : <span className="font-semibold">{Grade}</span>
        </span>
      </span>
      <br />
      <span className="p-5 px-10 font-bold text-2xl text-[#10100F]">
        {name}
      </span>
      <br />
      <span className="w-[100%] text-justify text-[#10100f] p-5 px-10 flex items-start justify-center">
        {desc}
      </span>
      <br />
      <span className="p-5 px-10 font-semibold text-2xl text-[#10100F]">
        Applications :
      </span>
      <span>
        <ul className="p-5 px-10 text-[1rem] list-disc">
          {applicationList.map((app, index) => (
            <li className="text-[#10100f]" key={index}>
              {app}
            </li>
          ))}
        </ul>
      </span>
    </div>
  );
}

export default ProductDiv;
