import React, { useEffect, useMemo, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import ReadMoreBtn from "./ReadMoreBtn";
import { MdDeleteOutline } from "react-icons/md";
import Loading from "./Loading";
import {
  ADD_SECTOR,
  DELETE_SECTOR,
  FILE_UPLOAD,
  GET_SECTORS,
  IMAGE_UPLOAD,
  UPDATE_SECTOR,
} from "../Api";
import axios from "axios";
import { toast } from "react-toastify";
import { Sectors } from "../Recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";

function AddOfferingSector({
  serviceCards,
  setServiceCards,
  setShowChemicalMenu,
  pageDecode,
}) {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [cardLinks, setCardLinks] = useState("");
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPdf, setEditPdf] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [pdf, setPdf] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const sectors = useRecoilValue(Sectors);
  const setSectors = useSetRecoilState(Sectors);



  const handleEditPdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setEditPdf(file);
    } else {
      alert("Please upload a valid PDF file.");
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

  // edit
  const showEditDialog = (cardId) => {
    const card = sectors.find((sector) => sector._id === cardId); 
    setCurrentEditId(cardId);
    setEditName(card.name);
    setEditDescription(card.description);
    setEditLogo(card.logo); 
    setEditPdf(card.pdf); 
    setIsEditMode(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    if (editName && editDescription && editLogo && editPdf) {
      let link1 = editLogo;
      let link2 = editPdf;
  
      if (typeof editLogo !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", editLogo);
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link1 = data.fileUrl;
          } else {
            toast.error(data.message || "Image upload failed");
            setLoading(false);
            return;
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
            error?.data?.message ||
            error.message
          );
          setLoading(false);
          return;
        }
      }
  
      if (typeof editPdf !== "string") {
        try {
          const formData = new FormData();
          formData.append("file", editPdf);
          const { data } = await axios.post(FILE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link2 = data.fileUrl;
          } else {
            toast.error(data.message || "File upload failed");
            setLoading(false);
            return;
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
            error?.data?.message ||
            error.message
          );
          setLoading(false);
          return;
        }
      }
  
      try {
        const { data } = await axios.put(
          `${UPDATE_SECTOR}/${currentEditId}`,
          {
            backgroundImage: link1,
            name: editName,
            description: editDescription,
            pdf: link2,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (data) {
          setIsEditMode(false);
          const Sectordata = await GET_SECTORS();
          setSectors(Sectordata);
          toast.success("Sector updated successfully");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
          error?.data?.message ||
          error.message
        );
      } finally {
        setLoading(false);
      }
    } else if (!token) {
      setLoading(false);
      return toast.error("You don't have access to perform this action");
    } else {
      setLoading(false);
      return toast.error("All Fields are Required");
    }
  };

  const handleSubmit = () => {
    if (!name || !description || !logo || !pdf) {
      alert("Please fill all fields and upload required files.");
      return;
    }

    const updatedFields = {
      ...(name && { cardTile: name }),
      ...(description && { cardDesc: description }),
      ...(logo && { background: logo }),
      ...(pdf && { pdf: pdf }),
    };

    if (isEditMode) {
      // Update existing card
      const updatedCards = (serviceCards || []).map((card) =>
        card.id === currentEditId ? { ...card, ...updatedFields } : card
      );
      console.log("error here");

      setServiceCards(updatedCards);
    } else {
      // Add new card
      const newCard = {
        id: new Date().getTime(),
        cardTile: name,
        cardDesc: description,
        background: logo,
        pdf: pdf,
        cardLinks: cardLinks,
      };
      setServiceCards([...(serviceCards || []), newCard]);
    }

    // Reset states
    setName("");
    setDescription("");
    setLogo(null);
    setPdf(null);
    setIsEditMode(false);
    setShowAddBox(false);
  };
  const showDeleteDialog = (cardId) => {
    setSelectedCardId(cardId);
    setShowDeleteDialogBox(true);
  };

  const handleDelete = async () => {
    setLoading(true);

    // Store the current sectors for rollback if needed
    const previousSectors = [...sectors];

    // Optimistically remove the sector from UI
    setSectors(
      previousSectors.filter((sector) => sector._id !== selectedCardId)
    );

    try {
      const { data } = await axios.delete(
        `${DELETE_SECTOR}/${selectedCardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowDeleteDialogBox(false);
      toast.success(data.message || "Sector deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      // Rollback to previous state if delete failed
      setSectors(previousSectors);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete sector"
      );
    } finally {
      setLoading(false);
    }
  };

  const addNewSector = async () => {
    setLoading(true);

    try {
      let link1 = logo;
      let link2 = pdf;

      // Upload logo
      if (typeof logo !== "string") {
        const formData = new FormData();
        formData.append("image", logo);
        const imageResponse = await axios.post(IMAGE_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!imageResponse.data.success) {
          throw new Error(imageResponse.data.message || "Image upload failed");
        }
        link1 = imageResponse.data.fileUrl;
      }

      // Upload PDF
      if (typeof pdf !== "string") {
        const formData = new FormData();
        formData.append("file", pdf);
        const pdfResponse = await axios.post(FILE_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!pdfResponse.data.success) {
          throw new Error(pdfResponse.data.message || "File upload failed");
        }
        link2 = pdfResponse.data.fileUrl;
      }

      // Prepare sector data
      const sectorData = {
        backgroundImage: link1,
        name: name.trim(),
        description: description.trim(),
        pdf: link2,
      };

      // Save sector details
      const response = await axios.post(ADD_SECTOR, sectorData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { data } = response;

      // Check if the sector was actually created with the image
      if (!data.backgroundImage || !data.pdf) {
        throw new Error("Sector created but files not properly attached");
      }

      // If everything succeeded, update UI and state
      const updatedSectors = await GET_SECTORS();
      setSectors(updatedSectors);

      // Reset form and close
      setName("");
      setDescription("");
      setLogo(null);
      setPdf(null);
      setIsEditMode(false);
      setShowAddBox(false);

      toast.success("Sector added successfully");
    } catch (error) {
      console.error("Error details:", {
        error,
        response: error.response?.data,
        status: error.response?.status,
      });

      // More specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add sector. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Also make sure your logo change handler is correct:
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected logo file:", file);
    if (file) {
      setLogo(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
     
      setLogoPreview(previewUrl);
    }
   
  };

   const handleEditLogoChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
    
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        e.target.value = "";
        return;
      }
    
      // Optional: Add size validation (e.g., 5MB limit)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }
    
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setEditLogo(file); 
      
      // Optional: Store preview URL in separate state if needed
      setLogoPreview(objectUrl);
    
      // Cleanup object URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    };

  useEffect(() => {
    if (isEditMode) {
      setName(isEditMode?.name);
      setEditLogo(isEditMode?.backgroundImage);
      setDescription(isEditMode?.description);
      setPdf(isEditMode?.pdf);
    }
  }, [isEditMode]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className=" lg:w-[56rem] md:w-[80vw] w-[95%] bg-white relative p-5 pt-10">
          <div className="flex items-center justify-between ">
            <h2 className="font-bold text-2xl">Services Menu</h2>
            <span className="text-5xl flex items-center justify-center font-semibold text-center ">
              <img
                src="/add.png"
                onClick={() => setShowAddBox(true)}
                alt="add"
                className="cursor-pointer text-[#81BC06] flex items-center justify-center text-4xl"
              />
            </span>
          </div>

          <div className="absolute right-1 top-1">
            <IoIosCloseCircle
              onClick={() => setShowChemicalMenu(false)}
              className="cursor-pointer text-3xl text-black hover:text-gray-400"
            />
          </div>
          <div className=" overflow-x-scroll max-h-[60vh] relative mt-5 ">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr className=" text-black">
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sectors.map((card, index) => (
                  <tr key={card._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{card.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {card.description?.slice(0, 15) + "..."}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => showEditDialog(card._id)}
                        className="text-white px-2 py-1 rounded hover:bg-blue-100"
                      >
                        <img loading="lazy" src="/edit.png" alt="edit" />
                      </button>
                      <button
                        onClick={() => showDeleteDialog(card._id)}
                        className="px-2 py-1 rounded hover:bg-red-100"
                      >
                        <MdDeleteOutline className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showAddBox && (
          <div className="p-7 bg-white w-[95%] lg:w-[50%] fixed rounded-md">
            <div className="absolute right-1 top-1">
              <IoIosCloseCircle
                onClick={() => {
                  if (!loading) {
                    // Only allow closing if not loading
                    setShowAddBox(false);
                    // Reset form state
                    setName("");
                    setDescription("");
                    setLogo(null);
                    setPdf(null);
                  }
                }}
                className={`cursor-pointer text-3xl text-black hover:text-gray-400 ${
                  loading ? "opacity-50" : ""
                }`}
              />
            </div>
            <h3 className="text-4xl mb-4 w-full text-center">
              Add Sector to {pageDecode}
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
                className="w-full p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
              />
            </div>
            {/* <div className="mb-4">
            <label htmlFor="name" className="block text-xl font-medium mb-1">
            cardLinks
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={cardLinks}
              onChange={(e) => setCardLinks(e.target.value)}
              className="w-full p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
            />
          </div> */}
            {/* Logo Upload */}
            <div className="mb-4">
              <label
                htmlFor="logo"
                className="flex items-center justify-center gap-5 cursor-pointer w-full p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] text-center"
              >
                <LuUpload className="text-2xl text-[#10100f]" />
                Upload backgroundImage
                {logoPreview && ( // Use logoPreview instead of logo for display
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="h-16 w-16 object-contain border border-gray-300 rounded-full"
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
                className="w-full p-2 border h-40 border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
              ></textarea>
            </div>
            {/* PDF Upload */}
            <div className="mb-4  p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]">
              <label
                htmlFor="pdf"
                className="flex items-center justify-center gap-5 cursor-pointer h-full"
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
                className="hidden h-full"
              />
              {pdf && (
                <div className="mt-2 text-sm text-gray-600">
                  Uploaded File: {pdf.name}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full grid place-items-center mt-9">
              <ReadMoreBtn text="Submit" onClick={addNewSector} />
            </div>
          </div>
        )}

        {/* Edit model */}

        {isEditMode && (
          <div className="p-7 bg-white w-[95%] lg:w-[50%] fixed rounded-md">
            <div className="absolute right-1 top-1">
              <IoIosCloseCircle
                onClick={() => setIsEditMode(false)}
                className="cursor-pointer text-3xl text-black hover:text-gray-400"
              />
            </div>
            <h3 className="text-4xl mb-4 w-full text-center">
              Add Sector to {pageDecode}
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
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
              />
            </div>

            {/* Logo Upload */}
            <div className="mb-4">
              <label
                htmlFor="logo"
                className="flex items-center justify-center gap-5 cursor-pointer w-full p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9] text-center"
              >
                <LuUpload className="text-2xl text-[#10100f]" />
                Upload backgroundImage
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="h-16 w-16 object-contain border border-gray-300 rounded-full"
                    />
                  </div>
                )}
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleEditLogoChange}
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
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows="4"
                className="w-full p-2 border h-40 border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]"
              ></textarea>
            </div>
            {/* PDF Upload */}
            <div className="mb-4  p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]">
              <label
                htmlFor="pdf"
                className="flex items-center justify-center gap-5 cursor-pointer h-full"
              >
                <LuUpload className="text-2xl text-[#10100f]" />
                Upload PDF
              </label>
              <input
                type="file"
                id="pdf"
                name="pdf"
                accept="application/pdf"
                onChange={handleEditPdfChange}
                className="hidden h-full"
              />
              {editPdf && (
                <div className="mt-2 text-sm text-gray-600">
                  Uploaded File: {editPdf.name}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full grid place-items-center mt-9">
              <ReadMoreBtn text="Submit" onClick={handleEdit} />
            </div>
          </div>
        )}

        {/* delete  */}
        {showDeleteDialogBox && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowDeleteDialogBox(false)} // Close dialog on overlay click
          >
            <div
              className="bg-[#F8F8F8] p-4 w-[90%] md:w-[501px] border border-[#05A6F0] rounded-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing on dialog click
            >
              <div className="flex items-center justify-between text-center font-bold text-2xl">
                <span>Delete Job Posting</span>
                <IoIosCloseCircle
                  className="text-3xl hover:text-gray-500 duration-300 cursor-pointer text-black"
                  onClick={() => setShowDeleteDialogBox(false)} // Close dialog
                  aria-label="Close delete dialog"
                />
              </div>
              <label className="block mt-10 text-2xl font-bold">
                Are you sure you want to delete this Job Posting?
              </label>
              <label className="block mt-4 text-[1.2rem] text-[#F35325]">
                Warning!! You can't revert this action.
              </label>
              <div className="flex items-center w-full justify-evenly mt-5 mb-5">
                <button
                  className="py-3 hover:text-white duration-500 ease-linear w-[40%] cursor-pointer flex items-center justify-center hover:bg-red-800 rounded-lg bg-[#F35325] text-gray-900 font-bold text-[1.2rem] font-[Poppins]"
                  onClick={handleDelete} // Trigger delete
                  disabled={loading} // Disable button while deleting
                >
                  {loading ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <MdDeleteOutline className="text-2xl" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && <Loading />}
    </>
  );
}

export default AddOfferingSector;
