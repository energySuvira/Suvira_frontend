import Header from "../component/Header";
import Footer from "../component/Footer";
import CareerCard from "../component/careerCard";
import icons from "../assets";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiUpload2Fill } from "react-icons/ri";
import JobPostingMenu from "../component/JobPostingMenu";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CHANGE_BANNER,
  FILE_UPLOAD,
  GET_LOGO,
  IMAGE_UPLOAD,
  JOB_APPLICATION,
} from "../Api";
import Loading from "../component/Loading";
import { useRecoilState, useRecoilValue } from "recoil";
import { JobPostings, Logo, userInfo } from "../Recoil";
import { IoIosCloseCircle } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import PageBannerWithTitle from "../component/PageBannerWithTitle";
import PageMainTitle from "../component/PageMainTitle";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Accordion from "../component/Accordion";
import ReadMoreBtn from "../component/ReadMoreBtn";

const Career = () => {
  const [logo, setLogo] = useRecoilState(Logo);
  const token = localStorage?.getItem("token") || undefined;
  const targetDivRef = useRef(null);
  const userData = useRecoilValue(userInfo);
  const Openings = useRecoilValue(JobPostings);
  const [firstName, setfirstName] = useState(null);
  const [latName, setlatName] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [number, setnumber] = useState(null);
  const [email, setemail] = useState(null);
  const [dob, setdob] = useState(null);
  const [gender, setgender] = useState(null);
  const [address, setaddress] = useState(null);
  const [zipCode, setzipCode] = useState(null);
  const [education, seteducation] = useState(null);
  const [experience, setexperience] = useState(null);
  const [field, setfield] = useState("Computer Engineer");
  const [role, setrole] = useState("Higher Engineer");
  const [currentCtc, setcurrentCtc] = useState(null);
  const [expectedCtc, setexpectedCtc] = useState(null);
  const [resume, setresume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobPostingMenu, setJobPostingMenu] = useState(false);
  const [jobid, setjobid] = useState("664eca3ba7a498c7635bb0a9");
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBanner, setNewBanner] = useState("");
  const [fileName, setFileName] = useState("");

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setresume(file);
    } else {
      alert("Please upload a valid PDF file.");
      e.target.value = "";
    }
  };

  const handleExploreClick = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (
      fullName &&
      jobid &&
      number &&
      email &&
      address &&
      education &&
      experience &&
      resume
    ) {
      let link1 = resume;

      if (typeof resume !== "string") {
        try {
          const formData = new FormData();
          formData.append("file", resume); // Use addLogo here
          const { data } = await axios.post(FILE_UPLOAD, formData);
          if (data.success) {
            link1 = data.fileUrl;
          } else {
            toast.error(data.message || "File upload failed");
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
        const { data } = await axios.post(JOB_APPLICATION, {
          jobId: "664eca3ba7a498c7635bb0a9",
          fullName: fullName,

          contactNumber: number,
          email: email,

          address: address,

          education: education,
          experience: experience,

          resume: link1,
        });

        if (data.success) {
          setFullName("");

          setnumber("");
          setemail("");

          setaddress("");

          seteducation("");
          setexperience("");

          setresume("");

          setjobid(undefined);
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
    } else if (!jobid) {
      setLoading(false);
      return toast.error("Pls refresh the application");
    } else {
      setLoading(false);
      return toast.error("All Fields are required");
    }
  };

  const changeBanner = async () => {
    setLoading(true);
    if (newBanner) {
      let link1 = newBanner;

      // If editLogo is not a string, upload the new logo
      if (typeof newBanner !== "string") {
        try {
          const formData = new FormData();
          formData.append("image", newBanner); // Use addLogo here
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
          CHANGE_BANNER,
          {
            image: link1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setLogo(await GET_LOGO());
          setNewBanner(link1);
          setShowAddBanner(false);
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
    } else {
      setLoading(false);
      return toast.error("Image is required");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
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
      <div className="bg-white font-[Poppins] ">
        <Header />

        <PageBannerWithTitle backgroundImage={icons.career2} title="Career" />
        <PageMainTitle
          blackColorText={" Suvira ?"}
          greenColorText={"Why join"}
          margin="mt-8"
        />
        <div className=" w-full flex items-center justify-center flex-col">
          <p className=" w-[90%] text-xl text-center">
            As a committed oil and gas service provider, we are excited to
            expand our expertise into the renewable energy sector. Our
            dedication to innovation and sustainability propels us to seek
            cleaner, more efficient energy solutions. With a strong foundation
            in energy services, we are ready to contribute to a greener future
            by harnessing renewable resources to meet the increasing global
            energy demand.
          </p>
          <div className=" h-[1px] w-[90%] bg-black mt-8"></div>
        </div>

        <div className="mt-12 flex flex-col justify-center items-center relative">
          <PageMainTitle
            blackColorText={" Vacant Positions"}
            greenColorText={"Our"}
            margin=""
          />

          {userData && (
            <span className=" absolute right-[5%] top-0">
              <GiHamburgerMenu
                onClick={() => setJobPostingMenu(true)}
                className="cursor-pointer flex items-center justify-center text-2xl"
              />
            </span>
          )}
        </div>
        <div className="flex items-center flex-col justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:w-[90%] w-[98%]">
            {Openings &&
              Openings.map((e, index) => {
                return (
                  <CareerCard
                    handleExploreClick={handleExploreClick}
                    setjobid={setjobid}
                    jobId={e._id}
                    key={index}
                    Date={e.date}
                    City={e.location}
                    name={e.title}
                    Tag={e.role}
                    details={e.detail}
                  />
                );
              })}
          </div>
        
              <div className=" flex gap-6 my-10">
                <div className=" size-12 rounded-full bg-[#81BC06] grid place-items-center cursor-pointer">
                  <BiLeftArrowAlt fontSize={"24"} color="white" />
                </div>
                <div className=" size-12 rounded-full bg-[#05A6F0] grid place-items-center cursor-pointer">
                  <BiRightArrowAlt fontSize={"24"} color="white" />
                </div>
              </div>
   
        </div>
        <div className=" w-full grid place-items-center mb-10">
          <div className=" h-[1px] w-[90%] bg-black"></div>
        </div>
        <PageMainTitle borderBg={"bg-[#81BC06]"} blackColorText={"FAQ's"} />
        <div className=" w-full mb-10">
          <Accordion />
        </div>
        {/* <div className=" w-full relative bg-[#F8F8F8] md:h-[320px] h-[500px] flex justify-center overflow-hidden ">
          <div className=" xl:w-[80%] w-[95%]  relative z-20 flex md:flex-row flex-col ">
            <div
              className=" relative bg-no-repeat xl:w-[500px] lg:w-[400px] w-[300px] h-full bg-center z-20 bg-cover "
              style={{
                backgroundImage: `url(${icons.CarrersBanner})`,
              }}
            ></div>

            <div className=" w-full h-full flex items-start flex-col justify-center gap-6 lg:ml-7 md:ml-3 ml-0">
              <h3 className=" z-20 xltext-[40px] lg:text-3xl md:text-2xl text-xl ">Innovation Nexus</h3>
              <p className=" xl:text-2xl md:text-xl text-base">
                Explore Boundless Possibilities and Propel Your Professional
                Journey with Creative Solutions and Visionary Thinking.
              </p>
              <div className=" w-full flex items-end justify-end">
                <button className=" bg-[#81BC06] py-4 px-4 md:px-0  rounded-lg xl:text-xl text-base xl:w-72 lg:w-60 md:w-44 w-36 ">
                  REGISTRATION
                </button>
              </div>
            </div>
          </div>
          <div className="absolute gap-[65px] grid  left-[8rem] bottom-14 rotate-[-345deg] z-10">
            <div className="  bg-[#05A6F0] h-5 w-[520px]"></div>
            <div className="  bg-[#05A6F0] h-5 w-[520px]"></div>
          </div>

          <div className=" absolute bg-[#05A6F0] w-6 h-28 left-6 top-0"></div>
          <div className=" bg-[#81BC06] size-12 rounded-full absolute left-16 top-0"></div>
          <div className=" bg-[#81BC06] size-[300px] rounded-full absolute -right-12 -top-16"></div>
        </div> */}

        <div className=" w-full flex flex-col items-center justify-center mt-10 mb-10">
          <h3 className=" text-4xl font-medium text-center">
            Discover Your Path
          </h3>
          <form className=" w-[80%] flex flex-col gap-4 mt-7" onSubmit={handleSubmit}>
            <div className=" w-full flex gap-8 flex-col sm:flex-row">
              <div className=" flex flex-col gap-2 w-full ">
                <label className=" text-xl font-normal">Name </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className=" w-full  bg-[#05A6F01A] border-[#05A6F0] border outline-none h-10 pl-5 rounded-2xl"
                  placeholder="Enter name"
                />
              </div>
              <div className=" flex flex-col gap-2 w-full ">
                <label className=" text-xl font-normal">Email ID. </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="w-full  bg-[#05A6F01A] border-[#05A6F0] border outline-none h-10 pl-5 rounded-2xl"
                  placeholder="Enter Email ID."
                />
              </div>
            </div>
            <div className=" w-full flex gap-8 flex-col sm:flex-row">
              <div className=" flex flex-col gap-2 w-full ">
                <label className=" text-xl font-normal">Contact No </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setnumber(e.target.value)}
                  className=" w-full  bg-[#05A6F01A] border-[#05A6F0] border outline-none h-10 pl-5 rounded-2xl"
                  placeholder="Enter Contact No "
                />
              </div>
              <div className=" flex flex-col gap-2 w-full ">
                <label className=" text-xl font-normal">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  className="w-full  bg-[#05A6F01A] border-[#05A6F0] border outline-none h-10 pl-5 rounded-2xl"
                  placeholder="Enter Address"
                />
              </div>
            </div>
            <div className=" w-full flex gap-8 flex-col sm:flex-row">
              <div className=" flex flex-col gap-2 w-full ">
                <label className=" text-xl font-normal">Education </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => seteducation(e.target.value)}
                  className=" w-full  bg-[#05A6F01A] border-[#05A6F0] border outline-none h-10 pl-5 rounded-2xl"
                  placeholder="Enter Education"
                />
              </div>
              <div className=" flex flex-col gap-2 w-full ">
                <label className=" text-xl font-normal">Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setexperience(e.target.value)}
                  className="w-full  bg-[#05A6F01A] border-[#05A6F0] border outline-none h-10 pl-5 rounded-2xl"
                  placeholder="Enter Experience"
                />
              </div>
            </div>
            <div className="mb-4  p-2 border border-[#05A6F0] rounded-3xl bg-[#05A6F01A] focus:outline-none focus:ring-1 focus:ring-[#0c8ce9]">
              <label
                htmlFor="pdf"
                className="flex items-center justify-center gap-5 cursor-pointer h-full"
              >
                <LuUpload className="text-2xl text-[#10100f]" />
                Upload Resume
              </label>
              <input
                type="file"
                id="pdf"
                name="pdf"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden h-full"
              />
              {resume && (
                <div className="mt-2 text-sm text-gray-600">
                  Uploaded File: {resume.name}
                </div>
              )}
            </div>
            <div className=" w-full grid place-items-center mt-4">
            <ReadMoreBtn text={"Submit"} />
            </div>
          </form>
        </div>

        {/* <div
          ref={targetDivRef}
          className={`${
            jobid ? "bg-[#81BC06]" : ""
          } mt-10 p-5 flex  flex-col items-center justify-center`}
        >
          {jobid && (
            <>
              <div className="flex items-center justify-center text-4xl font-semibold gap-5 mb-10 w-full mt-10">
                <span className="text-[#10100f] flex items-center whitespace-nowrap">
                  Career Gateway:
                </span>
                <span className="whitespace-nowrap">
                  Your Path to Joining Our Exceptional Team
                </span>
              </div>
              <br />
              <div className="flex items-center justify-center w-full mb-10">
                <form
                  className="bg-white p-6 w-[1030px] flex flex-col items-center justify-between"
                  onSubmit={handleSubmit}
                >
                  <div className="flex items-start justify-between w-full">
                    <ImageWithLoader
                      src={icons.logo}
                      className="w-[300px]"
                      alt="Logo"
                    />
                    <h1 className="text-5xl font-bold mt-10">
                      Job Application Form
                      <div className="flex flex-col items-end justify-end mr-[-25px]">
                        <div className="w-[320px] h-[20px] bg-[#878787] mt-10"></div>
                        <div className="w-[275px] h-[20px] bg-[#878787] mt-5"></div>
                      </div>
                    </h1>
                  </div>
                  <div className="text-3xl text-[#10100f] w-full mt-[-2rem] mb-6 font-semibold">
                    Personal Info
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">First Name</label>
                      <input
                        type="text"
                        required={true}
                        value={firstName}
                        onChange={(e) => setfirstName(e.target.value)}
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Last Name</label>
                      <input
                        required={true}
                        value={latName}
                        onChange={(e) => setlatName(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Mobile No.</label>
                      <input
                        required={true}
                        value={number}
                        onChange={(e) => setnumber(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Email</label>
                      <input
                        required={true}
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        type="email"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">DOB</label>
                      <input
                        required={true}
                        value={dob}
                        onChange={(e) => setdob(e.target.value)}
                        type="date"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex items-start justify-center w-full flex-col">
                      <label className="text-xl">Gender</label>
                      <div className="flex items-center justify-center space-x-4">
                        <input
                          checked={gender === "Female"}
                          onChange={(e) => setgender(e.target.value)}
                          type="radio"
                          id="gender-female"
                          name="gender"
                          value="Female" // Set the value to represent Female
                          className="border rounded-xl w-[24px] h-[24px] cursor-pointer"
                        />
                        <label
                          htmlFor="gender-female"
                          className="text-[1.2rem]"
                        >
                          Female
                        </label>
                        <input
                          checked={gender === "Male"}
                          onChange={(e) => setgender(e.target.value)}
                          type="radio"
                          id="gender-male"
                          name="gender"
                          value="Male" // Set the value to represent Male
                          className="border rounded-xl w-[24px] h-[24px] cursor-pointer"
                        />
                        <label htmlFor="gender-male" className="text-[1.2rem]">
                          Male
                        </label>
                        <input
                          checked={gender === "Other"}
                          onChange={(e) => setgender(e.target.value)}
                          type="radio"
                          id="gender-other"
                          name="gender"
                          value="Other" // Set the value to represent Other
                          className="border rounded-xl w-[24px] h-[24px] cursor-pointer"
                        />
                        <label htmlFor="gender-other" className="text-[1.2rem]">
                          Other
                        </label>
                      </div>
                    </div>

                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Address</label>
                      <input
                        required={true}
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Zip Code</label>
                      <input
                        required={true}
                        value={zipCode}
                        onChange={(e) => setzipCode(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                  </div>
                  <div className="text-2xl text-[#10100f] w-full mt-8 mb-6 font-bold">
                    Other Info
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Education</label>
                      <input
                        required={true}
                        value={education}
                        onChange={(e) => seteducation(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Experience</label>
                      <input
                        required={true}
                        value={experience}
                        onChange={(e) => setexperience(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Choose Field</label>
                      <select
                        value={field}
                        onChange={(e) => setfield(e.target.value)}
                        className="p-2 border rounded-xl w-full"
                      >
                        <option value="Chemical Engineer">
                          Chemical Engineer
                        </option>
                        <option value="Computer Engineer">
                          Computer Engineer
                        </option>
                        <option value="Physical Engineer">
                          Physical Engineer
                        </option>
                      </select>
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Choose Role</label>
                      <select
                        value={role}
                        onChange={(e) => setrole(e.target.value)}
                        className="p-2 border rounded-xl w-full"
                      >
                        <option value="Junior Engineer">Junior Engineer</option>
                        <option value="Mid-level Engineer">
                          Mid-level Engineer
                        </option>
                        <option value="Higher Engineer">Higher Engineer</option>
                      </select>
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Current CTC</label>
                      <input
                        required={true}
                        value={currentCtc}
                        onChange={(e) => setcurrentCtc(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    <div className="gap-3 flex flex-col">
                      <label className="text-xl ml-2">Expected CTC</label>
                      <input
                        required={true}
                        value={expectedCtc}
                        onChange={(e) => setexpectedCtc(e.target.value)}
                        type="text"
                        className="p-2 border rounded-xl w-full"
                      />
                    </div>
                    {resume && (
                      <div className="gap-3 flex flex-col">
                        <label className="text-xl ml-2">Selected File</label>
                        <input
                          value={resume?.name}
                          type="text"
                          readOnly={true}
                          className="p-2 border-none outline-none rounded-xl w-full"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center w-full justify-center mt-10">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <ImageWithLoader
                        src={icons.uploadResume}
                        alt="Upload Resume"
                      />
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.type === "application/pdf") {
                          setresume(file);
                        } else {
                          toast.error("Please select a PDF file.");
                        }
                      }}
                    />
                  </div>
                  <br />
                  <div className="flex items-center w-full justify-center mt-5 mb-5">
                    <button className="py-3 w-[50%] text-white cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06]">
                      Apply Now
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div> */}

        <Footer />
      </div>
      {jobPostingMenu && (
        <JobPostingMenu
          feedbacks={Openings}
          setShowFeedbackCardMenu={setJobPostingMenu}
        />
      )}
      {showAddBanner && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#F8F8F8] p-4 w-[1100px] h-[70vh] border-2 border-[#81BC06] rounded-lg overflow-y-auto">
            <div className="flex items-end justify-end w-full mb-5">
              <IoIosCloseCircle
                onClick={() => setShowAddBanner(false)}
                className="cursor-pointer text-3xl text-gray-300"
              />
            </div>
            <div className="overflow-scrolloverflow-y-auto flex flex-col items-center justify-center">
              <label className="block mb-5 font-bold text-2xl mt-[-2rem]">
                Change Banner
              </label>
              <div
                className={`w-[1030px] h-[630px] rounded-t-lg flex items-center justify-evenly bg-cover relative ${
                  !newBanner && "bg-[#D9D9D9]"
                }`}
                style={
                  newBanner
                    ? {
                        backgroundImage: `url(${
                          typeof newBanner !== "string"
                            ? URL.createObjectURL(newBanner)
                            : newBanner
                        })`,
                      }
                    : {}
                }
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setNewBanner(e.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="flex bg-gray-900 p-2 items-center cursor-pointer"
                >
                  <LuUpload className="text-2xl text-white" />
                  <span className="text-white  text-2xl font-bold ml-2">
                    Change Banner
                  </span>
                </label>
              </div>
            </div>
            <div className="flex items-center w-full justify-evenly mt-10 mb-5">
              <button
                className="py-3 w-[50%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={changeBanner}
              >
                Update Banner
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => setShowAddBanner(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
};

export default Career;
