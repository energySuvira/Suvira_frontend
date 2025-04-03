import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";

function TypeWriter() {
  const [text] = useTypewriter({
    words: [
      // "Small Footprint, Big Impact",
      // "Empowering the World",
      "Together creating value.",
      "Innovating energy solutions for a sustainable world.",
    ],
    loop: true,
    typeSpeed:80,
    deleteSpeed:20
  });
  return (
    <span className="ml-0  lg:ml-2 break-words  font-semibold font-[Poppins] ">
      {text}
      <Cursor />
    </span>
  );
}

export default TypeWriter;
