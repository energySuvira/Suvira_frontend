import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../component/Loading";
import Chemicals from "../page/offerings/downstream/Chemicals";
import Renewables from "../page/offerings/renewables/Renewables";
import ChemicalProducts from "../page/offerings/downstream/ChemicalProducts";
import ChemicalFullProductPage from "../page/offerings/downstream/ChemicalFullProductPage";
import RenewableProducts from "../page/offerings/renewables/RenewableProducts";
import ApplyJobPage from "../page/ApplyJobPage";
import BlogDetails from "../page/BlogDetails";
import OilandGasProducts from "../page/oilandGas/OilandGasProducts";
import OilandGasProductDetails from "../page/oilandGas/OilandGasProductDetails";
import RenewableProductDetails from "../page/offerings/renewables/RenewableProductDetails";

const Login = lazy(() => import("../page/Login"));
const Home = lazy(() => import("../page/Home"));
const AboutUs = lazy(() => import("../page/AboutUs"));
const Contact = lazy(() => import("../page/Contact"));
const Career = lazy(() => import("../page/Career"));
const Blog = lazy(() => import("../page/Blog"));
const Product = lazy(() => import("../page/Products"));
const ServicesPage = lazy(() => import("../page/services"));
const NewsCard = lazy(() => import("../page/News"));
const NotFound = React.lazy(() => import("../page/NotFound"));
const OilAndGasPage = React.lazy(() => import("../page/offerings/OilAndGas"));

const pageTransition = {
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: "-20%",
  },
};

const Navigator = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <Routes  location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/home"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/aboutus"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <AboutUs />
              </motion.div>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Contact />
              </motion.div>
            }
          />
          <Route
            path="/career"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Career />
              </motion.div>
            }
          />
          <Route
            path="/career/:pageId/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <ApplyJobPage />
              </motion.div>
            }
          />
          <Route
            path="/blogs"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Blog />
              </motion.div>
            }
          />
          <Route
            path="/blogs/blog-details"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <BlogDetails />
              </motion.div>
            }
          />
          <Route
            path="/products"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Product />
              </motion.div>
            }
          />
          <Route
            path="/news"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <NewsCard />
              </motion.div>
            }
          />
          <Route
            path="/offerings/chemicals/:pageId/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <ChemicalFullProductPage />
              </motion.div>
            }
          />
            {/* <Route
            path="/offerings/renewable/:pageId/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <RenewableProductDetails />
              </motion.div>
            }
          /> */}

          <Route
            path="/offerings/chemicals/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <ChemicalProducts />
              </motion.div>
            }
          />
           <Route
            path="/offerings/renwable/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <RenewableProducts />
              </motion.div>
            }
          />
         

          <Route
            path="/offerings/oilandgas/:pageId/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <OilandGasProductDetails />
              </motion.div>
            }
          />
          <Route
            path="/offerings/oilandgas/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <OilandGasProducts />
              </motion.div>
            }
          />
          <Route
            path="/offerings/oilandgas"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <OilAndGasPage />
              </motion.div>
            }
          />
          <Route
            path="/offerings/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <OilAndGasPage />
              </motion.div>
            }
          />
           <Route
            path="/offerings/:pageId/:id/"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <OilandGasProducts />
              </motion.div>
            }
          />
           <Route
            path="/offerings/:sectorId/:pageId/:id"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <OilandGasProductDetails />
              </motion.div>
            }
          />
          <Route
            path="/offerings/downStream/chemicals"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Chemicals />
              </motion.div>
            }
          />
          {/* <Route
            path="/offerings/renewable"
            element={
              <motion.div
                initial="out"
                animate="in"
                exit="out"
                variants={pageTransition}
                transition={{ duration: 0.5 }}
              >
                <Renewables />
              </motion.div>
            }
          /> */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default Navigator;
