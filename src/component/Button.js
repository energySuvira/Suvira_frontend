import React from "react";

function Button({ text, onClick = undefined }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#81BC06] min-w-[150px] cursor-pointer hover:bg-[#D0F729] p-2 rounded-lg"
    >
      {text}
    </button>
  );
}

export default Button;
