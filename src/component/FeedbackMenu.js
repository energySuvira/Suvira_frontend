import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { RiFolderAddFill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import {
  ADD_FEEDBACK,
  DELETE_FEEDBACK,
  GET_FEEDBACKS,
  IMAGE_UPLOAD,
  UPDATE_FEEDBACK,
} from "../Api";
import FeedbackCard from "./FeedbackCard";
import { Feedbacks } from "../Recoil/index";
import { useSetRecoilState } from "recoil";
import icons from "../assets";

function FeedbackMenu({ feedbacks, setShowFeedbackCardMenu }) {
  const setFeedbacks = useSetRecoilState(Feedbacks);
  const token = localStorage.getItem("token");
  const [editHeading, setEditHeading] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [addHeading, setAddHeading] = useState("");
  const [addDetails, setAddDetails] = useState("");
  const [addRating, setAddRating] = useState(1);
  const [addLogo, setAddLogo] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showViewBox, setShowViewBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [addLogoURL, setAddLogoURL] = useState("");
  const [editLogoURL, setEditLogoURL] = useState("");

  useEffect(() => {
    return () => {
      if (addLogoURL) {
        URL.revokeObjectURL(addLogoURL);
      }
      if (editLogoURL) {
        URL.revokeObjectURL(editLogoURL);
      }
    };
  }, [addLogoURL, editLogoURL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddLogo(file);
      setAddLogoURL(URL.createObjectURL(file)); // Set the object URL
    }
  };

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditLogo(file);
      setEditLogoURL(URL.createObjectURL(file)); // Set the object URL
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Author",
        accessor: "author",
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowViewBox(original)}
              className="text-black px-2 py-1 rounded hover:bg-green-100"
            >
              <FaEye />
            </button>
            <button
              onClick={() => setShowEditBox(original)}
              className="text-white px-2 py-1 rounded hover:bg-blue-100"
            >
              <img loading="lazy" src="/edit.png" />
            </button>
            <button
              onClick={() => setShowDeleteDialogBox(original)}
              className="px-2 py-1 rounded hover:bg-red-100"
            >
              <MdDeleteOutline className="text-2xl" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleEdit = async () => {
    setLoading(true);

    if (editLogo && editHeading && editDetails && editRating && token) {
      let link = editLogo;

      // If editLogo is not a string, upload the new logo
      if (typeof editLogo !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", editLogo); // Use editLogo here
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link = data.fileUrl;
          } else {
            toast.error(data.message || "Image upload failed");
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

      // Proceed with updating the service
      try {
        const { data } = await axios.put(
          `${UPDATE_FEEDBACK}/${showEditBox?._id}`,
          {
            img: link,
            author: editHeading,
            rating: editRating,
            feedback: editDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setFeedbacks(await GET_FEEDBACKS());
          setShowEditBox(undefined);
          toast.success(data.message);
        } else {
          toast.error(data.message);
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${DELETE_FEEDBACK}/${showDeleteDialogBox?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setFeedbacks(await GET_FEEDBACKS());
        setShowDeleteDialogBox(undefined);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
    setLoading(false);
  };

  const addNewService = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (addLogo && addHeading && addRating && addDetails && token) {
      try {
        const formData = new FormData();
        formData.append("image", addLogo);
        const { data } = await axios.post(IMAGE_UPLOAD, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const link = data.fileUrl;
        if (data.success) {
          const { data } = await axios.post(
            ADD_FEEDBACK,
            {
              img: link,
              author: addHeading,
              rating: addRating,
              feedback: addDetails,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (data.success) {
            setFeedbacks(await GET_FEEDBACKS());
            setLoading(false);
            toast.success(data.message);
            setAddDetails("");
            setAddHeading("");
            setAddRating(1);
            setAddLogo("");
            setShowAddBox(false);
          } else {
            setLoading(false);
            toast.error(data.message);
          }
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

  const tableInstance = useTable({ columns, data: feedbacks });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    if (showEditBox) {
      setEditHeading(showEditBox?.author);
      setEditLogoURL(showEditBox?.img);
      setEditDetails(showEditBox?.feedback);
      setEditRating(showEditBox?.rating);
    }
  }, [showEditBox]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-8 py-5 rounded shadow-md w-[56rem]">
          <div className="flex items-end justify-end w-full mb-5">
            <IoIosCloseCircle
              onClick={() => setShowFeedbackCardMenu(false)}
              className="cursor-pointer text-3xl text-gray-300"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl">Feedback Menu</h2>
            <span className="text-5xl flex items-center justify-center font-semibold text-center ">
              <img
                src="/add.png"
                onClick={() => setShowAddBox(true)}
                className="cursor-pointer text-[#81BC06] flex items-center justify-center text-4xl"
              />
            </span>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table
              {...getTableProps()}
              className="min-w-full bg-white divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-3 text-left text-xs bg-transparent font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showEditBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[1032px] h-[90vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowEditBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex items-center justify-center w-full mt-5 mb-5">
                <div
                  className={`w-[400px] min-h-[404.5px] rounded-t-lg flex items-center justify-evenly bg-cover relative`}
                  style={
                    { backgroundImage: `url(${editLogoURL ? editLogoURL : editLogo})` }
                  }
                >
                  <input
                    type="file"
                    id="file-uploads"
                    className="hidden"
                    onChange={handleFileChange1}
                  />
                  <label
                    htmlFor="file-uploads"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Update Feedback Image
                    </span>
                  </label>
                </div>
              </div>
              <label className="block mt-10">Author</label>
              <input
                value={editHeading}
                onChange={(e) => setEditHeading(e.target.value)}
                type="text"
                className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
              />
              <label className="block mt-10">Rating</label>
              <input
                value={editRating}
                onChange={(e) =>
                  setEditRating(
                    e.target.value >= 1 && e.target.value <= 5
                      ? e.target.value
                      : 5
                  )
                }
                type="number"
                className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
              />
              <label className="block mt-4">Feedback</label>
              <textarea
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                type="text"
                className="block w-full border max-h-[15rem] min-h-[5rem] h-[5rem] mt-2 border-gray-300 rounded-md py-2 px-4"
              />
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update Feedback
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => setShowEditBox(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddBox && (
        <div className="fixed flex-col h-full inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <form
            className="bg-white p-4 w-[932px] h-[90vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto flex flex-col items-center justify-between"
            onSubmit={addNewService}
          >
            <div>
              <div className="flex items-center justify-center text-4xl font-semibold gap-5 mb-10 w-full mt-5">
                <div className="flex items-end justify-end w-full">
                  <IoIosCloseCircle
                    onClick={() => setShowAddBox(false)}
                    className="cursor-pointer text-3xl text-gray-300"
                  />
                </div>
              </div>
              <div className="flex items-start justify-between w-full">
                <img loading="lazy" src={icons.logo} className="w-[300px]" alt="Logo" />
                <h1 className="text-5xl font-bold mt-10">
                  New Testimonial
                  <div className="flex flex-col items-end justify-end mr-[-25px]">
                    <div className="w-[320px] h-[20px] bg-[#05A6F0] mt-10"></div>
                    <div className="w-[275px] h-[20px] bg-[#81BC06] mt-5"></div>
                  </div>
                </h1>
              </div>
              <div className="text-3xl text-[#10100f] w-full mt-[-2rem] mb-6 font-semibold">
                Review Info
              </div>
              <div className="grid grid-cols-2 place-content-start w-full gap-x-10 gap-y-5">
                <div className="gap-3 flex flex-col">
                  <label className="text-xl ml-2">Author</label>
                  <input
                    type="text"
                    required={true}
                    value={addHeading}
                    onChange={(e) => setAddHeading(e.target.value)}
                    className="p-2 border-2 rounded-xl w-[427px] h-[30px]"
                  />
                </div>
                <div className="gap-3 flex flex-col">
                  <label className="text-xl ml-2">Rating</label>
                  <input
                    required={true}
                    value={addRating}
                    onChange={(e) =>
                      setAddRating(
                        e.target.value >= 1 && e.target.value <= 5
                          ? e.target.value
                          : 5
                      )
                    }
                    type="number"
                    className="p-2 border-2 rounded-xl w-[427px] h-[30px]"
                  />
                </div>
                <div className="gap-3 flex flex-col">
                  <label className="text-xl ml-2">Designation</label>
                  <input
                    type="text"
                    required={true}
                    className="p-2 border-2 rounded-xl w-[427px] h-[30px]"
                  />
                </div>
                <div className="gap-3 flex flex-col">
                  <label className="text-xl ml-2">Date</label>
                  <input
                    type="date"
                    required={true}
                    className="p-2 border-2 rounded-xl w-[427px] h-[30px]"
                  />
                </div>
              </div>
              <div className="text-2xl text-[#10100f] w-full mt-8 mb-6 font-bold">
                Review
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="gap-3 flex flex-col">
                  <textarea
                    required={true}
                    value={addDetails}
                    onChange={(e) => setAddDetails(e.target.value)}
                    type="text"
                    className="p-2 border rounded-xl w-[886px] max-h-[420px] min-h-[420px] h-[420px]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center w-full mt-5 mb-5">
                <div
                  className={`${
                    addLogo
                      ? "w-[400px] min-h-[404.5px]"
                      : "w-[500px] h-[120px]"
                  } rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                    !addLogo && "bg-[#D9D9D9]"
                  }`}
                  style={
                    addLogo ? { backgroundImage: `url(${addLogoURL})` } : {}
                  }
                >
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
                      Add Feedback Image
                    </span>
                  </label>
                </div>
              </div>
              <br />
              <div className="flex items-center w-full justify-center mt-5 mb-5">
                <button className="py-3 w-[50%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06]">
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {showDeleteDialogBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[501px] border-2 border-[#81BC06] rounded-lg">
            <div className="flex items-center justify-between  text-center font-bold text-2xl">
              <span>Delete Feedback</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Feedback ?
            </label>
            <label className="block mt-4 text-[1.2rem] text-[#F35325]">
              Warning !! You can't revert this action.
            </label>
            <label className="block mt-4 text-[1.2rem] text-[#F35325]"></label>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer flex items-center justify-center hover:bg-red-800 rounded-lg bg-[#F35325] text-gray-900 font-bold text-[1.2rem]"
                onClick={handleDelete}
              >
                <MdDeleteOutline className="text-2xl" />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showViewBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-5 border-2 border-[#81BC06] rounded-lg">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowViewBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <FeedbackCard
              hidden={true}
              img={showViewBox.img}
              desc={showViewBox.feedback}
              author={showViewBox.author}
              rating={showViewBox.rating}
            />
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
}

export default FeedbackMenu;
