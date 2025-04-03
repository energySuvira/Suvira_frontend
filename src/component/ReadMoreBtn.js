import React from 'react';

function ReadMoreBtn({ text, onClick = undefined, className }) {
  return (
    <button 
      className={`bg-[#05A6F01A] cursor-pointer hover:bg-[#05A6F0] hover:text-white 
                  transition duration-300 ease-linear h-11 
                  w-[60%] sm:w-1/2 md:w-1/2 lg:w-[14.6vw] xl:w-[11.6vw] 
                  rounded-md text-[#05A6F0] border-[#05A6F0] 
                  border-solid border-2 font-medium text-lg md:text-xl 
                  leading-6 font-[Poppins] ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default ReadMoreBtn;
