import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { RiFolderAddFill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import {
  ADD_CLIENT,
  DELETE_CLIENT,
  GET_CLIENTS,
  IMAGE_UPLOAD,
  UPDATE_CLIENT,
} from "../Api";
import { Clients } from "../Recoil/index";
import { useSetRecoilState } from "recoil";

function ClientMenu({ Clientss, setShowClientMenu }) {
  const setClient = useSetRecoilState(Clients);
  const token = localStorage?.getItem("token") || undefined;
  const [editHeading, setEditHeading] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [addHeading, setAddHeading] = useState("");
  const [addLogo, setAddLogo] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Icon",
        accessor: "img",
        Cell: ({ cell: { value } }) => (
          <img
            src={value}
            alt="partnerships"
            className="min-w-56 cursor-pointer"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => (
          <div className="flex space-x-2">
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

    if (editLogo && editHeading && token) {
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
          `${UPDATE_CLIENT}/${showEditBox?._id}`,
          {
            img: link,
            name: editHeading,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setClient(await GET_CLIENTS());
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
        `${DELETE_CLIENT}/${showDeleteDialogBox?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setClient(await GET_CLIENTS());
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
    if (addLogo && addHeading && token) {
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
            ADD_CLIENT,
            {
              img: link,
              name: addHeading,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (data.success) {
            setClient(await GET_CLIENTS());
            toast.success(data.message);
            setAddHeading("");
            setAddLogo("");
            setShowAddBox(false);
            setLoading(false);
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

  const tableInstance = useTable({ columns, data: Clientss });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    if (showEditBox) {
      setEditHeading(showEditBox?.name);
      setEditLogo(showEditBox?.img);
    }
  }, [showEditBox]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-8 py-5 rounded shadow-md w-[56rem]">
          <div className="flex items-end justify-end w-full mb-5">
            <IoIosCloseCircle
              onClick={() => setShowClientMenu(false)}
              className="cursor-pointer text-3xl text-gray-300"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl">Clients Menu</h2>
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
          <div className="bg-[#F8F8F8] p-4 w-[501px] border-2 border-[#81BC06] rounded-lg">
            <div className="realtive flex items-center justify-center  text-center font-bold text-2xl">
              <span className="mr-[100px]">Edit Client Details</span>
              <div className="absolute flex ml-[300px] mt-[1rem] gap-5">
                <div className="w-[20px] h-[79px] bg-[#05A6F0]"></div>
                <div className="w-[50px] h-[50px] bg-[#81BC06] mt-8 rounded-full"></div>
              </div>
            </div>
            <label className="block mt-10">Client Name</label>
            <input
              value={editHeading}
              onChange={(e) => setEditHeading(e.target.value)}
              type="text"
              className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
            />
            <label className="block mt-4">Client logo</label>
            <div className="flex items-center justify-center w-full mt-5">
              <img
                src={
                  editLogo && typeof editLogo !== "string"
                    ? URL.createObjectURL(editLogo)
                    : editLogo
                }
                alt="Clients Icon"
                className="min-w-56 w-56 max-w-56 object-cover"
              />
            </div>
            <div className="flex items-center justify-center w-full mt-5">
              <div className="bg-[#D9D9D9] flex items-center justify-evenly h-[80px] w-[320px] rounded-full relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setEditLogo(e.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center cursor-pointer"
                >
                  <LuUpload className="text-2xl text-[#10100f]" />
                  <span className="text-[#10100f] text-2xl font-bold ml-2">
                    Update Client logo
                  </span>
                </label>
              </div>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update Client
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => setShowEditBox(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[501px] border-2 border-[#81BC06] rounded-lg">
            <div className="realtive flex items-center justify-center  text-center font-bold text-2xl">
              <span className="mr-[100px]">Add New Client</span>
              <div className="absolute flex ml-[300px] mt-[1rem] gap-5">
                <div className="w-[20px] h-[79px] bg-[#05A6F0]"></div>
                <div className="w-[50px] h-[50px] bg-[#81BC06] mt-8 rounded-full"></div>
              </div>
            </div>
            <label className="block mt-10">Client Name</label>
            <input
              value={addHeading}
              onChange={(e) => setAddHeading(e.target.value)}
              type="text"
              className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
            />
            <label className="block mt-4">Client logo</label>
            {addLogo && (
              <div className="flex items-center justify-center w-full mt-5">
                <img
                  src={URL.createObjectURL(addLogo)}
                  alt="icon"
                  className="min-w-56 w-56 max-w-56 object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-center w-full mt-5">
              <div className="bg-[#D9D9D9] flex items-center justify-evenly h-[80px] w-[320px] rounded-full relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setAddLogo(e.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center cursor-pointer"
                >
                  <LuUpload className="text-2xl text-[#10100f]" />
                  <span className="text-[#10100f] text-2xl font-bold ml-2">
                    Upload Client logo
                  </span>
                </label>
              </div>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={addNewService}
              >
                Create Client
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => setShowAddBox(false)}
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
              <span>Delete Client</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Client ?
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
      {loading && <Loading />}
    </>
  );
}

export default ClientMenu;
