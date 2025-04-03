import React, { useEffect, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import { ADD_LOGO, GET_LOGO, IMAGE_UPLOAD } from "../Api";
import { useRecoilState } from "recoil";
import { Logo } from "../Recoil/index";

function ShowDesignMenu({ setShowServiceMenu }) {
  const [logo, setLogo] = useRecoilState(Logo);
  const token = localStorage.getItem("token");
  const [addTitle, setAddTitle] = useState("");
  const [addLogo, setAddLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [addLogoURL, setAddLogoURL] = useState("");

  const addNewService = async () => {
    setLoading(true);
    if (addLogo && addTitle && token) {
      try {
        let link = addLogo;
        if (typeof addLogo !== "string") {
          const formData = new FormData();
          formData.append("image", addLogo);
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link = data.fileUrl;
          } else {
            return toast.error("Image Upload Failed");
          }
        }
        const { data } = await axios.post(
          ADD_LOGO,
          {
            logo: link,
            title: addTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.success) {
          setLogo(await GET_LOGO());
          toast.success(data.message);
          setAddTitle("");
          setAddLogo("");
          setLoading(false);
          setShowServiceMenu(false);
        } else {
          setLoading(false);
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.data?.message ||
            error.message
        );
        setLoading(false);
      }
    } else if (!token) {
      setLoading(false);
      return toast.error("You are not authorized to perform this action");
    } else {
      setLoading(false);
      return toast.error("All Fields are Required");
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddLogo(file);
      setAddLogoURL(URL.createObjectURL(file)); // Set the object URL
    }
  };

  useEffect(() => {
    if (logo) {
      setAddLogo(logo[0].logo);
      setAddTitle(logo[0].title);
    }
  }, []);
  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#F8F8F8] p-4 w-[501px] border-2 border-[#81BC06] rounded-lg">
          <div className="realtive flex items-center justify-center  text-center font-bold text-2xl">
            <span>Change Logo</span>
            <div className="absolute flex ml-[300px] mt-[1rem] gap-5">
              <div className="w-[20px] h-[79px] bg-[#05A6F0]"></div>
              <div className="w-[50px] h-[50px] bg-[#81BC06] rounded-full mt-8"></div>
            </div>
          </div>
          {addLogo && (
            <div className="flex items-center justify-center w-full mt-10">
              <img
                src={
                  typeof addLogo !== "string"
                    ? URL.createObjectURL(addLogo)
                    : addLogo
                }
                alt="icon"
                className="w-60 object-cover rounded-full"
              />
            </div>
          )}
          <div className="flex items-center justify-center w-full mt-5">
            <div className="bg-[#D9D9D9] flex items-center justify-evenly h-[80px] w-[320px] rounded-full relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center cursor-pointer"
              >
                <LuUpload className="text-2xl text-[#10100f]" />
                <span className="text-[#10100f] text-2xl font-bold ml-2">
                  Add Website logo
                </span>
              </label>
            </div>
          </div>
          <div className="flex items-center w-full justify-evenly mt-5 mb-5">
            <button
              className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
              onClick={addNewService}
            >
              Update
            </button>
            <button
              className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
              onClick={() => setShowServiceMenu(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default ShowDesignMenu;
