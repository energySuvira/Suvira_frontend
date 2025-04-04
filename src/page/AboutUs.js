import Header from "../component/Header";
import Footer from "../component/Footer";
import icons from "../assets";
import { useEffect, useRef, useState } from "react";

import { useRecoilValue } from "recoil";
import { Clients } from "../Recoil";
import PageBannerWithTitle from "../component/PageBannerWithTitle";
import PartnerSlider from "../component/PartnerSlider";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Aboutuscards } from "../mockData/chemicalsData";
import AnimatedCard from "../component/AnimatedCard";
import PageMainTitle from "../component/PageMainTitle";

const AboutUs = () => {
  const PartnerShips = useRecoilValue(Clients);
  const targetDivRef = useRef(null);

  const handleExploreClick = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handleExploreClick();
  }, []);

  const ourMissionDescription =
    "At Suvira Energy, our mission is to deliver exceptional chemical solutions to industries worldwide, ensuring the highest standards of quality, safety, and reliability. We are committed to fostering strong, long-term partnerships by providing innovative and sustainable chemical products, while continually enhancing value for our clients, stakeholders, and the communities we serve";
  const ourVisionDescription =
    "Our vision is to be a global leader in chemical procurement and supply, recognized for our unwavering commitment to sustainability, innovation, and excellence. We aspire to drive industries towards more sustainable practices, while expanding our global footprint and contributing to a cleaner, more energy-efficient future";
  const keyMetrics = [
    { num: 100, metricTitle: "Satisfied Clients" },
    { num: 300, metricTitle: "Products" },
    { num: 4.8, metricTitle: "Client Rating" },
    { num: 30, metricTitle: "Branch Offices" },
  ];
  const aboutref = useRef(null);

  const { scrollYProgress: cubeScrollYProgress } = useScroll({
    target: aboutref,
    offset: ["start end", "end start"],
    smooth: 500,
  });
  const icosahedronRotate = useTransform(
    cubeScrollYProgress,
    [0, 1],
    [-110, 50]
  );

  const aboutYearsRef = useRef(null);

  const { scrollYProgress: yearScrollYProgress } = useScroll({
    target: aboutYearsRef,
    offset: ["start end", "end start"],
    smooth: 500,
  });
  const yearimageMove = useTransform(yearScrollYProgress, [0, 1], [-30, 20]);

  // 

  const aboutYearsRef2 = useRef(null);

  const { scrollYProgress: year2ScrollYProgress } = useScroll({
    target: aboutYearsRef2,
    offset: ["start end", "end start"],
    smooth: 500,
  });
  const yearimageMove2 = useTransform(year2ScrollYProgress, [0, 1], [10, -10]);

  const Metric = ({ num, metricTitle }) => {
    const [currentNum, setCurrentNum] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
      if (isInView) {
        const interval = setInterval(() => {
          setCurrentNum((prev) => {
            const nextValue = prev + num / 100;
            return nextValue >= num ? num : nextValue;
          });
        }, 15);

        return () => clearInterval(interval);
      }
    }, [isInView, num]);

    return (
      <div className="flex flex-col text-center gap-3 md:gap-[20px]" ref={ref}>
        <h3 className="text-white xl:text-[50px] lg:text-[40px] text-[18px] sm:text-[24px] font-semibold">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
          >
            {num % 1 !== 0 ? currentNum.toFixed(1) : Math.floor(currentNum)}
          </motion.span>
          {num % 1 === 0 && "+"}
        </h3>
        <p className="xl:text-4xl lg:text-3xl text-[14px] sm:text-[16px]  text-white font-medium">
          {metricTitle}
        </p>
      </div>
    );
  };



  return (
    <>
      <Header />
      <div className="relative font-[Poppins]">
        <PageBannerWithTitle
          title="About Us"
          backgroundImage={icons.aboutUsBackground}
        />
        <div className="flex items-center justify-center w-full mt-10">
          <div className="w-screen flex flex-col items-start justify-center">
            <PageMainTitle greenColorText={"About"} blackColorText={"Suvira"}/>
           

            <div className="flex w-full ">
              <div className=" text-[#10100f] mt-0 w-full gap-0 flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  {" "}
                  <p className="md:text-center text-justify text-base md:text-xl  md:w-[80vw] w-[90vw] md:leading-8 leading-5">
                    Suvira Energy, headquartered in the dynamic metropolis of
                    Mumbai, stands as a pioneering force in the realm of
                    technology-driven solutions for the Energy sector in India.
                    Renowned for our prowess in cutting-edge Project Management,
                    Sales &amp; Marketing, and Services, we consistently cater
                    to the diverse needs of our esteemed clientele. <br />
                    Our technological proficiency extends beyond the
                    conventional boundaries of oil and gas operations, as we
                    actively engage in innovative solutions within the
                    technology sector. This underscores our unwavering
                    commitment to sustainability and fostering a technologically
                    advanced and eco-friendly future. Recognizing the
                    transformative power of technology, we are proud
                    contributors to India’s expanding technological landscape.{" "}
                    <br />
                    Suvira Energy is at the forefront, offering a comprehensive
                    suite of technology-driven services that span the entire
                    energy spectrum. From advanced Subsea Engineering to
                    cutting-edge Geosciences, Drilling Engineering, Well
                    Services, Exploration &amp; Production, Offshore Services,
                    Water Treatment &amp; Filtration, Refining, Midstream
                    operations, Pipeline Security, to state-of-the-art Renewable
                    Energy projects, we possess an unparalleled and diverse
                    technological expertise finely tuned to meet the unique
                    demands of our clients <br />
                    More than just a technology company, Suvira Energy
                    represents a legacy founded on trust, collaboration, and an
                    unwavering pursuit of technological excellence. As we
                    eagerly anticipate the future, we continue to stand as a
                    reliable partner and a driving force in the ever-evolving
                    landscape of technological advancements in Energy,
                    encompassing both traditional Oil &amp; Gas and the rapidly
                    growing field of Renewable Energy in India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Partners section */}
        <div className="w-full bg-[#05A6F0] xl:py-12 xl:px-14 py-6 px-3 mt-11">
          <h1 className="text-center w-full flex flex-col items-center mb-1">
            <span className=" text-2xl md:text-4xl  font-[Poppins] font-medium text-white leading-10">
              Trusted by 100+ companies worldwide.
            </span>
          </h1>
          <div className="w-full">
            {PartnerShips ? (
              <PartnerSlider PartnerShips={PartnerShips} />
            ) : (
              <h1 className="text-center w-full flex flex-col items-center text-red-700">
                Partners Error !
              </h1>
            )}
          </div>
        </div>
        {/* mission section */}
        <div className="flex flex-col  items-center justify-center bg-white xl:py-12 py-6 w-full overflow-x-clip">
          <div className="flex items-center  md:justify-end justify-center w-full flex-col md:flex-row md:gap-2 lg:gap-8 xl:gap-20 gap-5">
            <div className=" flex flex-col gap-10 lg:w-auto w-full items-center justify-center">
              <div className="flex flex-col rounded-[10px] border-[#10100F] border-[1px]  w-[90%] md:w-[50vw] lg:w-[50vw] xl:w-[42vw]">
              <div className="bg-white py-3 lg:py-6 border-b-[1px] border-black rounded-t-[10px]">
                  <h1 className=" text-xl md:text-4xl w-full text-center  font-[Poppins] font-medium text-black">
                    Our Mission
                  </h1>
                </div>
                <div className=" p-5 px-4 xl:px-8">
                  <p className=" w-full text-base lg:text-xl text-justify md:text-center leading-5 md:leading-7">
                    {ourMissionDescription}
                  </p>
                </div>
              </div>
              <div className="flex flex-col rounded-[10px] border-[#10100F] border-[1px]  w-[90%] md:w-[50vw] lg:w-[50vw] xl:w-[42vw]">
                <div className="bg-white py-3 lg:py-6 border-b-[1px] border-black rounded-t-[10px]">
                  <h1 className=" text-xl md:text-4xl w-full text-center  font-[Poppins] font-medium text-black">
                    Our Vision
                  </h1>
                </div>
                <div className=" p-5 px-4 xl:px-8">
                  <p className=" w-full text-base lg:text-xl text-justify md:text-center leading-5 md:leading-7">
                    {ourVisionDescription}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              ref={aboutref}
              className="relative flex justify-center flex-col w-[90%]  xl:w-[42vw] lg:w-[45vw] md:w-[75vw] h-[600px]  xl:h-[750px] rounded-xl bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: `url(${icons.aboutusImg})`,
                backgroundPositionX: icosahedronRotate,
                borderBottomRightRadius: "0px",
                borderTopRightRadius: "0px",
              }}
            >
              <div className="absolute flex items-start justify-start flex-col gap-5 left-[-1.5rem] top-[16%]">
                <div className="w-[50px] h-[50px] bg-[#81BC06] rounded-full"></div>
                <div className="w-[50px] h-[50px] bg-[#05A6F0] rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* keyMetrics section */}
        <div className="w-full bg-[#05A6F0] xl:py-[61px] lg:px-14 py-6 px-1 flex items-center justify-evenly lg:flex-nowrap gap-5 lg:gap-0">
          {keyMetrics.map((item, i) => (
            <Metric key={i} num={item.num} metricTitle={item.metricTitle} />
          ))}
        </div>
        {/* years of exp section */}
        <div className="w-full flex flex-col items-center justify-center xl:px-[135px] lg:px-[50px] px-[0px] mt-11 h-max overflow-x-clip">
          <div className="flex flex-col md:items-center md:flex-row lg:gap-9 gap-8 items-center justify-center w-full">
            <motion.div
              ref={aboutYearsRef}
              className="flex-grow lg:flex-none  xl:h-[600px] lg:h-[500px] sm:h-[400px] h-[250px] lg:w-[40vw] md:w-[40vw] w-[90%] rounded-xl bg-cover bg-no-repeat bg-right-bottom"
              style={{
                backgroundImage: `url(${icons.personWalkingDownStears})`,
                backgroundPositionX: yearimageMove,
              }}
            ></motion.div>
            <div className="flex flex-col justify-between md:items-start items-center w-full md:w-auto gap-8 md:gap-9">
              <motion.div
                className="flex-grow lg:flex-none xl:h-[443px] lg:h-[350px] sm:h-[300px] h-[200px] xl:w-[35vw] md:w-[30vw] w-[90%] rounded-xl bg-cover bg-center bg-no-repeat"
                
                ref={aboutYearsRef2}
                style={{
                  backgroundImage: `url(${icons.yearsAbout})`,
                  backgroundPositionX:yearimageMove2
                }}
              ></motion.div>
              <div className="flex flex-col items-center justify-between bg-[#81BC06] py-3 text-center xl:h-[120px] lg:h-[100px] h-[80px] xl:w-[35vw] md:w-[30vw] w-[90%] rounded-xl text-white font-semibold">
                <h3 className="xl:text-4xl lg:text-2xl text-sm">
                  Years of Experience
                </h3>
                <h3 className="xl:text-[50px] lg:text-3xl text-3xl">19+</h3>
              </div>
            </div>
          </div>
        </div>

       <div className="mt-11 overflow-x-clip">
      <h1 className="text-center w-full flex flex-col items-center">
        <span className="text-2xl md:text-4xl font-[Poppins] font-medium">
          History
        </span>
        <div className="md:h-[5px] md:w-[100px] h-[3px] w-[50px] bg-[#05A6F0] mb-8 mt-3 rounded-lg"></div>
      </h1>

      <div className="mt-4 w-full flex flex-col items-center justify-center mb-24">
        <div className="lg:w-[70%] w-[90%] historyWrapper">
          <div className="flex gap-6 items-center justify-start timediv w-full">
            {Aboutuscards.slice(0, 2).map((card, index) => (
              <AnimatedCard
                key={index}
                bgColor={card.bgColor}
                year={card.year}
                index={index}
              >
                {card.text}
              </AnimatedCard>
            ))}
          </div>
          <div className="flex gap-6 items-center justify-end timediv w-full">
            {Aboutuscards.slice(2, 4).map((card, index) => (
              <AnimatedCard
                key={index}
                bgColor={card.bgColor}
                year={card.year}
                index={index + 2} 
              >
                {card.text}
              </AnimatedCard>
            ))}
          </div>
          <div className="flex gap-6 items-center justify-start timediv w-full">
            {Aboutuscards.slice(4).map((card, index) => (
              <AnimatedCard
                key={index}
                bgColor={card.bgColor}
                year={card.year}
                index={index + 4} 
              >
                {card.text}
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
