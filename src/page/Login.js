import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/image/image69.png";
import group58 from "../assets/image/Group58.png";
import { FaRegUser, FaEyeSlash, FaEye } from "react-icons/fa6";
import { MdMailOutline, MdOutlineLock } from "react-icons/md";
import { toast } from "react-toastify";
import {
  CHECK_USER,
  Forget_Password,
  LOGIN,
  LOGIN_WITH_GOOGLE,
  REGISTER,
  SEND_OTP,
} from "../Api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Logo, userInfo } from "../Recoil";
import Loading from "../component/Loading";
import icons from "../assets";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../FireBaseConfig";

const Login = () => {
  const logo = useRecoilValue(Logo);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetEmail, setForgetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [conditions, setConditions] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const setUser = useSetRecoilState(userInfo);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [showField, setShowField] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setForgetEmail(email);

    // Simple email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(email));
  };

  const handlePasswordChange = (e, setVal) => {
    const password = e.target.value;
    setVal(password);

    // Define the password pattern
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const digit = /\d/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    // Check if password meets all criteria
    const isValid =
      minLength.test(password) &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      digit.test(password) &&
      specialChar.test(password);

    setIsPasswordValid(isValid);

    // Set error message if password is invalid
    let errorMessage = "";
    if (!minLength.test(password)) {
      errorMessage = "Password must be at least 8 characters long.";
    } else if (!uppercase.test(password)) {
      errorMessage = "Password must contain at least one uppercase letter.";
    } else if (!lowercase.test(password)) {
      errorMessage = "Password must contain at least one lowercase letter.";
    } else if (!digit.test(password)) {
      errorMessage = "Password must contain at least one digit.";
    } else if (!specialChar.test(password)) {
      errorMessage = "Password must contain at least one special character.";
    }

    setPasswordError(errorMessage);
  };

  const loginAdmin = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!conditions) {
      setLoading(false);
      return toast.error("Please accept the terms and conditions");
    }
    try {
      const { data } = await axios.post(LOGIN, { email, password });
      if (data.success) {
        setLoading(false);
        localStorage.setItem("token", data.token);
        setUser(data.userInfo);
        toast.success(data.message);
        navigate("/");
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  const RegisterAdmin = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!conditions) {
      setLoading(false);
      return toast.error("Please accept the terms and conditions");
    }
    if (password !== confirmPassword) {
      setLoading(false);
      return toast.error("Password does not match");
    }
    if (!isPasswordValid) {
      setLoading(false);
      return toast.error("Pls Enter Valid Passwords");
    }
    try {
      const { data } = await axios.post(REGISTER, { name, email, password });
      if (data.success) {
        setLoading(false);

        toast.success(data.message);
        navigate("/");
      } else {
        setLoading(false);

        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
    }
  };

  const sendOtp = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (!forgetEmail) {
      setLoading(false);
      return toast.error("Email is required");
    }
    if (!isEmailValid) {
      setLoading(false);
      return toast.error("Pls Enter Valid Email");
    }
    try {
      const { data } = await axios.post(SEND_OTP, { email: forgetEmail });
      if (data.success) {
        setLoading(false);
        setShowEmailField(false);
        setShowField(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (newpassword !== newConfirmPassword) {
      setLoading(false);
      return toast.error("Both Password do not Match");
    }
    if (!otp || !newpassword || !newConfirmPassword) {
      setLoading(false);
      return toast.error("All Fields are required");
    }
    try {
      const { data } = await axios.post(Forget_Password, {
        email: forgetEmail,
        otp,
        password: newpassword,
      });
      if (data.success) {
        setLoading(false);
        setShowField(false);
        setOtp("");
        setNewPassword("");
        setNewConfirmPassword("");
        setForgetEmail("");
        toast.success(data.message);
      } else {
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
    }
  };

  const LoginWithGoogle = async (e) => {
    setLoading(true); // Start loading before the try block
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result?.user?.email) {
        const checkUserResponse = await axios.post(CHECK_USER, {
          email: result.user.email,
        });
        if (checkUserResponse.data.success) {
          const token = result.user.stsTokenManager.accessToken;
          const loginResponse = await axios.post(
            LOGIN_WITH_GOOGLE,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (loginResponse.data.success) {
            setLoading(false);
            localStorage.setItem("token", loginResponse.data.token);
            setUser(loginResponse.data.userInfo);
            toast.success(loginResponse.data.message);
            navigate("/");
            return;
          }
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <>
      <div
        className="flex relative flex-col items-center min-h-screen bg-contain bg-no-repeat   justify-center"
        style={{
          backgroundSize: "100% 100%",
          backgroundImage: `url(${icons.blogs})`,
        }}
      >
        <div className="absolute top-0 left-1">
          <img
            src={icons.logo}
            onClick={() => navigate("/")}
            className="lg:w-[150px] w-[80px] cursor-pointer"
            alt="Logo"
          />
        </div>
        <div
          className="flex  items-center md:items-start 
        justify-center bg-opacity-90 rounded-lg shadow-lg flex-col md:flex-row"
        >
          {step === 1 && (
            <>
              <div className="md:p-6 p-2 bg-white xl:w-[542px] lg:w-[450px] md:w-[45%] w-[95%] md:h-[500px] h-auto rounded-t-lg md:rounded-l-lg md:rounded-r-none shadow-lg flex flex-col justify-between">
                <h2 className="md:text-4xl text-2xl mb-2 md:mb-0 font-semibold mt-2 md:mt-0  text-center">
                  Registration
                </h2>
                <form onSubmit={RegisterAdmin}>
                  <div className="md:space-y-4 space-y-2">
                    <div className="flex p-[6px] md:p-2 gap-5 border border-gray-300 rounded-lg  focus:border-green-500 items-center justify-center">
                      <FaRegUser className="text-2xl" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full focus:outline-none"
                        type="text"
                        name="name"
                        required
                        placeholder="Enter Your Name"
                      />
                    </div>
                    <div className="flex p-[6px] md:p-2 gap-5 border border-gray-300 rounded-lg  focus:border-green-500 items-center justify-center">
                      <MdMailOutline className="text-2xl" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full focus:outline-none"
                        type="email"
                        name="name"
                        required
                        placeholder="Enter Your Email"
                      />
                    </div>
                    <div className="flex p-[6px] md:p-2 gap-5 border border-gray-300 rounded-lg  focus:border-green-500 items-center justify-center">
                      <MdOutlineLock className="text-2xl" />
                      <input
                        value={password}
                        onChange={(e) => handlePasswordChange(e, setPassword)}
                        className="w-full focus:outline-none"
                        type={showPassword ? "text" : "password"}
                        name="name"
                        required
                        placeholder="Create a Password"
                      />
                      {showPassword ? (
                        <FaEye
                          className=" cursor-pointer text-2xl"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <FaEyeSlash
                          className=" cursor-pointer text-2xl"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {!isPasswordValid && (
                      <span className="text-[#F35325]">{passwordError}</span>
                    )}
                    <div className="flex p-[6px] md:p-2 gap-5 border border-gray-300 rounded-lg  focus:border-green-500 items-center justify-center">
                      <MdOutlineLock className="text-2xl" />
                      <input
                        value={confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(e, setConfirmPassword)
                        }
                        className="w-full focus:outline-none"
                        type={showConfirmPassword ? "text" : "password"}
                        name="name"
                        required
                        placeholder="Confirm Password"
                      />
                      {showConfirmPassword ? (
                        <FaEye
                          className=" cursor-pointer text-2xl"
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <FaEyeSlash
                          className=" cursor-pointer text-2xl"
                          onClick={() => setShowConfirmPassword(true)}
                        />
                      )}
                    </div>
                    {!isPasswordValid && (
                      <span className="text-[#F35325]">{passwordError}</span>
                    )}
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mr-2 cursor-pointer"
                        checked={conditions}
                        onChange={(e) => setConditions(e.target.checked)}
                      />
                      <label htmlFor="terms" className="text-gray-600">
                        I accept all{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                          terms & conditions
                        </span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full bg-[#81BC06] text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    REGISTRATION
                  </button>
                </form>
              </div>
              <div className="md:p-6 p-2 xl:w-[350px] md:w-[45%] w-[95%] md:h-[500px] h-auto bg-[#81BC06] rounded-b-lg md:rounded-l-none md:rounded-r-lg  shadow-lg text-center flex flex-col justify-between">
                <h2 className="md:text-2xl text-xl  font-semibold md:mb-4 mb-2  mt-2 md:mt-0">
                  Secure Access to a Sustainable Future
                </h2>
                <p className="md:mb-4 mb-2 text-[#10100f] text-sm md:text-base md:text-left text-justify">
                  Join us at Energy Innovations as we lead the charge in the
                  energy sector. Our expertise spans from the depths of oil
                  wells to the heights of wind turbines.
                </p>
                <p className="md:mb-4 mb-2 text-[#10100f] text-sm md:text-base md:text-left text-justify">
                  Member Login Your gateway to a greener tomorrow. Sign in to
                  explore your projects, monitor progress, and collaborate with
                  our team of experts.
                </p>
                <button
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                    setStep(2);
                  }}
                  className="w-full bg-white text-black mt-5 py-2 px-4 rounded-lg hover:bg-gray-100"
                >
                  LOG IN
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="md:p-6 p-2 bg-white xl:w-[542px] lg:w-[450px] md:w-[45%] w-[95%] md:h-[500px] h-auto rounded-t-lg md:rounded-l-lg md:rounded-r-none shadow-lg flex flex-col justify-between">
              <h2 className=" text-center md:text-4xl text-2xl mb-2 md:mb-0 font-semibold">Log In</h2>
              {/* <div className=" w-full flex items-center justify-center">

<button className="googlelogin w-[90%] flex items-center justify-evenly">
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
</svg>
  Continue with Google
</button>
</div> */}
              <img
                onClick={LoginWithGoogle}
                src={group58}
                className="mx-auto cursor-pointer size-12 mb-2"
                alt=""
              />

              {/* <div className=" w-full flex justify-center items-center gap-1 text-gray-600">
            <div className=" h-[1px] w-full bg-slate-500"></div>
            OR
            <div className=" h-[1px] w-full bg-slate-500"></div>
           </div> */}

              <form onSubmit={loginAdmin}>
                <div className="space-y-4">
                  <div className="flex p-[6px] md:p-2 gap-5 border border-gray-300 rounded-lg  focus:border-green-500 items-center justify-center">
                    <MdMailOutline className="text-2xl" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full focus:outline-none"
                      type="email"
                      name="name"
                      required
                      placeholder="Enter Your Email"
                    />
                  </div>
                  <div className="flex p-[6px] md:p-2 gap-5 border border-gray-300 rounded-lg  focus:border-green-500 items-center justify-center">
                    <MdOutlineLock className="text-2xl" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full focus:outline-none"
                      type={showLoginPassword ? "text" : "password"}
                      name="name"
                      required
                      placeholder="Create a Password"
                    />
                    {showLoginPassword ? (
                      <FaEye
                        className=" cursor-pointer text-2xl"
                        onClick={() => setShowLoginPassword(false)}
                      />
                    ) : (
                      <FaEyeSlash
                        className=" cursor-pointer text-2xl"
                        onClick={() => setShowLoginPassword(true)}
                      />
                    )}
                  </div>
                  <div
                    onClick={() => setShowEmailField(true)}
                    className="flex px-5 gap-5 text-[#81BC06] cursor-pointer rounded-lg items-end justify-end"
                  >
                    <span>Forget Password ?</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="loginTerms"
                      required
                      className="mr-2 cursor-pointer"
                      checked={conditions}
                      onChange={(e) => setConditions(e.target.checked)}
                    />
                    <label htmlFor="loginTerms" className="text-gray-600">
                      I accept all{" "}
                      <span className="text-blue-400 cursor-pointer hover:underline">
                        terms & conditions
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#81BC06] text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-4 md:mt-10"
                >
                  LOG IN
                </button>
              </form>
            </div>
          )}
          {step === 2 && (
            <div className="md:p-6 p-2 xl:w-[350px] md:w-[45%] w-[95%] md:h-[500px] h-auto bg-[#81BC06] rounded-b-lg md:rounded-l-none md:rounded-r-lg shadow-lg text-center flex flex-col justify-between">
              <h2 className="md:text-2xl text-xl  mb-2 md:mb-0 font-semibold ">
                Secure Access to a Sustainable Future
              </h2>
              <p className="mb-4 text-[#10100f]  text-justify md:text-left md:text-base text-sm">
                At Energy Innovations, we’re powering the future with a blend of
                traditional and renewable energy solutions. Our commitment to
                sustainability drives us to deliver top-notch services in the
                oil, gas, and renewable sectors.
              </p>
              <p className="mb-4 text-[#10100f] text-justify md:text-left md:text-base text-sm">
                Client Login Enter your credentials below to access your
                personalized dashboard. Stay connected to our latest projects,
                track your service requests, and manage your account with ease.
              </p>
              <button
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setStep(1);
                }}
                className="w-full bg-white text-black  py-2 px-4 rounded-lg hover:bg-gray-100"
              >
                REGISTRATION
              </button>
            </div>
          )}
        </div>
      </div>
      {showEmailField && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white px-8 py-5 rounded shadow-md w-[30rem]">
            <span className="flex items-center justify-center text-3xl">
              Forget Password
            </span>
            <div className="flex flex-col items-start justify-start gap-2 mt-10">
              <label>Enter your Email</label>
              <input
                required
                className="w-full border-2 py-2 rounded-lg px-5"
                placeholder="Email"
                type="email"
                value={forgetEmail}
                onChange={handleEmailChange}
              />
              {!isEmailValid && (
                <span className="text-[#F35325]">
                  Please enter a valid email address
                </span>
              )}
            </div>
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={sendOtp}
              >
                Send Otp
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => {
                  setShowEmailField(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showField && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white px-8 py-5 rounded shadow-md w-[30rem]">
            <span className="flex items-center justify-center text-3xl">
              Change Password
            </span>
            <div className="flex flex-col items-start justify-start gap-2 mt-10">
              <label>Enter Otp</label>
              <input
                className="w-full border-2 py-2 rounded-lg px-5"
                placeholder="Otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-2 mt-2">
              <label>Enter New Password</label>
              <input
                className="w-full border-2 py-2 rounded-lg px-5"
                placeholder="new password"
                type="text"
                value={newpassword}
                onChange={(e) => handlePasswordChange(e, setNewPassword)}
              />
            </div>
            {!isPasswordValid && (
              <span className="text-[#F35325]">{passwordError}</span>
            )}
            <div className="flex flex-col items-start justify-start gap-2 mt-2">
              <label>Confirm New Password</label>
              <input
                className="w-full border-2 py-2 rounded-lg px-5"
                placeholder="new Password"
                type="text"
                value={newConfirmPassword}
                onChange={(e) => handlePasswordChange(e, setNewConfirmPassword)}
              />
            </div>
            {!isPasswordValid && (
              <span className="text-[#F35325]">{passwordError}</span>
            )}
            <div className="flex items-center w-full justify-evenly mt-5 mb-5">
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-green-500 rounded-lg bg-[#81BC06] font-normal text-[1.2rem]"
                onClick={changePassword}
              >
                Change Password
              </button>
              <button
                className="py-3 w-[40%] cursor-pointer hover:bg-red-800 rounded-lg bg-[#F35325] font-normal text-[1.2rem]"
                onClick={() => {
                  setShowField(false);
                }}
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

export default Login;
