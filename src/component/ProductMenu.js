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
  ADD_PRODUCTS,
  DELETE_PRODUCTS,
  GET_PRODUCTS,
  IMAGE_UPLOAD,
  UPDATE_PRODUCTS,
} from "../Api";
import ProductDiv from "./Product";
import { Products } from "../Recoil/index";
import { useSetRecoilState } from "recoil";

function ProductMenu({ feedbacks, setShowFeedbackCardMenu }) {
  const setProducts = useSetRecoilState(Products);
  const token = localStorage.getItem("token");
  const [editHeading, setEditHeading] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editAppearace, setEditAppearace] = useState("");
  const [editApplications, setEditApplications] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [addHeading, setAddHeading] = useState("");
  const [addDetails, setAddDetails] = useState("");
  const [addAppearace, setAddAppearace] = useState("");
  const [addGrade, setAddGrade] = useState("");
  const [addLogo, setAddLogo] = useState("");
  const [addSector, setAddSector] = useState("Renewable Sector");
  const [editSector, setEditSector] = useState("Renewable Sector");
  const [addApplication, setAddApplication] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showViewBox, setShowViewBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "desc",
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

    if (
      editHeading &&
      editDetails &&
      editAppearace &&
      editApplications &&
      editGrade &&
      editLogo &&
      editSector &&
      token
    ) {
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
          `${UPDATE_PRODUCTS}/${showEditBox?._id}`,
          {
            name: editHeading,
            desc: editDetails,
            appearance: editAppearace,
            applications: editApplications,
            grade: editGrade,
            image: link,
            sector: editSector,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowEditBox(undefined);
          setProducts(await GET_PRODUCTS());
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
        `${DELETE_PRODUCTS}/${showDeleteDialogBox?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setProducts(await GET_PRODUCTS());
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
    if (
      addHeading &&
      addDetails &&
      addAppearace &&
      addApplication &&
      addGrade &&
      addLogo &&
      addSector &&
      token
    ) {
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
            ADD_PRODUCTS,
            {
              name: addHeading,
              desc: addDetails,
              appearance: addAppearace,
              applications: addApplication,
              grade: addGrade,
              image: link,
              sector: addSector,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (data.success) {
            setLoading(false);
            setProducts(await GET_PRODUCTS());
            toast.success(data.message);
            setAddHeading("");
            setAddDetails("");
            setAddAppearace("");
            setAddGrade("");
            setAddLogo("");
            setAddSector("Renewable Sector");
            setAddApplication("");
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
      setEditHeading(showEditBox?.name);
      setEditLogo(showEditBox?.image);
      setEditDetails(showEditBox?.desc);
      setEditAppearace(showEditBox?.appearance);
      setEditGrade(showEditBox?.grade);
      setEditApplications(showEditBox?.applications);
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
            <h2 className="font-bold text-2xl">Product Menu</h2>
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
          <div className="bg-[#F8F8F8] p-4 w-[1036px] h-[90vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowEditBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex items-center justify-center w-full mt-5 mb-5">
                <div
                  className={`w-[1036px] min-h-[464.5px] rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                    !editLogo && "bg-[#D9D9D9]"
                  }`}
                  style={
                    editLogo
                      ? {
                          backgroundImage: `url(${
                            typeof editLogo !== "string"
                              ? URL.createObjectURL(editLogo)
                              : editLogo
                          })`,
                        }
                      : {}
                  }
                >
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
                      Update Product Image
                    </span>
                  </label>
                </div>
              </div>
              <span className="w-full">
                <label className="block mt-10">Name</label>
                <input
                  value={editHeading}
                  onChange={(e) => setEditHeading(e.target.value)}
                  type="text"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <div className="flex items-center justify-between gap-5">
                <span className="w-full mt-10">
                  <label htmlFor="mySelect">Choose an Sector</label>
                  <select
                    id="mySelect"
                    value={editSector}
                    onChange={(e) => setEditSector(e.target.value)}
                    className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4"
                  >
                    <option value="Renewable Sector">Renewable Sector</option>
                    <option value="Water Treatment & Filtration">
                      Water Treatment & Filtration
                    </option>
                    <option value="Downhole & Wellbore">
                      Downhole & Wellbore
                    </option>
                    <option value="Exploration & Production">
                      Exploration & Production
                    </option>
                    <option value="Chemical">Chemical</option>
                    <option value="IT / IOT">IT / IOT</option>
                    <option value="Pipeline Division">Pipeline Division</option>
                    <option value="Drilling Services">Drilling Services</option>
                  </select>
                </span>
                <span className="w-full">
                  <label className="block mt-10">Appearace</label>
                  <input
                    value={editAppearace}
                    onChange={(e) => setEditAppearace(e.target.value)}
                    type="text"
                    className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                  />
                </span>
                <span className="w-full">
                  <label className="block mt-10">Grade</label>
                  <input
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    type="text"
                    className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                  />
                </span>
              </div>
              <label className="block mt-10">Description</label>
              <input
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                type="text"
                className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
              />
              <label className="block mt-4">Applications</label>
              <textarea
                value={editApplications}
                onChange={(e) => setEditApplications(e.target.value)}
                type="text"
                className="block w-full border max-h-[15rem] min-h-[10rem] h-[10rem] mt-2 border-gray-300 rounded-md py-2 px-4"
              />
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update Product Image
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
          <div className="bg-[#F8F8F8] p-4 w-[1036px] h-[90vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowAddBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex items-center justify-center w-full mt-5 mb-5">
                <div
                  className={`w-[1036px] min-h-[464.5px] rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                    !addLogo && "bg-[#D9D9D9]"
                  }`}
                  style={
                    addLogo
                      ? {
                          backgroundImage: `url(${
                            typeof addLogo !== "string"
                              ? URL.createObjectURL(addLogo)
                              : addLogo
                          })`,
                        }
                      : {}
                  }
                >
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
                      Add Product Image
                    </span>
                  </label>
                </div>
              </div>
              <span className="w-full">
                <label className="block mt-10">Name</label>
                <input
                  value={addHeading}
                  onChange={(e) => setAddHeading(e.target.value)}
                  type="text"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <div className="flex items-center justify-between gap-5">
                <span className="w-full mt-10">
                  <label htmlFor="mySelect">Choose an Sector</label>
                  <select
                    id="mySelect"
                    value={addSector}
                    onChange={(e) => setAddSector(e.target.value)}
                    className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4"
                  >
                    <option value="Renewable Sector">Renewable Sector</option>
                    <option value="Water Treatment & Filtration">
                      Water Treatment & Filtration
                    </option>
                    <option value="Downhole & Wellbore">
                      Downhole & Wellbore
                    </option>
                    <option value="Exploration & Production">
                      Exploration & Production
                    </option>
                    <option value="Chemical">Chemical</option>
                    <option value="IT / IOT">IT / IOT</option>
                    <option value="Pipeline Division">Pipeline Division</option>
                    <option value="Drilling Services">Drilling Services</option>
                  </select>
                </span>
                <span className="w-full">
                  <label className="block mt-10">Appearace</label>
                  <input
                    value={addAppearace}
                    onChange={(e) => setAddAppearace(e.target.value)}
                    type="text"
                    className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                  />
                </span>
                <span className="w-full">
                  <label className="block mt-10">Grade</label>
                  <input
                    value={addGrade}
                    onChange={(e) => setAddGrade(e.target.value)}
                    type="text"
                    className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                  />
                </span>
              </div>
              <label className="block mt-10">Description</label>
              <input
                value={addDetails}
                onChange={(e) => setAddDetails(e.target.value)}
                type="text"
                className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
              />
              <label className="block mt-4">Applications</label>
              <textarea
                value={addApplication}
                onChange={(e) => setAddApplication(e.target.value)}
                type="text"
                className="block w-full border max-h-[15rem] min-h-[10rem] h-[10rem] mt-2 border-gray-300 rounded-md py-2 px-4"
              />
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={addNewService}
              >
                Add Product
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
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
              <span>Delete Product</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Product ?
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
          <div className="bg-[#F8F8F8] p-5 border-2 overflow-y-auto h-[90vh] border-[#81BC06] rounded-lg">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowViewBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <ProductDiv
              img={showViewBox.image}
              Appearance={showViewBox.appearance}
              Grade={showViewBox.grade}
              name={showViewBox.name}
              desc={showViewBox.desc}
              Applications={showViewBox.applications}
            />
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
}

export default ProductMenu;
