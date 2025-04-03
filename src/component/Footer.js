import icons from "../assets";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { BsTwitter } from "react-icons/bs"; // Changed from BsTwitterX to BsTwitter
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaCopyright } from "react-icons/fa6";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  clientClicked,
  Logo,
  serviceClicked,
  testimonalClicked,
} from "../Recoil";

const Footer = () => {
  const logo = useRecoilValue(Logo);
  const setClientClick = useSetRecoilState(clientClicked);
  const setServiceClick = useSetRecoilState(serviceClicked);
  const setTestimonialClick = useSetRecoilState(testimonalClicked);
  return (
   
    <div className="flex flex-col items-center justify-center bg-[#F8F8F8] pt-5 px-2 lg:px-0">
      <div className="w-full flex items-center justify-center flex-col md:flex-row">
        <div className="flex w-[95%] md:w-[40%] flex-col mb-6 md:mb-0 gap-3">
         
          <img src={icons.logo} className=" w-[150px] h-[90px] md:w-[200px] md:h-[115px] object-cover" alt="suvira logo" />
          <div className=" w-[90%] md:w-[70%] text-[1.2rem]">
            <span className="text-base md:text-lg font-semibold">
              B-201, Suvira Energy, Satellite Gazebo, B. D. Sawant Marg, Andheri
              East, Mumbai, Maharashtra 400099
            </span>
            <span className="flex items-center justify-between mt-5 w-52">
              <a
                href="mailto:info@suvira.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMdMail className="text-2xl hover:text-gray-500 cursor-pointer" />
              </a>
              <a
                href="tel:918655462358"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaPhoneAlt className="text-2xl hover:text-gray-500 cursor-pointer" />
              </a>
              <a
                href="https://www.instagram.com/suviraenergy?igsh=MWg2dTVnMzhqZXdrZw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiInstagramFill className="text-2xl hover:text-gray-500 cursor-pointer" />
              </a>
              <a
                href="https://www.facebook.com/SuviraEnergy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="text-2xl hover:text-gray-500 cursor-pointer" />
              </a>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 place-items-start ml-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full sm:w-full md:w-[50%] items-start lg:place-items-start ">
          <div className=" w-[50vw] md:w-[30vw] lg:w-auto">
            <h3 className="font-bold md:text-2xl mb-5 text-xl">Why Suvira</h3>
            <Link to={"/aboutus"}>
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                About Us
              </p>
            </Link>
            <Link to={"/career"}>
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                Career
              </p>
            </Link>
            <Link to={"/blogs"}>
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                Blogs
              </p>
            </Link>
            <Link
              to={"/home"}
              onClick={() => {
                setTimeout(() => {
                  setTestimonialClick(true);
                }, 100);
              }}
            >
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                Testimonial
              </p>
            </Link>
          </div>
          <div className=" w-[30vw] md:w-auto">
            <h3 className="font-bold md:text-2xl mb-5 text-xl">Business</h3>
            <Link to={"/products"}>
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                Offerings
              </p>
            </Link>
            <Link to={"/news"}>
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                News
              </p>
            </Link>
            <Link
              to={"/home"}
              onClick={() => {
                setTimeout(() => {
                  setServiceClick(true);
                }, 100);
              }}
            >
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                Services
              </p>
            </Link>
            <Link
              to={"/home"}
              onClick={() => {
                setTimeout(() => {
                  setClientClick(true);
                }, 100);
              }}
            >
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500">
                Clients
              </p>
            </Link>
          </div>
          <div className=" w-[30vw] md:w-auto">
            <h3 className="font-bold md:text-2xl mb-5 text-xl">Help & Support</h3>
            <Link to={"/contact"}>
              <p className="text-[1rem] md:text-[1.2rem] cursor-pointer hover:text-gray-500 ">
                Contact Us
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-sm mt-10 font-normal flex items-center justify-center gap-3 md:gap-5 mb-4">
        <FaCopyright className="size-5 md:size-6" />
        <span className="text-center text-[0.8rem] md:text-[1.2rem]">
          copyrights received by Suvira Energy
        </span>
      </div>
    </div>
    
  );
};

export default Footer;
