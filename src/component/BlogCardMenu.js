import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { RiFolderAddFill } from "react-icons/ri";
import { IoIosCloseCircle, IoMdEye } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import BlogCard from "./BlogCard";
import { IoHeartCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import { Blogs } from "../Recoil/index";
import { useSetRecoilState } from "recoil";
import {
  ADD_BLOG,
  DELETE_BLOG,
  GET_BLOGS,
  IMAGE_UPLOAD,
  UPDATE_BLOG,
} from "../Api";

function BlogCardMenu({ Blogss, setShowBlogCardMenu }) {
  const setBlogs = useSetRecoilState(Blogs);
  const token = localStorage.getItem("token");
  const [editHeading, setEditHeading] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [editBgImage, setEditBgImage] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editViews, setEditViews] = useState(1);
  const [editLikes, setEditLikes] = useState(1);
  const [editSector, setEditSector] = useState("Renewable Sector");
  const [editSource, setEditSource] = useState("");
  const [addHeading, setAddHeading] = useState("");
  const [addDetails, setAddDetails] = useState("");
  const [addLogo, setAddLogo] = useState("");
  const [addBgImage, setAddBgImage] = useState("");
  const [addAuthor, setAddAuthor] = useState("");
  const [addViews, setAddViews] = useState(1);
  const [addLikes, setAddLikes] = useState(1);
  const [addSector, setAddSector] = useState("Renewable Sector");
  const [addSource, setAddSource] = useState("");
  const [showAddBox, setShowAddBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showViewBox, setShowViewBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Author",
        accessor: "author",
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ value }) => {
          // Extract the first 40 characters of the title
          const truncatedTitle =
            value.length > 40 ? value.substring(0, 50) + " ..." : value;
          return <div>{truncatedTitle}</div>;
        },
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
      editLogo &&
      editBgImage &&
      editAuthor &&
      editViews &&
      editLikes &&
      editSector &&
      editSource
    ) {
      let link1 = editLogo;
      let link2 = editBgImage;

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
            link1 = data.fileUrl;
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
      // If editBgImage is not a string, upload the new logo
      if (typeof editBgImage !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", editBgImage); // Use editBgImage here
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link2 = data.fileUrl;
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
          `${UPDATE_BLOG}/${showEditBox?._id}`,
          {
            author: editAuthor,
            sector: editSector,
            source: editSource,
            title: editHeading,
            content: editDetails,
            authorImg: link1,
            blogImg: link2,
            views: editViews,
            likes: editLikes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowEditBox(undefined);
          const blogdata = await GET_BLOGS();
          setBlogs(blogdata);
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
        `${DELETE_BLOG}/${showDeleteDialogBox?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        const blogdata = await GET_BLOGS();
        setBlogs(blogdata);
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
      addLogo &&
      addBgImage &&
      addAuthor &&
      addViews &&
      addLikes &&
      addSector &&
      addSource
    ) {
      let link1 = addLogo;
      let link2 = addBgImage;

      // If editLogo is not a string, upload the new logo
      if (typeof addLogo !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", addLogo); // Use addLogo here
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link1 = data.fileUrl;
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
      // If addBgImage is not a string, upload the new logo
      if (typeof addBgImage !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", addBgImage); // Use addBgImage here
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link2 = data.fileUrl;
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
        const { data } = await axios.post(
          ADD_BLOG,
          {
            author: addAuthor,
            sector: addSector,
            source: addSource,
            title: addHeading,
            content: addDetails,
            authorImg: link1,
            blogImg: link2,
            views: addViews,
            likes: addLikes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowAddBox(undefined);
          setAddHeading("");
          setAddDetails("");
          setAddLogo("");
          setAddBgImage("");
          setAddAuthor("");
          setAddViews("");
          setAddLikes("");
          setAddSector("Renewable Sector");
          setAddSource("");
          const blogdata = await GET_BLOGS();
          setBlogs(blogdata);
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

  const tableInstance = useTable({ columns, data: Blogss });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    if (showEditBox) {
      setEditHeading(showEditBox?.title);
      setEditLogo(showEditBox?.authorImg);
      setEditDetails(showEditBox?.content);
      setEditLikes(showEditBox?.likes);
      setEditBgImage(showEditBox?.blogImg);
      setEditAuthor(showEditBox?.author);
      setEditViews(showEditBox?.views);
    }
  }, [showEditBox]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-8 py-5 rounded shadow-md w-[95%] md:w-[90vw] lg:w-[56rem]">
          <div className="flex items-end justify-end w-full mb-5">
            <IoIosCloseCircle
              onClick={() => setShowBlogCardMenu(false)}
              className="cursor-pointer text-3xl text-gray-300"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl">Blogs Menu</h2>
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
          <div className="bg-[#F8F8F8] p-4 w-[1032px] h-[90vh] border-2 border-[#05A6F0] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowEditBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex items-center justify-center w-full mt-5">
                <div
                  className={`w-[1037px] h-[450px] rounded-lg flex items-center justify-evenly bg-cover relative  border-[#05A6F0] outline-none ${
                    !editBgImage && "bg-[#05A6F01A]"
                  }`}
                  style={
                    editBgImage
                      ? {
                          backgroundImage: `url(${
                            typeof editBgImage !== "string"
                              ? URL.createObjectURL(editBgImage)
                              : editBgImage
                          })`,
                        }
                      : {}
                  }
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setEditBgImage(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Update Blog logo
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between p-10">
                <span className="flex items-center justify-center gap-2">
                  <div
                    className={`bg-[#D9D9D9] flex items-center  justify-evenly w-[42px] h-[34.29px] rounded-full bg-cover relative ${
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
                      id="icon-upload"
                      className="hidden"
                      onChange={(e) => setEditLogo(e.target.files[0])}
                    />
                    <label
                      htmlFor="icon-upload"
                      className="flex items-center cursor-pointer"
                    >
                      <LuUpload className="text-1xl text-[#10100f]" />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Author"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="block w-full border mt-2 bg-[#05A6F01A] border-[#05A6F0]  rounded-md py-2 px-4"
                  />
                </span>
                <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-2xl py-2 px-4">
                  <IoMdEye className="text-2xl" />
                  <input
                    value={editViews}
                    onChange={(e) =>
                      setEditViews(e.target.value >= 1 ? e.target.value : 1)
                    }
                    type="text"
                    placeholder="Views"
                    className="block w-full outline-none bg-transparent"
                  />
                </span>
                <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-2xl py-2 px-4">
                  <IoHeartCircleOutline className="text-2xl" />
                  <input
                    value={editLikes}
                    onChange={(e) =>
                      setEditLikes(e.target.value >= 1 ? e.target.value : 1)
                    }
                    type="text"
                    placeholder="Likes"
                    className="block w-full outline-none bg-transparent"
                  />
                </span>
              </div>
              <div className="flex items-center justify-between p-10">
                <span className="flex flex-col w-full justify-center gap-2">
                  <label htmlFor="mySelect">Choose an Sector</label>
                  <select
                    id="mySelect"
                    value={editSector}
                    onChange={(e) => setEditSector(e.target.value)}
                    className="block w-full mt-2 border  rounded-2xl py-2 px-4 bg-[#05A6F01A] border-[#05A6F0] "
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
                <span className="block w-full mt-2 rounded-md py-2 px-4">
                  <label htmlFor="mySelect">Blog Source</label>
                  <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-2xl py-2 px-4">
                    <IoLink className="text-2xl" />
                    <input
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      type="text"
                      placeholder="Source"
                      className="block w-full outline-none bg-transparent"
                    />
                  </span>
                </span>
              </div>
              <span className="flex text-start items-center justify-center p-10 text-2xl font-semibold">
                <input
                  value={editHeading}
                  onChange={(e) => setEditHeading(e.target.value)}
                  type="text"
                  placeholder="Title"
                  className="block w-full border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-2xl py-2 px-4"
                />
              </span>
              <span className="flex mb-10 flex-col text-start items-center justify-center px-10 text-2xl font-normal text-[1rem] text-[#10100f] whitespace-pre-line">
                <textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  type="text"
                  placeholder="Description"
                  className="block w-full max-h-[35rem] min-h-[20rem] border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-2xl py-2 px-4"
                />
              </span>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:text-white duration-700 hover:bg-[#05A6F0] rounded-lg bg-[#05A6F01A] border-[#05A6F0] border font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update Blog
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] duration-700 hover:text-white font-normal text-[1.2rem]"
                onClick={() => setShowEditBox(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showViewBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[1070px] h-[90vh] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowViewBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <BlogCard
              img={showViewBox.blogImg}
              profileIcon={showViewBox.authorImg}
              author={showViewBox.author}
              Date={showViewBox.date}
              time={showViewBox.time}
              views={showViewBox.views}
              likes={showViewBox.likes}
              title={showViewBox.title}
              description={showViewBox.content}
            />
          </div>
        </div>
      )}
      {showAddBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[1032px] h-[90vh] border-2 border-[#05A6F0] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowAddBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex items-center justify-center w-full mt-5">
                <div
                  className={`w-[1037px] h-[450px] rounded-t-lg flex items-center justify-evenly bg-cover relative border border-[#05A6F0] rounded-lg ${
                    !addBgImage && "bg-[#05A6F01A]"
                  }`}
                  style={
                    addBgImage
                      ? {
                          backgroundImage: `url(${
                            typeof addBgImage !== "string"
                              ? URL.createObjectURL(addBgImage)
                              : addBgImage
                          })`,
                        }
                      : {}
                  }
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setAddBgImage(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Add Blog logo
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between p-10">
                <span className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-start justify-start flex-col">
                    <label>Author Image</label>
                    <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-md py-2 px-4">
                      <div
                        className={`bg-[#D9D9D9] flex items-center justify-evenly w-[42px] h-[34.29px] rounded-full bg-cover relative ${
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
                          id="icon-upload"
                          className="hidden"
                          onChange={(e) => setAddLogo(e.target.files[0])}
                        />
                        <label
                          htmlFor="icon-upload"
                          className="flex items-center cursor-pointer"
                        >
                          <LuUpload className="text-1xl text-[#10100f]" />
                        </label>
                      </div>
                    </span>
                  </div>
                  <div className="flex items-start justify-start flex-col">
                    <label>Author Name</label>
                    <input
                      type="text"
                      placeholder="Author"
                      value={addAuthor}
                      onChange={(e) => setAddAuthor(e.target.value)}
                      className="block w-[247px] border mt-2  rounded-2xl py-2 px-4 bg-[#05A6F01A] border-[#05A6F0] outline-none"
                    />
                  </div>
                </span>
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-start mt-5 justify-start flex-col">
                    <label>Blog Views</label>
                    <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-2xl py-2 px-4">
                      <IoMdEye className="text-2xl" />
                      <input
                        value={addViews}
                        onChange={(e) =>
                          setAddViews(e.target.value >= 1 ? e.target.value : 1)
                        }
                        type="text"
                        placeholder="Views"
                        className="block w-full outline-none bg-transparent "
                      />
                    </span>
                  </div>
                  <div className="flex items-start mt-5 justify-start flex-col">
                    <label>Blog Likes</label>
                    <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-2xl py-2 px-4">
                      <IoHeartCircleOutline className="text-2xl" />
                      <input
                        value={addLikes}
                        onChange={(e) =>
                          setAddLikes(e.target.value >= 1 ? e.target.value : 1)
                        }
                        type="text"
                        placeholder="Likes"
                        className="block w-full outline-none bg-transparent"
                      />
                    </span>
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between p-10">
                <span className="flex flex-col w-full justify-center gap-2">
                  <label htmlFor="mySelect">Choose an Sector</label>
                  <select
                    id="mySelect"
                    value={addSector}
                    onChange={(e) => setAddSector(e.target.value)}
                    className="block w-full mt-2 border  rounded-2xl py-2 px-4 bg-[#05A6F01A] border-[#05A6F0]"
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
                <span className="block w-full mt-2 rounded-md py-2 px-4">
                  <label htmlFor="mySelect">Blog Source</label>
                  <span className="flex items-center justify-center bg-[#05A6F01A] border-[#05A6F0] gap-2 border mt-2  rounded-2xl py-2 px-4">
                    <IoLink className="text-2xl" />
                    <input
                      value={addSource}
                      onChange={(e) => setAddSource(e.target.value)}
                      type="text"
                      placeholder="Source"
                      className="block w-full outline-none bg-transparent"
                    />
                  </span>
                </span>
              </div>
              <span className="flex text-start items-center justify-center p-10 text-2xl font-semibold">
                <input
                  value={addHeading}
                  onChange={(e) => setAddHeading(e.target.value)}
                  type="text"
                  placeholder="Title"
                  className="block w-full border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-2xl py-2 px-4 outline-none"
                />
              </span>
              <span className="flex mb-10 flex-col text-start items-center justify-center px-10 text-2xl font-normal text-[1rem] text-[#10100f] whitespace-pre-line">
                <textarea
                  value={addDetails}
                  onChange={(e) => setAddDetails(e.target.value)}
                  type="text"
                  placeholder="Description"
                  className="block w-full max-h-[35rem] min-h-[20rem] border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-2xl outline-none py-2 px-4"
                />
              </span>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] hover:text-white duration-700  cursor-pointer hover:bg-[#05A6F0] rounded-lg font-normal text-[1.2rem] bg-[#05A6F01A] border-[#05A6F0] border"
                onClick={addNewService}
              >
                Create Blog
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem] hover:text-white"
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
          <div className="bg-[#F8F8F8] p-4 w-[501px] border-2  rounded-lg bg-[#05A6F01A] border-[#05A6F0] ">
            <div className="flex items-center justify-between  text-center font-bold text-2xl">
              <span>Delete Blog</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Blog ?
            </label>
            <label className="block mt-4 text-[1.2rem] text-black">
              Warning !! You can't revert this action.
            </label>
            <label className="block mt-4 text-[1.2rem] text-black"></label>
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

export default BlogCardMenu;
