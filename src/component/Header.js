import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import icons from "../assets";
import { useRecoilState, useRecoilValue } from "recoil";
import { GiHamburgerMenu } from "react-icons/gi";
import { Animated, Logo, Sectors, userInfo } from "../Recoil";
import {
  IoPersonCircle,
  IoSettingsOutline,
  IoLogInOutline,
} from "react-icons/io5";
import ShowDesignMenu from "./ShowDesignMenu";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import ShowWebsitemenu from "./ShowWebsitemenu";
import { MdCancel } from "react-icons/md";

const Header = () => {
  const offeringsMenuRef = useRef(null);
  const offeringsMenuMobRef = useRef(null);
  const profileMenuRef = useRef(null);
    const sectors = useRecoilValue(Sectors);

  const [animated, setAnimated] = useRecoilState(Animated);
  const [userData, setUserData] = useRecoilState(userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState(null);
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOfferingsMenu, setShowOfferingsMenu] = useState(false);
  const [showOfferingsMenuMob, setshowOfferingsMenuMob] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobilUserData, setShowMobileUserData] = useState(false);

  useEffect(() => {
    const currentURL = window.location.href;
    const lastSegment = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    setUrl(lastSegment);
  }, []);

  useEffect(() => {
    if (!animated) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [animated]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        offeringsMenuRef.current &&
        !offeringsMenuRef.current.contains(event.target)
      ) {
        setShowOfferingsMenu(false);
        setShowMobileNav(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const navlists = [
    {
      id: 1,
      title: "Home",
      href: "/home",
    },
    {
      id: 2,
      title: "About us",
      href: "/aboutus",
    },
    {
      id: 3,
      title: "Offering",
      href: "/offerings/oilandgas",
    },
    {
      id: 4,
      title: "Career",
      href: "/career",
    },
    {
      id: 5,
      title: "Blogs",
      href: "/blogs",
    },
    {
      id: 6,
      title: "News",
      href: "/news",
    },
    {
      id: 7,
      title: "Contact us",
      href: "/contact",
    },
  ];

  return (
    <>
      <div className="hidden md:flex z-50 justify-between px-1 py-4 md:py-0 md:px-4 lg:px-8 cursor-pointer  w-full bg-white sticky top-0 left-0 font-[Poppins]">
        <img
          src={icons.logo}
          onClick={() => navigate("/")}
          className="lg:w-52 xl:w-56 cursor-pointer lg:h-[114px] md:object-contain object-cover h-[60px] w-26"
          alt="Logo"
        />
        <div className="flex  text-white relative">
          <ul
            className={`flex xl:gap-16 lg:gap-4 md:gap-4 text-black nav-ul font-semibold items-center justify-center w-full`}
          >
            {["Home", "About us", "Offerings", "Career", "Blogs", "News"].map(
              (item, index) => {
                const formattedPath =
                  item === "Offerings"
                    ? `/offerings/oilandgas`
                    : `/${item.toLowerCase().replace(" ", "")}`;

                const isActive = location.pathname === formattedPath;

                return (
                  <li
                    key={item}
                    onClick={() => navigate(formattedPath)}
                    className={`${
                      isActive ? "active" : ""
                    } flex font-medium items-center text-sm lg:text-base`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {item}
                    {item === "Offerings" && (
                      <img
                        src={icons.playIcon}
                        alt="arrow down"
                        className="ml-1 size-3 lg:size-5"
                        onMouseEnter={() =>
                          item === "Offerings" && setShowOfferingsMenu(true)
                        }
                      />
                    )}
                  </li>
                );
              }
            )}
            <button
              onClick={() => navigate("/contact")}
              className=" bg-[#81BC06] text-white hover:text-black rounded-lg items-center py-3 px-3 text-sm md:text-base  lg:py-3 lg:px-5 h-[39px] cursor-pointer font-normal flex justify-center hover:no-underline no-underline hover:bg-[#D0F729] shadow-btn "
            >
              Contact Us
            </button>

            {userData && (
              <li
                ref={profileMenuRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu((prev) => !prev);
                }}
                className="cursor-pointer text-center gap-2 flex flex-col no-underline relative"
                style={{ textDecoration: "none" }}
              >
                <span
                  className="flex items-center  max-w-[100px] justify-center gap-2"
                  onMouseEnter={() => setShowMenu(true)}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setShowMenu(false);
                    }
                  }}
                >
                  <IoPersonCircle className="text-xl lg:text-3xl bg-[p-6] text-[#85a38d]" />
                  <li className="text-[#353535] text-sm lg:text-[1.2rem]">
                    {userData?.name}
                  </li>
                </span>
                {showMenu && (
                  <span
                    className="p-2 bg-white absolute w-[265px] h-[250px] rounded-2xl text-black right-[0vw] top-[0rem]"
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setShowMenu(false);
                      }
                    }}
                  >
                    <span className="flex items-center w-full border-b-2 justify-start px-10 gap-2">
                      <IoPersonCircle className="w-[55px] h-[55px] bg-[p-6] text-[#85a38d]" />
                      <li className="text-[#10100f] text-[1.2rem]">
                        {userData?.name}
                      </li>
                    </span>
                    <div className="flex flex-col items-center justify-center gap-5">
                      <li
                        className="text-[#10100f] mt-10 w-[200px] flex items-start justify-start gap-5 text-[18px] font-normal"
                        onClick={() => setShowProfile(true)}
                      >
                        <CgProfile className="text-3xl bg-[p-6] text-black" />
                        Profile
                      </li>
                      <li
                        className="text-[#10100f] w-[200px] flex items-start justify-start gap-5 text-[18px] font-normal"
                        onClick={() => setShowDesignMenu(true)}
                      >
                        <IoSettingsOutline className="text-3xl bg-[p-6] text-black" />
                        Setting
                      </li>
                      <li
                        className="text-[#10100f] w-[200px] flex items-start justify-start gap-5 text-[18px] font-normal"
                        onClick={() => {
                          localStorage.removeItem("token");
                          setUserData(undefined);
                          toast.success("Logout Successfully");
                        }}
                      >
                        <IoLogInOutline className="text-3xl bg-[p-6] text-black" />
                        Sign Out
                      </li>
                    </div>
                  </span>
                )}
              </li>
            )}
          </ul>
          {showOfferingsMenu && (
            <div
              className="offerings-menu bg-[#10100FA6] flex flex-col items-start gap-2 absolute left-[28%] top-[70%] py-3 px-4"
              ref={offeringsMenuRef}
            >
               {sectors.map((items,i)=>(
              <div className="slide-hover-left-1 flex gap-2 pr-3 items-center justify-center">
                <div className="w-[4px] h-[16px] bg-[#81BC06]"></div>
                <>
               
                  <p href="/offerings/oilandgas" className=" flex gap-2" key={i}  onClick={() => navigate(`/offerings/${items.name}/`)}>
                 {items.name}
                </p>
               
               </>
              </div>
               ))}
              
            </div>
          )}
        </div>
      </div>
      {showDesignMenu && (
        <ShowDesignMenu setShowServiceMenu={setShowDesignMenu} />
      )}
      {showProfile && <ShowWebsitemenu setShowServiceMenu={setShowProfile} />}

      <div className=" flex md:hidden items-center z-50 justify-between px-1 py-4 cursor-pointer  w-full bg-white sticky top-0 left-0 font-[Poppins]">
        <img
          src={icons.logo}
          onClick={() => navigate("/")}
          className="md:w-60 cursor-pointer md:h-[114px] md:object-contain object-cover h-[50px] w-24"
          alt="Logo"
        />
        <div className=" flex items-center justify-center gap-4 mr-3 relative">
          {userData && (
            <div className=" " onClick={() =>setShowMobileUserData(!showMobilUserData)}>
              <img
                src={icons.navbaravatar}
                alt="navbarAvatar"
                className=" object-cover size-8"
              />
            </div>
          )}
          {!showMobileNav ? (
            <div
              className=" bg-[#05a6f07d] rounded-md p-[4px] "
              onClick={() => setShowMobileNav(true)}
            >
              <GiHamburgerMenu color="#05A6F0" className="size-6" />
            </div>
          ) : (
            <div
              className=" bg-[#05a6f07d] rounded-md p-[4px]"
              onClick={() => setShowMobileNav(false)}
            >
              <MdCancel color="#05A6F0" className="size-6" />
            </div>
          )}
          <div
            className={`flex flex-col gap-3 absolute bg-[#10100F] px-3 py-6 bottom-[-21rem] right-2 transition-opacity duration-300 ease-linear ${
              showMobileNav
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {navlists.map((items, i) => (
              <div
                className="flex items-center gap-2 cardHoverTitleNav"
                key={items.id}
              >
                <div className="w-1 bg-[#05A6F0] h-4 bluebox"></div>
                <h3
                  className="text-white text-lg navTitle"
                  onClick={() =>
                    items.title === "Offering"
                      ? setshowOfferingsMenuMob(true)
                      : navigate(`${items.href}`)
                  }
                >
                  {items.title}
                </h3>
              </div>
            ))}
            {showOfferingsMenuMob && (
              <div
                className="offerings-menu text-white bg-[#10100FA6] flex flex-col items-start gap-2 absolute left-[0%] top-[40%] py-3 px-4"
                ref={offeringsMenuMobRef}
              >
                 {sectors.map((items,i)=>(
              <div className="slide-hover-left-1 flex gap-2 pr-3 items-center justify-center">
                <div className="w-[4px] h-[16px] bg-[#81BC06]"></div>
                <>
               
                  <p  className=" flex gap-2" key={i}  onClick={() => navigate(`/offerings/${items.name}/`)}>
                 {items.name}
                </p>
               
               </>
              </div>
               ))}
              </div>
            )}

            
          </div>
          {showMobilUserData && (
              <div className=" absolute top-[51px] right-3 flex flex-col items-center justify-center gap-5 border border-gray-300 pl-2 pb-2 rounded-lg bg-white">
                <li
                  className="text-[#10100f] mt-10 w-[200px] flex items-start justify-start gap-5 text-[18px] font-normal"
                  onClick={() => setShowProfile(true)}
                >
                  <CgProfile className="text-3xl bg-[p-6] text-black" />
                  Profile
                </li>
                <li
                  className="text-[#10100f] w-[200px] flex items-start justify-start gap-5 text-[18px] font-normal"
                  onClick={() => setShowDesignMenu(true)}
                >
                  <IoSettingsOutline className="text-3xl bg-[p-6] text-black" />
                  Setting
                </li>
                <li
                  className="text-[#10100f] w-[200px] flex items-start justify-start gap-5 text-[18px] font-normal"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUserData(undefined);
                    toast.success("Logout Successfully");
                    setShowMobileUserData(false)
                  }}
                >
                  <IoLogInOutline className="text-3xl bg-[p-6] text-black" />
                  Sign Out
                </li>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Header;
