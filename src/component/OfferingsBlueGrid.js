import React from "react";

function OfferingsBlueGrid({
  items = [],
  bgColor = "bg-virablue",
  onCardClick,
  hoverEffect = true,
}) {
  return (
    <div
      className={`${bgColor} py-11 mt-12 px-9 flex flex-col items-center justify-center`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-11 w-[90%] mx-auto">
        {items.map((item, index) => (
          <div
            key={item._id || index}
            className={`bg-white p-4 flex flex-col items-center justify-between rounded-xl gap-4 text-center shadow-md min-h-[288px] ${
              hoverEffect
                ? "hover:bg-slate-200 transition-all ease-in-out duration-700 cursor-pointer"
                : ""
            }`}
            onClick={() => onCardClick && onCardClick(item)}
          > 
          <div className=" size-20 bg-[#81BC06] rounded-full grid place-items-center text-[#10100F]">
            <img src={item?.logo} alt={item?.name} className=" max-w-[50px] max-h-[50px] "  />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl max-w-[60%] text-[#10100F] font-normal">
              {item?.name}
            </h3>
            <p className="text-sm sm:text-base text-[#10100F] w-[95%] overflow-clip">
              {item?.description?.slice(0, 50)+"..."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferingsBlueGrid;
