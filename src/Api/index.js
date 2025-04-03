import axios from "axios";

// Host
// export const Host = "https://api.suvira.com";
export const Host = "http://localhost:8001";

//Api Routes
export const SEND_OTP = `${Host}/api/v1/sendOtp`;
export const ALL_ADMINS = `${Host}/api/v1/allAdmins`;
export const ALL_ADMINS_REQUEST = `${Host}/api/v1/allAdminsRequest`;
export const APPROVE_ADMIN = `${Host}/api/v1/approveAdmin`;
export const DELETE_ADMIN = `${Host}/api/v1/deleteAdmin`;
export const UPDATE_MAIL = `${Host}/api/v1/updateMail`;
export const Forget_Password = `${Host}/api/v1/forgetPassword`;
export const LOGIN = `${Host}/api/v1/adminLogin`;
export const CHANGE_BANNER = `${Host}/api/v1/UpdateCarrerBanner`;
export const IMAGE_UPLOAD = `${Host}/api/v1/UploadImageOnServer`;
export const FILE_UPLOAD = `${Host}/api/v1/UploadFilesOnServer`;
export const FETCH_JOB_APPLICATION = `${Host}/api/v1/fetchJobApplications`; //Left
export const REGISTER = `${Host}/api/v1/adminRegister`;
export const ADD_BLOG = `${Host}/api/v1/addBlog`;
export const UPDATE_BLOG = `${Host}/api/v1/updateBlog`;
export const UPDATE_SECTOR = `${Host}/api/v1/sectors`;
export const UPDATE_SUBSECTOR = `${Host}/api/v1/subsectors`;
export const DELETE_BLOG = `${Host}/api/v1/deleteBlog`;
export const ADD_News = `${Host}/api/v1/addNews`;
export const UPDATE_News = `${Host}/api/v1/updateNews`;
export const DELETE_News = `${Host}/api/v1/deleteNews`;
export const GET_USER_INFO = `${Host}/api/v1/getUserInfo`;
export const ADD_CLIENT = `${Host}/api/v1/Addclient`;
export const UPDATE_CLIENT = `${Host}/api/v1/Editclient`;
export const DELETE_CLIENT = `${Host}/api/v1/Deleteclient`;
export const CONTACT = `${Host}/api/v1/contact`;
export const ADD_FEEDBACK = `${Host}/api/v1/AddFeedback`;
export const UPDATE_FEEDBACK = `${Host}/api/v1/EditFeedbacks`;
export const DELETE_FEEDBACK = `${Host}/api/v1/DeleteFeedbacks`;
export const JOB_APPLICATION = `${Host}/api/v1/createJobApplication`;
export const ADD_JOB_POSTING = `${Host}/api/v1/AddJobPosting`;
export const UPDATE_JOB_POSTING = `${Host}/api/v1/EditJobPostings`;
export const DELETE_JOB_POSTING = `${Host}/api/v1/DeleteJobPostings`;
export const DELETE_SECTOR = `${Host}/api/v1/sectors`;
export const DELETE_SUBSECTOR = `${Host}/api/v1/subsectors`;
export const DELETE_CATEGORIES = `${Host}/api/v1/categories`;
export const ADD_LOGO = `${Host}/api/v1/AddLogo`;
export const ADD_PRODUCTS = `${Host}/api/v1/AddProducts`;
export const UPDATE_PRODUCTS = `${Host}/api/v1/EditProducts`;
export const DELETE_PRODUCTS = `${Host}/api/v1/DeleteProducts`;
export const ADD_SERVICES = `${Host}/api/v1/AddServices`;
export const UPDATE_SERVICES = `${Host}/api/v1/EditServices`;
export const DELETE_SERVICES = `${Host}/api/v1/DeleteServices`;
export const UPDATE_SERVICE_INNER = `${Host}/api/v1/InnerEditServices`;
export const ADD_SERVICE_INNER = `${Host}/api/v1/InnerAddServices`;
export const DELETE_SERVICE_INNER = `${Host}/api/v1/InnerDeleteServices`;
export const ADD_SECTION = `${Host}/api/v1/AddSection`;
export const DELETE_SECTION = `${Host}/api/v1/DeleteSection`;
export const CHECK_USER = `${Host}/api/v1/checkUser`;
export const LOGIN_WITH_GOOGLE = `${Host}/api/v1/loginWithGoogle`;
export const ADD_SECTOR = `${Host}/api/v1/sectors`;
export const ADD_SUBSECTOR = `${Host}/api/v1/subsectors`;
export const ADD_CATEGORIES = `${Host}/api/v1/categories`;
export const UPDATE_CATEGORIES = `${Host}/api/v1/categories`;


//Get Api Routes
export const GET_BLOGS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/fetchAllBlog`);
    if (data.success) {
      return data.blogs;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_NEWS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/fetchAllNews`);
    if (data.success) {
      return data.news;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_CLIENTS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/GetClients`);
    if (data.success) {
      return data.clients;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_FEEDBACKS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/GetFeedbacks`);
    if (data.success) {
      return data.feedbacks;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_JOB_POSTINGS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/GetJobPostings`);
    if (data.success) {
      return data.jobPostings;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_PRODUCTS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/GetProducts`);
    if (data.success) {
      return data.products;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_SERVICES = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/GetServices`);
    if (data.success) {
      return data.services;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const GET_SECTORS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/sectors`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.log("No sectors found or response structure is unexpected");
    }
  } catch (error) {
    console.log("Error while fetching sectors:", error);
  }
};
export const GET_SUBSECORS = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/subsectors`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.log("No sectors found or response structure is unexpected");
    }
  } catch (error) {
    console.log("Error while fetching sectors:", error);
  }
};
export const GET_CATEGORIES = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/categories`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.log("No sectors found or response structure is unexpected");
    }
  } catch (error) {
    console.log("Error while fetching sectors:", error);
  }
};


export const GET_LOGO = async () => {
  try {
    const { data } = await axios.get(`${Host}/api/v1/fetchLogo`);
    if (data.success) {
      return data.logos;
    } else {
      console.log("Something Went Wrong", data);
    }
  } catch (err) {
    console.log(err);
  }
};
