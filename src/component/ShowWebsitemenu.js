import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import {
  ALL_ADMINS,
  ALL_ADMINS_REQUEST,
  APPROVE_ADMIN,
  DELETE_ADMIN,
  GET_LOGO,
  UPDATE_MAIL,
} from "../Api";
import { Logo, userInfo } from "../Recoil";
import { useRecoilState, useRecoilValue } from "recoil";

function ShowWebsitemenu({ setShowServiceMenu }) {
  const userData = useRecoilValue(userInfo);
  const [logo, setLogo] = useRecoilState(Logo);
  const token = localStorage.getItem("token");
  const [email, setEmail] = useState("");
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const UpdateEmail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        UPDATE_MAIL,
        {
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setLogo(await GET_LOGO());
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  const getPendingAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(ALL_ADMINS_REQUEST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setPendingAdmins(data.admins);
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  const getApprovedAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(ALL_ADMINS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setApprovedAdmins(data.admins);
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  const RemoveAdmin = async (mail) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        DELETE_ADMIN,
        {
          email: mail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        getApprovedAdmins();
        getPendingAdmins();
        toast.success(data.message);
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  const ApproveAdmin = async (mail) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        APPROVE_ADMIN,
        {
          email: mail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        getApprovedAdmins();
        getPendingAdmins();
        toast.success(data.message);
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingAdmins();
    getApprovedAdmins();
  }, []);

  useEffect(() => {
    if (logo) {
      setEmail(logo[0].email);
    }
  }, [logo]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#F8F8F8] p-4 w-[1020px] border-2 border-[#81BC06] rounded-lg">
          <div className="realtive flex items-center justify-center  text-center font-bold text-2xl">
            <span>Change Website Details</span>
          </div>
          <div className="flex flex-col items-start justify-start px-10 w-full mt-10">
            <label className="flex items-start cursor-pointer">
              <span className="text-[#10100f] text-2xl font-bold ml-2">
                Contact Email
              </span>
            </label>
            <div className="flex items-center w-full justify-center gap-10">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 w-full rounded-lg px-2 py-2"
              />
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={UpdateEmail}
              >
                Update Email
              </button>
            </div>
            <label className="flex mt-5 items-start cursor-pointer">
              <span className="text-blue-900 text-2xl font-bold ml-2">
                Admin Requests
              </span>
            </label>
            <div className="grid grid-cols-2 place-content-center">
              {pendingAdmins && pendingAdmins.length >= 1 ? (
                pendingAdmins
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((e, index) => (
                    <div
                      className="container border-2 p-2 rounded-lg mt-5 bg-opacity-5 bg-white"
                      key={index}
                    >
                      <div className="wrapper">
                        <div className="title px-2">Name: {e.name}</div>
                        <div className="place px-2">Email: {e.email}</div>
                        <div className="place px-2">
                          Requested On:{" "}
                          {new Date(e.createdAt).toISOString().split("T")[0]}
                        </div>
                      </div>
                      <div className="content">
                        <div className="button">
                          <div className="flex items-center justify-center mt-5 gap-5">
                            <button
                              className="bg-[#81BC06] border-2 text-nowrap text-black rounded-lg px-2 hover:bg-[#6B8514] py-2 text-[1.2rem] font-semibold"
                              onClick={() => ApproveAdmin(e.email)}
                            >
                              Approve Admin
                            </button>
                            <button
                              className="bg-[#F35325] border-2 text-nowrap text-white rounded-lg px-2 hover:bg-red-700 py-2 text-[1.2rem] font-semibold"
                              onClick={() => RemoveAdmin(e.email)}
                            >
                              Delete Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex px-2 items-center justify-center mt-5 gap-5">
                  <p className="text-2xl text-[#10100f]">
                    No pending admin requests.
                  </p>
                </div>
              )}
            </div>
            <label className="flex mt-5 items-start cursor-pointer">
              <span className="text-black text-2xl font-bold ml-2">
                All Admins
              </span>
            </label>
            <div className="grid grid-cols-2 place-content-center">
              {approvedAdmins &&
                approvedAdmins
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((e, index) => (
                    <div
                      className={`containe mr-5 border-2 p-2 rounded-lg mt-5 bg-opacity-5 bg-white`}
                      key={index}
                    >
                      <div className="wrappe">
                        <div className="titl px-2">Name -: {e.name}</div>
                        <div className="plac px-2">Email -: {e.email}</div>
                        <div className="plac px-2">
                          Requested On -:{" "}
                          {new Date(e.createdAt).toISOString().split("T")[0]}
                        </div>
                      </div>
                      {userData && userData?.email !== e.email && (
                        <div className="conten">
                          <div className="button">
                            <div className="flex items-center justify-center mt-5 gap-5">
                              <button
                                className="bg-[#F35325] border-2 text-nowrap text-[#fff] rounded-lg
                    px-2 hover:bg-red-700 py-2 text-[1.2rem] font-semibold"
                                onClick={() => RemoveAdmin(e.email)}
                              >
                                Delete Admin
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="flex items-center w-full justify-evenly mt-5 mb-5">
            <button
              className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
              onClick={() => setShowServiceMenu(false)}
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default ShowWebsitemenu;
