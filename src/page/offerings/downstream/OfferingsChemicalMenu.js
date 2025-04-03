import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import ReadMoreBtn from "../../../component/ReadMoreBtn";
import DynamicForm from "../../../component/DynamicForm";
import { LuUpload } from "react-icons/lu";

function OfferingsChemicalMenu({
  services,
  setServices,
  setShowChemicalMenu,
  pageDecode,
}) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null); 
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null); 

  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(URL.createObjectURL(file)); 
    } else {
      alert("Please upload a valid image file.");
      e.target.value = ""; 
    }
  };

  
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdf(file);
    } else {
      alert("Please upload a valid PDF file.");
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    if (!name || !description || !logo || !pdf) {
      alert("Please fill all fields and upload required files.");
      return;
    }
    const newCard = {
      id: services.length,
      logoSrc: logo,
      cardTitle: name,
      cardDesc: description,
    };
    setServices([...services, newCard]);
    setShowChemicalMenu(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="p-7 bg-white w-[50%] relative rounded-md">
          <div className="absolute right-1 top-1">
            <IoIosCloseCircle
              onClick={() => setShowChemicalMenu(false)}
              className="cursor-pointer text-3xl text-black hover:text-gray-400"
            />
          </div>
          <h3 className="text-4xl mb-4 w-full text-center">
            Add Section to {pageDecode}
          </h3>

          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-xl font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] "
            />
          </div>

          {/* Logo Upload */}
          <div className="mb-4">
            <label
              htmlFor="logo"
              className=" flex items-center justify-center gap-5 cursor-pointer w-full p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]  text-center"
            >
              <LuUpload className="text-2xl text-[#10100f]" />
              Upload Logo
              {logo && (
                <div className="mt-2">
                  <img
                    src={logo}
                    alt="Logo Preview"
                    className="size-12 object-contain border border-gray-300 rounded-full"
                  />
                </div>
              )}
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-2 border h-40 border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] "
            ></textarea>
          </div>

          {/* PDF Upload */}
          <div className="mb-4 p-2 border border-[#05A6F0]  rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]">
            <label
              htmlFor="pdf"
              className="flex items-center justify-center gap-5 "
            >
              <LuUpload className="text-2xl text-[#10100f]" />
              Upload PDF
            </label>
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="w-full hidden "
            />
            {pdf && (
              <div className="mt-2 text-sm text-gray-600">
                Uploaded File: {pdf.name}
              </div>
            )}
          </div>

          <div className=" w-full grid place-items-center mt-9">
            <ReadMoreBtn text="Submit" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}

export default OfferingsChemicalMenu;
