import React, { useMemo, useState } from "react";
import { useTable } from "react-table";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "./Loading";
import axios from "axios";
import { News } from "../Recoil/index";
import { useSetRecoilState } from "recoil";
import {
  ADD_News,
  DELETE_News,
  GET_NEWS,
  IMAGE_UPLOAD,
  UPDATE_News,
} from "../Api";
import NewsViewCard from "./NewsCard";

function NewsCardMenu({ Blogss, setShowBlogCardMenu }) {
  const setNews = useSetRecoilState(News);
  const token = localStorage.getItem("token");
  const [editedNews, setEditedNews] = useState({
    publishedBy: undefined,
    sector: "Renewable Sector",
    source: undefined,
    date: Date.now(),
    headline: undefined,
    news: undefined,
    newsImg: undefined,
  });
  const [newNews, setNewNews] = useState({
    publishedBy: undefined,
    sector: "Renewable Sector",
    source: undefined,
    date: Date.now(),
    headline: undefined,
    news: undefined,
    newsImg: undefined,
  });
  const [showAddBox, setShowAddBox] = useState(false);
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showViewBox, setShowViewBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Published By",
        accessor: "publishedBy",
      },
      {
        Header: "Headline",
        accessor: "headline",
        Cell: ({ value }) => {
          // Extract the first 40 characters of the title
          const truncatedTitle =
            value?.length > 40 ? value?.substring(0, 40) + " ..." : value;
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
              onClick={() => {
                setEditedNews(original);
                setShowEditBox(original);
              }}
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
      editedNews.publishedBy &&
      editedNews.sector &&
      editedNews.source &&
      editedNews.date &&
      editedNews.headline &&
      editedNews.news &&
      editedNews.newsImg
    ) {
      let link1 = editedNews.newsImg;

      // If NewsImage is not a string, upload the new logo
      if (typeof editedNews.newsImg !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", editedNews.newsImg); // Use editLogo here
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

      // Proceed with updating the service
      try {
        const { data } = await axios.put(
          `${UPDATE_News}/${showEditBox?._id}`,
          {
            publishedBy: editedNews.publishedBy,
            sector: editedNews.sector,
            source: editedNews.source,
            date: editedNews.date,
            headline: editedNews.headline,
            news: editedNews.news,
            newsImg: link1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowEditBox(undefined);
          const blogdata = await GET_NEWS();
          setNews(blogdata);
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
        `${DELETE_News}/${showDeleteDialogBox?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        const blogdata = await GET_NEWS();
        setNews(blogdata);
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
      newNews.publishedBy &&
      newNews.sector &&
      newNews.source &&
      newNews.date &&
      newNews.headline &&
      newNews.news &&
      newNews.newsImg
    ) {
      let link1 = newNews.newsImg;

      // If editLogo is not a string, upload the new logo
      if (typeof link1 !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", link1); // Use link1 here
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

      // Proceed with updating the service
      try {
        const { data } = await axios.post(
          ADD_News,
          {
            publishedBy: newNews.publishedBy,
            sector: newNews.sector,
            source: newNews.source,
            date: newNews.date,
            headline: newNews.headline,
            news: newNews.news,
            newsImg: link1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowAddBox(undefined);
          setNewNews({
            publishedBy: undefined,
            sector: undefined,
            source: undefined,
            date: Date.now(),
            headline: undefined,
            news: undefined,
            newsImg: undefined,
          });
          const blogdata = await GET_NEWS();
          setNews(blogdata);
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

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-8 py-5 rounded shadow-md lg:w-[56rem] w-[90%] ">
          <div className="flex items-end justify-end w-full mb-5">
            <IoIosCloseCircle
              onClick={() => setShowBlogCardMenu(false)}
              className="cursor-pointer text-3xl text-gray-300"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl">News Menu</h2>
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
              <div className="flex items-center justify-center w-full mt-5">
                <div
                  className={`w-[1037px] h-[450px] rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                    !editedNews?.newsImg && "bg-[#D9D9D9]"
                  }`}
                  style={
                    editedNews?.newsImg
                      ? {
                          backgroundImage: `url(${
                            typeof editedNews?.newsImg !== "string"
                              ? URL.createObjectURL(editedNews?.newsImg)
                              : editedNews?.newsImg
                          })`,
                        }
                      : {}
                  }
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) =>
                      setEditedNews({
                        ...editedNews,
                        newsImg: e.target.files[0],
                      })
                    }
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Add News Img
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between p-10">
                <span className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-start justify-start flex-col">
                    <label>Published By</label>
                    <input
                      type="text"
                      placeholder="Author"
                      value={editedNews?.publishedBy}
                      onChange={(e) =>
                        setEditedNews({
                          ...editedNews,
                          publishedBy: e.target.value,
                        })
                      }
                      className="block w-[350px] border mt-2 border-gray-300 rounded-lg py-1 px-4"
                    />
                  </div>
                  <div className="flex items-start justify-start flex-col">
                    <label htmlFor="mySelect">Choose an Sector</label>
                    <select
                      id="mySelect"
                      value={editedNews?.sector}
                      onChange={(e) =>
                        setEditedNews({
                          ...editedNews,
                          sector: e.target.value,
                        })
                      }
                      className="block w-[350px] mt-2 border border-gray-300 rounded-lg py-1 px-4"
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
                      <option value="Pipeline Division">
                        Pipeline Division
                      </option>
                      <option value="Drilling Services">
                        Drilling Services
                      </option>
                    </select>
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between px-10">
                <span className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-start justify-start flex-col">
                    <label>Source</label>
                    <input
                      type="text"
                      placeholder="Source"
                      value={editedNews?.source}
                      onChange={(e) =>
                        setEditedNews({
                          ...editedNews,
                          source: e.target.value,
                        })
                      }
                      className="block w-[350px] border mt-2 border-gray-300 rounded-lg py-1 px-4"
                    />
                  </div>
                  <div className="flex items-start justify-start flex-col">
                    <label htmlFor="mySelect">Date</label>
                    <input
                      type="date"
                      placeholder="Date"
                      value={editedNews?.date}
                      onChange={(e) =>
                        setEditedNews({
                          ...editedNews,
                          date: e.target.value,
                        })
                      }
                      className="block w-[350px] border mt-2 border-gray-300 rounded-lg py-1 px-4"
                    />
                  </div>
                </span>
              </div>
              <span className="flex flex-col text-start items-start justify-start p-10 text-2xl font-semibold">
                <label className="text-[1.2rem] font-normal">Headline</label>
                <input
                  value={editedNews?.headline}
                  onChange={(e) =>
                    setEditedNews({
                      ...editedNews,
                      headline: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Headline"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-1 px-4"
                />
              </span>
              <span className="flex mb-10 flex-col text-start items-start justify-start px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label className="text-[1.2rem] text-black font-normal">
                  News
                </label>
                <textarea
                  value={editedNews?.news}
                  onChange={(e) =>
                    setEditedNews({
                      ...editedNews,
                      news: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="News"
                  className="block w-full max-h-[35rem] min-h-[20rem] border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update News
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
      {showViewBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[1070px] h-[90vh] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowViewBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <NewsViewCard Data={showViewBox} />
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
                  className={`w-[1037px] h-[450px] rounded-lg border-[#05A6F0] border flex items-center justify-evenly bg-cover relative ${
                    !newNews?.newsImg && "bg-[#05A6F01A]"
                  }`}
                  style={
                    newNews?.newsImg
                      ? {
                          backgroundImage: `url(${
                            typeof newNews?.newsImg !== "string"
                              ? URL.createObjectURL(newNews?.newsImg)
                              : newNews?.newsImg
                          })`,
                        }
                      : {}
                  }
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) =>
                      setNewNews({ ...newNews, newsImg: e.target.files[0] })
                    }
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Add News Img
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between">
                <span className="flex items-center flex-col md:flex-row justify-between w-full p-10 gap-10 md:gap-2">
                  <div className="flex items-start justify-start flex-col w-full">
                    <label>Published By</label>
                    <input
                      type="text"
                      placeholder="Author"
                      value={newNews?.publishedBy}
                      onChange={(e) =>
                        setNewNews({
                          ...newNews,
                          publishedBy: e.target.value,
                        })
                      }
                      className="block w-full md:w-[350px] border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-xl outline-none py-1 px-4"
                    />
                  </div>
                  <div className="flex items-start justify-start flex-col w-full">
                    <label htmlFor="mySelect">Choose an Sector</label>
                    <select
                      id="mySelect"
                      value={newNews?.sector}
                      onChange={(e) =>
                        setNewNews({
                          ...newNews,
                          sector: e.target.value,
                        })
                      }
                      className="block w-full md:w-[350px] mt-2 border bg-[#05A6F01A] border-[#05A6F0] rounded-xl outline-none py-1 px-4"
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
                      <option value="Pipeline Division">
                        Pipeline Division
                      </option>
                      <option value="Drilling Services">
                        Drilling Services
                      </option>
                    </select>
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center justify-between w-full gap-10 md:gap-2 px-10 flex-col md:flex-row">
                  <div className="flex items-start justify-start flex-col w-full">
                    <label>Source</label>
                    <input
                      type="text"
                      placeholder="Source"
                      value={newNews?.source}
                      onChange={(e) =>
                        setNewNews({
                          ...newNews,
                          source: e.target.value,
                        })
                      }
                      className="block w-full md:w-[350px] border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-xl outline-none py-1 px-4"
                    />
                  </div>
                  <div className="flex items-start justify-start flex-col w-full">
                    <label htmlFor="mySelect">Date</label>
                    <input
                      type="date"
                      placeholder="Date"
                      value={newNews?.date}
                      onChange={(e) =>
                        setNewNews({
                          ...newNews,
                          date: e.target.value,
                        })
                      }
                      className="block w-full md:w-[350px] border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-xl outline-none py-1 px-4"
                    />
                  </div>
                </span>
              </div>
              <span className="flex flex-col text-start items-start justify-start p-10 text-2xl font-semibold">
                <label className="text-[1.2rem] font-normal">Headline</label>
                <input
                  value={newNews?.headline}
                  onChange={(e) =>
                    setNewNews({
                      ...newNews,
                      headline: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Headline"
                  className="block w-full border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-xl outline-none py-1 px-4"
                />
              </span>
              <span className="flex mb-10 flex-col text-start items-start justify-start px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label className="text-[1.2rem] text-black font-normal">
                  News
                </label>
                <textarea
                  value={newNews?.news}
                  onChange={(e) =>
                    setNewNews({
                      ...newNews,
                      news: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="News"
                  className="block w-full max-h-[35rem] min-h-[20rem] border mt-2 bg-[#05A6F01A] border-[#05A6F0] rounded-xl outline-none py-2 px-4"
                />
              </span>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-[#05A6F0] hover:text-[white] border-[#05A6F0] border duration-500 ease-in rounded-lg bg-[#05A6F01A] font-normal text-[1.2rem]"
                onClick={addNewService}
              >
                Create News
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 hover:text-white duration-500 ease-in rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
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
              <span>Delete News</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this News ?
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

export default NewsCardMenu;
