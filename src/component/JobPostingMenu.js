import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { RiFolderAddFill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import {
  ADD_JOB_POSTING,
  DELETE_JOB_POSTING,
  GET_JOB_POSTINGS,
  UPDATE_JOB_POSTING,
} from "../Api";
import CareerCard from "./careerCard";
import { JobPostings } from "../Recoil/index";
import { useSetRecoilState } from "recoil";

function JobPostingMenu({ feedbacks, setShowFeedbackCardMenu }) {
  const setJobPosting = useSetRecoilState(JobPostings);
  const token = localStorage.getItem("token");
  const [editHeading, setEditHeading] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editTags, setEditTags] = useState("");
  const [addHeading, setAddHeading] = useState("");
  const [addDetails, setAddDetails] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addCity, setAddCity] = useState("");
  const [addTags, setAddTags] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showViewBox, setShowViewBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "detail",
        Cell: ({ cell: { value } }) => value?.slice(0, 50) + "...",
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

    if (editHeading && editDetails && editDate && editCity && editTags) {
      try {
        const role = editTags.split(",").map((tag) => tag.trim());
        const { data } = await axios.put(
          `${UPDATE_JOB_POSTING}/${showEditBox?._id}`,
          {
            role,
            location: editCity,
            date: editDate,
            title: editHeading,
            detail: editDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowEditBox(undefined);
          toast.success(data.message);
          setJobPosting(await GET_JOB_POSTINGS());
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
        `${DELETE_JOB_POSTING}/${showDeleteDialogBox?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setJobPosting(await GET_JOB_POSTINGS());
        toast.success(data.message);
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

  const addNewService = async () => {
    setLoading(true);

    if (addHeading && addDetails && addDate && addCity && addTags) {
      try {
        const role = addTags.split(",").map((tag) => tag.trim());
        const { data } = await axios.post(
          ADD_JOB_POSTING,
          {
            role,
            location: addCity,
            date: addDate,
            title: addHeading,
            detail: addDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setJobPosting(await GET_JOB_POSTINGS());
          setShowAddBox(undefined);
          setAddHeading("");
          setAddDetails("");
          setAddDate("");
          setAddCity("");
          setAddTags("");
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

  const tableInstance = useTable({ columns, data: feedbacks });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    if (showEditBox) {
      setEditHeading(showEditBox?.title);
      setEditDetails(showEditBox?.detail);
      setEditDate(showEditBox?.date);
      setEditCity(showEditBox?.location);
      setEditTags(showEditBox?.role);
    }
  }, [showEditBox]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-8 py-5 rounded shadow-md md:w-[80%] w-[95%] lg:w-[56rem]">
          <div className="flex items-end justify-end w-full mb-5">
            <IoIosCloseCircle
              onClick={() => setShowFeedbackCardMenu(false)}
              className="cursor-pointer text-3xl text-gray-300"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl">Career Menu</h2>
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
          <div className="bg-[#F8F8F8] p-4 w-[400px] h-[70vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowEditBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <label className="block font-bold text-2xl mt-[-2rem]">
                Edit Job Postings
              </label>
              <span className="w-full">
                <label className="block mt-4">Job Title</label>
                <input
                  value={editHeading}
                  onChange={(e) => setEditHeading(e.target.value)}
                  type="text"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <div className="flex items-center justify-between gap-5">
                <span className="w-full">
                  <label className="block mt-10">City</label>
                  <input
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    type="text"
                    className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                  />
                </span>
                <span className="w-full">
                  <label className="block mt-10">Date</label>
                  <input
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    type="date"
                    className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                  />
                </span>
              </div>
              <label className="block mt-10">
                Tags (Use , to seperate the tags){" "}
              </label>
              <input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                type="text"
                className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
              />
              <label className="block mt-10">Description</label>
              <textarea
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                type="text"
                className="block w-full max-h-[35rem] min-h-[20rem] border mt-2 border-gray-300 rounded-md py-2 px-4"
              />
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[50%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update Posting
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 md:w-[80%] w-[95%] lg:w-[56rem] h-[70vh] border-2 border-[#05A6F0] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowAddBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <label className="block font-bold text-2xl mt-[-2rem]">
                Create Job Postings
              </label>
              <span className="w-full">
                <label className="block mt-4">Job Title</label>
                <input
                  value={addHeading}
                  onChange={(e) => setAddHeading(e.target.value)}
                  type="text"
                  className="block w-full border mt-2 border-[#05A6F0] outline-none rounded-2xl py-2 px-4 bg-[#05A6F01A]"
                />
              </span>
              <div className="flex items-center justify-between gap-5">
                <span className="w-full">
                  <label className="block mt-10">City</label>
                  <input
                    value={addCity}
                    onChange={(e) => setAddCity(e.target.value)}
                    type="text"
                    className="block w-full border mt-2 border-[#05A6F0] outline-none rounded-2xl py-2 px-4 bg-[#05A6F01A]"
                  />
                </span>
                <span className="w-full">
                  <label className="block mt-10">Date</label>
                  <input
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    type="date"
                    className="block w-full border border-[#05A6F0] outline-none rounded-2xl py-2 px-4 bg-[#05A6F01A]"
                  />
                </span>
              </div>
              <label className="block mt-10">
                Tags (Use , to seperate the tags){" "}
              </label>
              <input
                value={addTags}
                onChange={(e) => setAddTags(e.target.value)}
                type="text"
                className="block w-full border mt-2 border-[#05A6F0] outline-none rounded-2xl py-2 px-4 bg-[#05A6F01A]"
              />
              <label className="block mt-10">Description</label>
              <textarea
                value={addDetails}
                onChange={(e) => setAddDetails(e.target.value)}
                type="text"
                className="block w-full max-h-[35rem] min-h-[20rem] border mt-2 border-[#05A6F0] outline-none rounded-2xl py-2 px-4 bg-[#05A6F01A]"
              />
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[50%] cursor-pointer hover:bg-[#05A6F0] rounded-lg bg-[#05A6F01A] font-normal text-[1.2rem] border border-[#05A6F0] text-[#05A6F0] hover:text-white duration-500"
                onClick={addNewService}
              >
                Add Posting
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 hover:text-white duration-500 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => setShowAddBox(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteDialogBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[501px] border-2 border-[#81BC06] rounded-lg">
            <div className="flex items-center justify-between  text-center font-bold text-2xl">
              <span>Delete Job Posting</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Job Posting ?
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
          <div className="bg-[#F8F8F8] p-5 border-2 overflow-y-auto h-[70vh] border-[#81BC06] rounded-lg">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowViewBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <CareerCard
              Date={showViewBox.date}
              City={showViewBox.location}
              name={showViewBox.title}
              Tag={showViewBox.role}
              details={showViewBox.detail}
            />
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
}

export default JobPostingMenu;
