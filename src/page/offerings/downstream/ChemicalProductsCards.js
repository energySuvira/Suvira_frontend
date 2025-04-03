const ChemicalProductsCards = ({
  items = [],
  navigate,
  splitTextInSpans,
  sectorSection,
  sector
}) => {
  const getFirstCustomFieldValue = (customFields) => {
    if (!customFields || customFields.length === 0) return "";
    return customFields[0].fieldValue?.trim().slice(0,15) || "";
  };

  return (
    <>
      {items?.map((item) => (
        <div
          key={item?._id}
          className="bg-white p-5 flex flex-col items-center justify-evenly rounded-xl gap-4 shadow-md hover:bg-[#05A6F01A] transition-all ease-in-out duration-500 cursor-pointer border-[1px] border-black hover:border-[#05A6F0] hoverChemCard"
          onClick={() =>
            navigate(
              `/offerings/${sector}/${encodeURIComponent(sectorSection)}/${encodeURIComponent(item?.name)}`,
              { 
                state: { 
                  productData: {
                    ...item,
                    sectorSection,
                    sector,
                    appearance: getFirstCustomFieldValue(item?.customFields)
                  }
                } 
              }
            )
          }
        >
          <img
            src={item?.logo}
            alt={item?.name}
            className="w-full aspect-square rounded-md object-cover"
          />
          <div className="w-full h-[1px] bg-black hoverGridborder"></div>
          <h1 className="text-lg font-[Poppins] font-medium text-left w-full">
            {splitTextInSpans(
              getFirstCustomFieldValue(item?.customFields),
              "text-black hovertext",
              "text-black"
            )}
          </h1>
          <div className="w-full h-[1px] bg-black hoverGridborder"></div>
          <p className="text-[#10100F] w-full text-xl">
            {splitTextInSpans(
              item.name?.split(" ").length > 5
                ? item?.name?.split(" ").slice(0, 15).join(" ") + "..."
                : item?.name,
              "text-black hovertextGreen",
              "text-black",
              2
            )}
          </p>
        </div>
      ))}
    </>
  );
};

export default ChemicalProductsCards;