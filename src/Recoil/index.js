import { atom } from "recoil";

export const userInfo = atom({
  key: "userInfo",
  default: undefined,
});
export const Logo = atom({
  key: "Logo",
  default: undefined,
});
export const Animated = atom({
  key: "Animated",
  default: false,
});
export const Blogs = atom({
  key: "Blogs",
  default: undefined,
});
export const Clients = atom({
  key: "Clients",
  default: undefined,
});
export const Feedbacks = atom({
  key: "Feedbacks",
  default: undefined,
});
export const JobPostings = atom({
  key: "JobPostings",
  default: undefined,
});
export const News = atom({
  key: "News",
  default: undefined,
});
export const Products = atom({
  key: "Products",
  default: undefined,
});
export const Services = atom({
  key: "Services",
  default: undefined,
});
export const Sectors = atom({
  key: "Sectors",
  default: undefined,
});
export const ServiceReadMore = atom({
  key: "ServiceReadMore",
  default: undefined,
});
export const BlogDetails = atom({
  key: "BlogDetails",
  default: undefined,
});
export const clientClicked = atom({
  key: "clientClicked",
  default: false,
});
export const serviceClicked = atom({
  key: "serviceClicked",
  default: false,
});
export const testimonalClicked = atom({
  key: "testimonalClicked",
  default: false,
});
export const selectedIndustries = atom({
  key: "selectedIndustries",
  default: "Renewable Sector",
});
