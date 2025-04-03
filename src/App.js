import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
  Blogs,
  Clients,
  Feedbacks,
  JobPostings,
  Logo,
  News,
  Products,
  Sectors,
  Services,
  userInfo,
} from "./Recoil";
import { 
  GET_BLOGS,
  GET_CLIENTS,
  GET_FEEDBACKS,
  GET_JOB_POSTINGS,
  GET_LOGO,
  GET_NEWS,
  GET_PRODUCTS,
  GET_SERVICES,
  GET_USER_INFO,
  GET_SECTORS
} from "./Api";
import { toast } from "react-toastify";
import Navigator from "./route/Navigator";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import Loading from "./component/Loading";


function App() {
  const [blogs, setBlogs] = useRecoilState(Blogs);
  const [clients, setClients] = useRecoilState(Clients);
  const [feedbacks, setFeedbacks] = useRecoilState(Feedbacks);
  const [logo, setLogo] = useRecoilState(Logo);
  const [news, setNews] = useRecoilState(News);
  const [jobPostings, setJobPostings] = useRecoilState(JobPostings);
  const [products, setProducts] = useRecoilState(Products);
  const [services, setServices] = useRecoilState(Services);
  const [sectors, setSectors] = useRecoilState(Sectors);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [user, setUserData] = useRecoilState(userInfo);

  const getUserData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        GET_USER_INFO,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setUserData(data.userInfo);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.data?.message || error.message
      );
      localStorage.removeItem("token");
      setLoading(false);
    }
  };

  const getAllData = async () => {
    setLoading(true);
    setBlogs(await GET_BLOGS());
    setClients(await GET_CLIENTS());
    setServices(await GET_SERVICES());
    setSectors(await GET_SECTORS());
    setProducts(await GET_PRODUCTS());
    setJobPostings(await GET_JOB_POSTINGS());
    setFeedbacks(await GET_FEEDBACKS());
    setLogo(await GET_LOGO());
    setNews(await GET_NEWS());
    setLoading(false);
  };

  useEffect(() => {
    getAllData();
    if (token && !user) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!blogs) {
        setBlogs(await GET_BLOGS());
      }
      if (!clients) {
        setClients(await GET_CLIENTS());
      }
      if (!feedbacks) {
        setFeedbacks(await GET_FEEDBACKS());
      }
      if (!logo) {
        setLogo(await GET_LOGO());
      }
      if (!news) {
        setNews(await GET_NEWS());
      }
      if (!jobPostings) {
        setJobPostings(await GET_JOB_POSTINGS());
      }
      if (!products) {
        setProducts(await GET_PRODUCTS());
      }
      if (!services) {
        setServices(await GET_SERVICES());
      }
      if (!sectors) {
        setSectors(await GET_SECTORS());
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
        <Router>
      <Navigator />
    </Router>
      <ToastContainer />
      {loading && <Loading />}
    </div>
  );
}

export default App;
