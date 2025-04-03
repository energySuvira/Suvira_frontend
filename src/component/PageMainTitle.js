import React from 'react'

function PageMainTitle({greenColorText, blackColorText,margin,borderBg}) {
  return (
    <h1 className={`text-center w-full flex flex-col items-center ${margin}`}>
    <span className="text-4xl sm:text-3xl  font-[Poppins] font-medium">
      <span className="text-[#81BC06] ">{greenColorText}</span> {blackColorText}
    </span>
    <div className={`h-[5px] w-[100px] ${borderBg ==="" ? "bg-[#05A6F0]": borderBg } bg-[#05A6F0] mb-8 lg:mt-[10px] mt-[3px]  rounded-lg`}></div>
  </h1>
  )
}

export default PageMainTitle