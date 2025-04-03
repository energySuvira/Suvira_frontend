import Header from "../component/Header";
import Footer from "../component/Footer";
import image84 from "../assets/image/image84.png";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoMdMail } from "react-icons/io";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { BsTwitterX } from "react-icons/bs";
import { toast } from "react-toastify";
import { CONTACT } from "../Api";
import Loading from "../component/Loading";
import icons from "../assets";
import PageBannerWithTitle from "../component/PageBannerWithTitle";
import PageMainTitle from "../component/PageMainTitle";
import { RiMapPinLine } from "react-icons/ri";
import { LuMail, LuPhone } from "react-icons/lu";

const Contact = () => {
  const [userName, setUserName] = useState(null);
  const [mail, setMail] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [number, setNumber] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (userName && mail && companyName && number && message) {
      try {
        const { data } = await axios.post(CONTACT, {
          name: userName,
          businessMail: mail,
          companyName,
          contactNumber: number,
          message,
        });
        if (data.success) {
          setUserName("");
          setMail("");
          setCompanyName("");
          setNumber("");
          setMessage("");
          toast.success(data.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error(
          error?.response?.data?.message ||
            error?.data?.message ||
            error.message
        );
      }
    } else {
      setLoading(false);
      toast.error("All Fields are required..");
    }
    setLoading(false);
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
      <Header />
      <PageBannerWithTitle
        backgroundImage={icons.contactUs}
        title="Contact Us"
        ref={targetTopRef}
      />

      <div className=" mt-10 flex items-center justify-center flex-col font-[Poppins]">
        <PageMainTitle greenColorText={"Get in"} blackColorText={"Touch"} />
        <div className=" w-full text-center flex flex-col items-center justify-center">
          <p
            style={{
              fontFamily: "poppins",
            }}
            className="text-[#10100f] text-center font-normal text-[20px] leading-8 lg:w-[80%] w-[95%]"
          >
            As a committed oil and gas service provider, we are excited to
            expand our expertise into the renewable energy sector. Our
            dedication to innovation and sustainability propels us to seek
            cleaner, more efficient energy solutions. With a strong foundation
            in energy services, we are ready to contribute to a greener future
            by harnessing renewable resources to meet the increasing global
            energy demand.
          </p>
          <div className=" mt-10 h-[1px] w-[80%] bg-black"></div>
        </div>

        <div className=" mt-10 w-full flex flex-col lg:flex-row xl:gap-20 lg:gap-10 gap-10 items-center justify-center md:justify-start md:items-start">
          <div className=" w-[100%] md:w-[100%] xl:w-[40%]">
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1112.4686338403114!2d72.86961363814285!3d19.103816372722886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c85af128c1fb%3A0xcfb866fdb7756aa4!2z4KS44KWB4KS14KWA4KSw4KS-IOCkj-CkqOCksOCljeCknOClgA!5e0!3m2!1smr!2sin!4v1733854027328!5m2!1smr!2sin"
              height="650"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              className=" w-full"
            ></iframe>
          </div>
          <div className=" flex xl:w-[50%] lg:w-[70%] w-[90%] px-8 lg:px-0  flex-col items-start justify-start gap-8">
            <div className=" text-left">
              <div className=" flex gap-4 items-center  text-2xl mb-3">
                <RiMapPinLine size={20} />
                Corporate Office :
              </div>
              <p className=" text-lg text-black">
                B-201, Suvira Energy, Satellite Gazebo, B. D. Sawant Marg,
                Andheri East, Mumbai, Maharashtra 400099
              </p>
            </div>
            <div className=" text-left">
              <div className=" flex gap-4 items-center  text-2xl mb-3">
                <RiMapPinLine size={20} />
               Lab :
              </div>
              <p className=" text-lg text-black capitalize">
             B 1 2 3 GROUND FLOOR HANUMANTA APPARTMENT SRA CHS LTD M C CHHAGLA MARG CHAKALA ANDHERI Maharashtra
              </p>
            </div>

            <div className=" text-left">
              <div className=" flex gap-4 items-center  text-2xl mb-3">
                <RiMapPinLine size={20} />
                Production and Warehouse address:
              </div>
              <p className=" text-lg text-black">
              Bommasandra Industrial Area, Bommasandra, Bengaluru, Karnataka
              </p>
            </div>
            <div className=" text-left">
              <div className=" flex gap-4 items-center  text-2xl mb-3">
                <LuMail size={20} />
                For general questions:
              </div>
              <a href="mailto:info@suvira.com" className=" text-lg text-black">
                info@suvira.com
              </a>
            </div>
            <div className="flex flex-col md:flex-row gap-10 text-left">
              <div>
                <div className=" flex gap-4 items-center  text-2xl mb-3">
                  <LuMail size={20} />
                  For sales queries, write to :
                </div>
                <a
                  href="mailto:sales@suvira.com"
                  className=" text-lg text-black"
                >
                  sales@suvira.com
                </a>
              </div>
            </div>
            <div className=" text-left">
              <div className=" flex gap-4 items-center  text-2xl mb-3">
                <LuMail size={20} />
                Join team, write to :
              </div>
              <a href="mailto:hr@suvira.com" className=" text-lg text-black">
                hr@suvira.com
              </a>
            </div>

            <div className=" text-left">
              <div className=" flex gap-4 items-center  text-2xl mb-3">
                <LuPhone size={20} />
                Customer Care :
              </div>
              <a href="tel:+918655462358" className=" text-lg text-black">
                +91 8655462358
              </a>
            </div>
          </div>
        </div>
        <div className=" mt-10 h-[1px] w-[80%] bg-black"></div>

        <div className="flex w-full items-start justify-center">
          <div className="xl:w-[1035px] lg:w-[80%] md:w-[90%] w-[80%] gap-5 flex items-start justify-start mb-10">
            <div className=" w-full mt-10">
              <h2 className=" text-4xl font-medium text-center mb-10">
                Enquiry form
              </h2>
              <div className=" flex flex-col sm:flex-row gap-8 w-full">
                <div className=" w-full">
                  <label className="">Name</label>
                  <input
                    type="text"
                    className="block w-full border mt-2 bg-[#05A6F01A] outline-none border-[#05A6F0] rounded-2xl py-2 px-4"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className=" w-full">
                  <label className="">Business Mail</label>
                  <input
                    type="email"
                    className="block w-full border mt-2 bg-[#05A6F01A] outline-none border-[#05A6F0] rounded-2xl py-2 px-4"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>
              </div>
              <div className=" flex flex-col sm:flex-row gap-8 w-full mt-4">
                <div className=" w-full">
                  <label className="">Company Name</label>
                  <input
                    type="text"
                    className="block w-full border mt-2 bg-[#05A6F01A] outline-none border-[#05A6F0] rounded-2xl py-2 px-4"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className=" w-full">
                  <label className="">Contact No.</label>
                  <input
                    type="text"
                    className="block w-full border mt-2 bg-[#05A6F01A] outline-none border-[#05A6F0] rounded-2xl py-2 px-4"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>
              <label className="block mt-4">How can we help?</label>
              <textarea
                className="block w-full border mt-2 bg-[#05A6F01A] outline-none border-[#05A6F0] rounded-2xl py-2 px-4"
                style={{ height: "100px" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="flex items-center w-full justify-center mt-5 mb-5">
                <button
                  onClick={handleSubmit}
                  className="py-3 w-[60%] duration-500 ease-in-out hover:text-white border-2 border-[#05A6F0] text-[#05A6F0] cursor-pointer hover:bg-[#05A6F0] rounded-lg bg-[#05A6F01A] font-normal text-[1.2rem]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {loading && <Loading />}
    </>
  );
};

export default Contact;
