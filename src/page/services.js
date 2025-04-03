import { useParams } from "react-router-dom";
import Footer from "../component/Footer";
import { useRecoilState, useRecoilValue } from "recoil";
import { Services, userInfo } from "../Recoil";
import Header from "../component/Header";
import icons from "../assets";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTable } from "react-table";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import axios from "axios";
import {
  ADD_SECTION,
  ADD_SERVICE_INNER,
  DELETE_SECTION,
  DELETE_SERVICE_INNER,
  GET_SERVICES,
  IMAGE_UPLOAD,
  UPDATE_SERVICE_INNER,
} from "../Api";
import { BiSolidFileFind } from "react-icons/bi";
import { ImageWithLoader } from "../component/ImageLoader";
import PageBannerWithTitle from "../component/PageBannerWithTitle";
import PageMainTitle from "../component/PageMainTitle";

function ServicesPage() {
  const targetDivRef = useRef(null);
  const [services, setServices] = useRecoilState(Services);
  const [currentService, setCurrentService] = useState(undefined);
  const token = localStorage.getItem("token");
  const [newService, setNewService] = useState({});
  const [showEditBox, setShowEditBox] = useState(undefined);
  const [showAddBox, setShowAddBox] = useState(false);
  const [showViewBox, setShowViewBox] = useState(undefined);
  const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(undefined);
  const [showDeleteSectionDialogBox, setShowDeleteSectionDialogBox] =
    useState(undefined);
  const [loading, setLoading] = useState(false);
  const { pageId,id } = useParams();
  const decodedId = decodeURIComponent(id);
  const decodedPageId = decodeURIComponent(pageId);
  const userData = useRecoilValue(userInfo);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shownNewSection, setShowNewSection] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  const CallFucntion = async () => {
    if (!services) {
      setServices(await GET_SERVICES());
    } else {
      const selectedService = services.filter((e) => e.title === decodedId);
      setCurrentService(selectedService[0]);
    }
  };
  useEffect(() => {
    CallFucntion();
  }, [services]);

  const handleEdit = async () => {
    setLoading(true);
    if (
      showEditBox.name &&
      showEditBox.sector &&
      showEditBox.section &&
      showEditBox.image &&
      showEditBox.formulae &&
      showEditBox.PhysicalAppearance &&
      showEditBox.Grade &&
      showEditBox.Desc &&
      showEditBox.Specification &&
      showEditBox.SafetyInformation &&
      showEditBox.Support
    ) {
      let link1 = showEditBox.image;

      // If editLogo is not a string, upload the new logo
      if (typeof showEditBox.image !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", showEditBox.image); // Use editLogo here
          const { data } = await axios.post(IMAGE_UPLOAD, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            link1 = data.fileUrl;
          } else {
            toast.error(data.message || "Image upload failed");
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

      // Proceed with updating the service
      try {
        const { data } = await axios.put(
          `${UPDATE_SERVICE_INNER}/${showEditBox?._id}`,
          {
            serviceName: decodedId,
            name: showEditBox.name,
            sector: showEditBox.sector,
            section: showEditBox.section,
            image: link1,
            formulae: showEditBox.formulae,
            PhysicalAppearance: showEditBox.PhysicalAppearance,
            Grade: showEditBox.Grade,
            Desc: showEditBox.Desc,
            Specification: showEditBox.Specification,
            SafetyInformation: showEditBox.SafetyInformation,
            Support: showEditBox.Support,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowEditBox(undefined);
          const blogdata = await GET_SERVICES();
          setServices(blogdata);
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
        `${DELETE_SERVICE_INNER}/${encodeURIComponent(decodedId)}/${
          showDeleteDialogBox?._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        const blogdata = await GET_SERVICES();
        setServices(blogdata);
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
      newService.name &&
      (newService.sector || decodedId) &&
      (newService.section || currentService?.section[0]?.name) &&
      newService.image &&
      newService.formulae &&
      newService.PhysicalAppearance &&
      newService.Grade &&
      newService.Desc &&
      newService.Specification &&
      newService.SafetyInformation &&
      newService.Support
    ) {
      let link1 = newService.image;

      // If editLogo is not a string, upload the new logo
      if (typeof newService.image !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", newService.image); // Use addLogo here
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
          ADD_SERVICE_INNER,
          {
            serviceName: decodedId,
            name: newService.name,
            sector: newService.sector || decodedId,
            section: newService.section || currentService?.section[0]?.name,
            image: link1,
            formulae: newService.formulae,
            PhysicalAppearance: newService.PhysicalAppearance,
            Grade: newService.Grade,
            Desc: newService.Desc,
            Specification: newService.Specification,
            SafetyInformation: newService.SafetyInformation,
            Support: newService.Support,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowAddBox(undefined);
          setNewService(undefined);
          const blogdata = await GET_SERVICES();
          setServices(blogdata);
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

  const handleDeleteSection = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${DELETE_SECTION}/${encodeURIComponent(decodedId)}/${
          showDeleteSectionDialogBox?._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        const blogdata = await GET_SERVICES();
        setServices(blogdata);
        setShowDeleteSectionDialogBox(undefined);
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

  const addNewServiceSection = async () => {
    setLoading(true);
    if (newSection) {
      // Proceed with updating the service
      try {
        const { data } = await axios.post(
          ADD_SECTION,
          {
            serviceName: decodedId,
            name: newSection,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setShowNewSection(false);
          setNewSection("");
          const blogdata = await GET_SERVICES();
          setServices(blogdata);
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

  const columns = useMemo(
    () => [
      {
        Header: "Sr. No.",
        accessor: (row, i) => i + 1, // Generate serial number
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => {
          // Extract the first 40 characters of the title
          const truncatedTitle =
            value.length > 20 ? value.substring(0, 20) + " ..." : value;
          return <div>{truncatedTitle}</div>;
        },
      },
      {
        Header: "Sector",
        accessor: "sector",
        Cell: ({ value }) => {
          // Extract the first 40 characters of the title
          const truncatedTitle =
            value.length > 20 ? value.substring(0, 20) + " ..." : value;
          return <div>{truncatedTitle}</div>;
        },
      },
      {
        Header: "Section",
        accessor: "section",
        Cell: ({ value }) => {
          // Extract the first 40 characters of the title
          const truncatedTitle =
            value.length > 20 ? value.substring(0, 20) + " ..." : value;
          return <div>{truncatedTitle}</div>;
        },
      },
      {
        Header: "Formulae",
        accessor: "formulae",
        Cell: ({ value }) => {
          // Extract the first 40 characters of the title
          const truncatedTitle =
            value.length > 20 ? value.substring(0, 20) + " ..." : value;
          return <div>{truncatedTitle}</div>;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => (
          <div className="flex space-x-2 w-[120px]">
            {userData ? (
              <button
                onClick={() => setShowViewBox(original)}
                className="text-black px-2 py-1 rounded hover:bg-green-100"
              >
                <FaEye />
              </button>
            ) : (
              <button
                onClick={() => setShowViewBox(original)}
                className="text-black flex items-center justify-center gap-2 px-2 py-1 rounded hover:bg-green-100"
              >
                View <FaEye className="text-[1.2rem] mt-1" />
              </button>
            )}
            {userData && (
              <button
                onClick={() => setShowEditBox(original)}
                className="text-white px-2 py-1 rounded hover:bg-blue-100"
              >
                <ImageWithLoader  src="/edit.png" />
              </button>
            )}
            {userData && (
              <button
                onClick={() => setShowDeleteDialogBox(original)}
                className="px-2 py-1 rounded hover:bg-red-100"
              >
                <MdDeleteOutline className="text-2xl" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [userData]
  );

  const tableData = useMemo(() => {
    let filteredData = currentService?.InnerServices || [];

    // Apply sector filter
    if (selectedSector) {
      filteredData = filteredData.filter(
        (blog) => blog.section.toLowerCase() === selectedSector?.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(
        (blog) =>
          blog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.section.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData;
  }, [currentService, searchQuery, selectedSector]);

  const tableInstance = useTable({ columns, data: tableData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useEffect(() => {
    if (currentService) {
      setSelectedSector(currentService?.section[0]?.name);
    }
  }, [currentService]);

  const handleExploreClick = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
    }
  };

  // Ensure the ref is correctly set after showSearchBar changes
  useEffect(() => {
    if (showSearchBar && targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showSearchBar]);

  const targetTopRef = useRef(null);

  const handlePageLoads = () => {
    if (targetTopRef.current) {
      targetTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handlePageLoads();
  }, []);

  return (
    <>
      <Header />
      {/* <img
        ref={targetTopRef}
        src={'/product-new.jpg'}
        className="w-full h-[374px] object-cover"
        alt="banner"
    
      /> */}

      <PageBannerWithTitle  title={decodedPageId} ref={targetTopRef}  backgroundImage={icons.AboutUs} />
        <div className="mt-11">
        <PageMainTitle blackColorText={decodedId} />


        </div>
    
      <div className="px-12 mt-11 flex items-center justify-center flex-col relative">
      <BiSolidFileFind
            className="text-5xl text-[#81BC06] cursor-pointer absolute right-7 top-0"
            onClick={() => {
              setShowSearchBar(!showSearchBar);
              !showSearchBar && handleExploreClick();
            }}
          />
        <div className="mb-10 flex items-center justify-center mt-5 w-[1032px]">
          <div className=" flex flex-wrap items-start justify-start w-[1032px]">
            {currentService?.section &&
              currentService?.section.map((e, index) => {
                return (
                  <span
                    ref={targetDivRef}
                    key={index}
                    className={`${
                      selectedSector === e.name ? "bg-[#81BC06]" : "border-2"
                    } text-center flex items-center justify-center gap-2 cursor-pointer hover:bg-[#81BC06] mt-4 mr-4 border-[#878787] p-2 rounded-lg`}
                  >
                    <span
                      className="hover:text-gray-500"
                      onClick={() => setSelectedSector(e.name)}
                    >
                      {e.name}
                    </span>
                    {userData && (
                      <MdDeleteOutline
                        onClick={() => setShowDeleteSectionDialogBox(e)}
                        className="hover:text-[#F35325]"
                      />
                    )}
                  </span>
                );
              })}
            {userData && (
              <span
                onClick={() => setShowNewSection(true)}
                className={`text-center text-white border-2 flex items-center justify-center gap-2 cursor-pointer bg-[#05A6F0] mt-4 mr-4 border-[#878787] p-2 rounded-lg`}
              >
                Add New Section <MdAddCircleOutline />
              </span>
            )}
          </div>
          {userData && (
            <div
              onClick={() => setShowAddBox(true)}
              className="flex cursor-pointer items-center justify-center text-3xl"
            >
              <MdAddCircleOutline />
            </div>
          )}
        </div>
        {showSearchBar && (
          <div className="border-2 border-[#81BC06] p-2 px-5 w-[1032px] rounded-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none w-full"
              placeholder="Search Services by Name, Sector or Section"
            />
          </div>
        )}
        {showViewBox ? (
          <>
            <div className="bg-[#F8F8F8] mt-10 border-[#81BC06] border-2 mb-10 p-4 w-[1037px]  rounded-lg overflow-y-auto">
              <div className="flex items-end justify-end w-[1000px]">
                <IoIosCloseCircle
                  onClick={() => setShowViewBox(undefined)}
                  className="cursor-pointer text-3xl text-gray-300"
                />
              </div>
              <div className="w-full  mb-5 flex items-center justify-center flex-col">
                <span className="text-[#81BC06] font-medium text-[35px] w-full text-center leading-10 underline underline-offset-8">
                  {showViewBox?.name}
                </span>
                <div className="flex mt-10 items-center gap-10 w-full justify-center">
                  <div className="flex flex-col h-[615px] w-[388px] items-start justify-start">
                    <div className="flex mb-10 items-center justify-center gap-2">
                      <img
                        src={showViewBox?.image}
                        className="w-[388px] h-[455px] rounded-xl object-cover"
                      />
                    </div>
                    <span
                      className="font-normal text-[#10100f] text-[16px] leading-5"
                      style={{
                        fontFamily: "Poppins",
                      }}
                    >
                      Physical Appearance :{" "}
                      <span className="text-black">
                        {showViewBox?.PhysicalAppearance}
                      </span>
                    </span>
                    <span
                      className="font-normal mt-5 text-[#10100f] text-[16px] leading-5"
                      style={{
                        fontFamily: "Poppins",
                      }}
                    >
                      Grade :{" "}
                      <span className="text-black">{showViewBox?.Grade}</span>
                    </span>
                  </div>
                  <div className="flex flex-col w-[506px] items-start justify-start">
                    <span
                      style={{ fontFamily: "Poppins" }}
                      className="font-normal text-[#10100f] text-[16px] leading-5"
                    >
                      {showViewBox.Desc.length > 350 ? (
                        <>
                          {showViewBox.Desc.slice(0, 350)} <br /> <br />
                          {showViewBox.Desc.slice(350)}
                        </>
                      ) : (
                        showViewBox.Desc
                      )}
                    </span>

                    <span
                      className="font-semibold mt-5 leading-5 mb-5 text-[16px]"
                      style={{
                        fontFamily: "Poppins",
                      }}
                    >
                      Specification
                    </span>
                    <span
                      className="font-normal text-[#10100f] leading-5 text-[16px]"
                      style={{
                        fontFamily: "Poppins",
                      }}
                    >
                      <ul
                        style={{ fontFamily: "Poppins" }}
                        className="font-normal text-[#10100f]  text-[16px] leading-[1.5rem]"
                      >
                        {showViewBox?.Specification.split(",").map(
                          (item, index) => (
                            <li key={index}>
                              {index + 1 + ".  "}
                              {item.trim()}
                            </li>
                          )
                        )}
                        <span className="flex items-start gap-3 justify-center">
                          &#8226; <li>{showViewBox?.SafetyInformation}</li>
                        </span>
                        <span className="flex items-start gap-3 justify-center">
                          &#8226; <li>{showViewBox?.Support}</li>
                        </span>
                      </ul>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentService ? (
          <div className="overflow-x-auto mt-10 mb-10 overflow-y-auto max-h-[60vh] w-[1032px]">
            <table
              {...getTableProps()}
              className="min-w-full bg-white divide-y divide-gray-200"
            >
              <thead className="bg-[#81BC06]">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-3 text-left text-[0.8rem] font-medium text-black uppercase tracking-wider"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-[#F8F8F8] text-[#10100f] divide-y divide-gray-200"
              >
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headerGroups[0].headers.length}
                      className="text-center py-4"
                    >
                      No Services found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
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
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <Footer />
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
                  className={`w-[388px] h-[455px] rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                    !showEditBox?.image && "bg-[#D9D9D9]"
                  }`}
                  style={
                    showEditBox?.image
                      ? {
                          backgroundImage: `url(${
                            typeof showEditBox?.image !== "string"
                              ? URL.createObjectURL(showEditBox?.image)
                              : showEditBox?.image
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
                      setShowEditBox({
                        ...showEditBox,
                        image: e.target.files[0],
                      })
                    }
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Edit Service Img
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between p-10">
                <span className="flex items-center justify-between w-full gap-2">
                  <div className="flex w-[250px] items-start justify-start flex-col">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={showEditBox?.name}
                      onChange={(e) =>
                        setShowEditBox({ ...showEditBox, name: e.target.value })
                      }
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                  <div className="flex items-start justify-start flex-col">
                    <label>Formulae</label>
                    <input
                      type="text"
                      placeholder="Formulae"
                      value={showEditBox?.formulae}
                      onChange={(e) =>
                        setShowEditBox({
                          ...showEditBox,
                          formulae: e.target.value,
                        })
                      }
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                </span>
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-start mt-5 justify-start flex-col">
                    <label>Physical Appearance</label>
                    <input
                      value={showEditBox?.PhysicalAppearance}
                      onChange={(e) =>
                        setShowEditBox({
                          ...showEditBox,
                          PhysicalAppearance: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Physical Appearance"
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                  <div className="flex items-start mt-5 justify-start flex-col">
                    <label>Grade</label>
                    <input
                      value={showEditBox?.Grade}
                      onChange={(e) =>
                        setShowEditBox({
                          ...showEditBox,
                          Grade: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Grade"
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between gap-10 p-10">
                <span className="flex flex-col w-full justify-center gap-2">
                  <label htmlFor="mySelect">Choose an Sector</label>
                  <select
                    id="mySelect"
                    value={showEditBox?.sector}
                    onChange={(e) =>
                      setShowEditBox({ ...showEditBox, sector: e.target.value })
                    }
                    className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4"
                  >
                    <option value={decodedId}>{decodedId}</option>
                  </select>
                </span>
                <span className="flex flex-col w-full justify-center gap-2">
                  <label htmlFor="mySelect">Choose an Section</label>
                  <select
                    id="mySelect"
                    value={showEditBox?.section}
                    onChange={(e) =>
                      setShowEditBox({
                        ...showEditBox,
                        section: e.target.value,
                      })
                    }
                    className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4"
                  >
                    {currentService?.section &&
                      currentService?.section.map((e, index) => {
                        return (
                          <option key={index} value={e?.name}>
                            {e?.name}
                          </option>
                        );
                      })}
                  </select>
                </span>
              </div>
              <span className="flex mb-5 flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Description</label>
                <textarea
                  value={showEditBox?.Desc}
                  onChange={(e) =>
                    setShowEditBox({ ...showEditBox, Desc: e.target.value })
                  }
                  type="text"
                  placeholder="Description"
                  className="block w-full max-h-[35rem] min-h-[10rem] border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <span className="flex flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Specification</label>
                <textarea
                  value={showEditBox?.Specification}
                  onChange={(e) =>
                    setShowEditBox({
                      ...showEditBox,
                      Specification: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Specification"
                  className="block w-full max-h-[35rem] min-h-[5rem] border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <span className="flex mb- flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Safety Information</label>
                <input
                  value={showEditBox?.SafetyInformation}
                  onChange={(e) =>
                    setShowEditBox({
                      ...showEditBox,
                      SafetyInformation: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Safety Information"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <span className="flex mb-10 flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Support</label>
                <input
                  value={showEditBox?.Support}
                  onChange={(e) =>
                    setShowEditBox({ ...showEditBox, Support: e.target.value })
                  }
                  type="text"
                  placeholder="Support"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={handleEdit}
              >
                Update Service
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
          <div className="bg-[#F8F8F8] p-4 w-[1032px] h-[90vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowAddBox(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex items-center justify-center w-full mt-5">
                <div
                  className={`w-[388px] h-[455px] rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                    !newService?.image && "bg-[#D9D9D9]"
                  }`}
                  style={
                    newService?.image
                      ? {
                          backgroundImage: `url(${
                            typeof newService?.image !== "string"
                              ? URL.createObjectURL(newService?.image)
                              : newService?.image
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
                      setNewService({ ...newService, image: e.target.files[0] })
                    }
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <LuUpload className="text-2xl text-[#10100f]" />
                    <span className="text-[#10100f] text-2xl font-bold ml-2">
                      Add Service Img
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between p-10">
                <span className="flex items-center justify-between w-full gap-2">
                  <div className="flex w-[250px] items-start justify-start flex-col">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newService?.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                  <div className="flex items-start justify-start flex-col">
                    <label>Formulae</label>
                    <input
                      type="text"
                      placeholder="Formulae"
                      value={newService?.formulae}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          formulae: e.target.value,
                        })
                      }
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                </span>
                <span className="flex items-center justify-between w-full">
                  <div className="flex items-start mt-5 justify-start flex-col">
                    <label>Physical Appearance</label>
                    <input
                      value={newService?.PhysicalAppearance}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          PhysicalAppearance: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Physical Appearance"
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                  <div className="flex items-start mt-5 justify-start flex-col">
                    <label>Grade</label>
                    <input
                      value={newService?.Grade}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          Grade: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Grade"
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                </span>
              </div>
              <div className="flex items-center justify-between gap-10 p-10">
                <span className="flex flex-col w-full justify-center gap-2">
                  <label htmlFor="mySelect1">Choose an Sector</label>
                  <select
                    id="mySelect1"
                    value={newService?.sector}
                    onChange={(e) =>
                      setNewService({ ...newService, sector: e.target.value })
                    }
                    className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4"
                  >
                    <option value={decodedId}>{decodedId}</option>
                  </select>
                </span>
                <span className="flex flex-col w-full justify-center gap-2">
                  <label htmlFor="mySelect">Choose an Section</label>
                  <select
                    id="mySelect"
                    value={newService?.section}
                    onChange={(e) =>
                      setNewService({ ...newService, section: e.target.value })
                    }
                    className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4"
                  >
                    {currentService?.section &&
                      currentService?.section.map((e, index) => {
                        return (
                          <option key={index} value={e?.name}>
                            {e?.name}
                          </option>
                        );
                      })}
                    {currentService?.section?.length <= 1 && (
                      <option value={"Others"}>{"Others"}</option>
                    )}
                  </select>
                </span>
              </div>
              <span className="flex mb-5 flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Description</label>
                <textarea
                  value={newService?.Desc}
                  onChange={(e) =>
                    setNewService({ ...newService, Desc: e.target.value })
                  }
                  type="text"
                  placeholder="Description"
                  className="block w-full max-h-[35rem] min-h-[10rem] border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <span className="flex flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Specification</label>
                <textarea
                  value={newService?.Specification}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      Specification: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Specification"
                  className="block w-full max-h-[35rem] min-h-[5rem] border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <span className="flex mb- flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Safety Information</label>
                <input
                  value={newService?.SafetyInformation}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      SafetyInformation: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Safety Information"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
              <span className="flex mb-10 flex-col text-start items-start justify-center px-10 text-2xl font-semibold text-[1rem] text-[#10100f] whitespace-pre-line">
                <label>Support</label>
                <input
                  value={newService?.Support}
                  onChange={(e) =>
                    setNewService({ ...newService, Support: e.target.value })
                  }
                  type="text"
                  placeholder="Support"
                  className="block w-full border mt-2 border-gray-300 rounded-md py-2 px-4"
                />
              </span>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={addNewService}
              >
                Create Service
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
              <span>Delete Service</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Service ?
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
      {shownNewSection && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[500px] h-[40vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowNewSection(undefined)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto">
              <div className="flex flex-col items-center justify-between p-10">
                <span className="flex items-center justify-between w-full gap-2">
                  <div className="flex w-[250px] items-start justify-start flex-col">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      className="block w-[250px] border mt-2 border-gray-300 rounded-md py-2 px-4"
                    />
                  </div>
                </span>
              </div>
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={addNewServiceSection}
              >
                Create Section
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => setShowNewSection(undefined)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteSectionDialogBox && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[501px] border-2 border-[#81BC06] rounded-lg">
            <div className="flex items-center justify-between  text-center font-bold text-2xl">
              <span>Delete Section</span>
              <IoIosCloseCircle
                className="text-3xl text-gray-300 cursor-pointer"
                onClick={() => setShowDeleteSectionDialogBox(undefined)}
              />
            </div>
            <label className="block mt-10 text-2xl font-bold">
              Are you Sure You want to delete this Section ?
            </label>
            <label className="block mt-4 text-[1.2rem] text-black">
              Warning !! You can't revert this action.
            </label>
            <label className="block mt-4 text-[1.2rem] text-black"></label>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer flex items-center justify-center hover:bg-red-800 rounded-lg bg-[#F35325] text-gray-900 font-bold text-[1.2rem]"
                onClick={handleDeleteSection}
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

export default ServicesPage;
