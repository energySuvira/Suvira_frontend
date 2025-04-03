import React, { useState } from 'react';
import { IoIosArrowDown,IoIosArrowUp } from "react-icons/io";


function Accordion() {
    const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const accordionData = [
    {
      title: "What types of roles does Suvira Energy typically hire for?",
      content:
        "At Suvira Energy, we primarily hire for roles including: Chemical Engineers, Petroleum Engineers, Sales & Business Development Associates (BDA), Tender Management Professionals, Additionally, we occasionally seek professionals in procurement, project management, and sustainability-related roles.",
    },
    {
      title: "What qualifications do I need to apply?",
      content:
        "The basic qualifications vary based on the role: Engineering Roles: A degree in Chemical Engineering, Petroleum Engineering, or relevant fields. Industry experience and knowledge of engineering software/tools is a plus. Sales/BDA Roles: Bachelor's degree in business, marketing, engineering, or related fields. Prior experience in B2B sales or oil & gas industry sales preferred. Tender Roles: Experience in tender documentation, bid management, and procurement is essential. Relevant qualifications in engineering or business are advantageous.",
    },
    {
      title: "How do I apply for a position at Suvira Energy?",
      content:
        "You can view and apply for open positions directly through our Careers Page. Simply submit your resume and fill out the application form. Shortlisted candidates will be contacted for the next steps.",
    },
    {
      title: "Does Suvira Energy offer internships?",
      content:
        "Yes, we occasionally offer internships and trainee positions for fresh graduates and students pursuing degrees in engineering, business, or sustainability. Keep an eye on our Careers Page for updates on internship openings.",
    },
    {
      title: "What is the recruitment process at Suvira Energy?",
      content:
        "Our typical hiring process involves: Application Review, Initial HR Screening, Technical/Functional Interview, Final Round Interview (May include leadership or client-facing assessment), Offer & Onboarding",
    },
    {
      title: "Does Suvira Energy provide growth and learning opportunities?",
      content:
        "Absolutely! We are committed to employee development through: Regular training programs Opportunities to attend industry conferences Cross-functional projects exposure Leadership development for high-performing individuals",
    },
    {
      title: "Do you hire internationally or only within India?",
      content:
        "While we are headquartered in India, we operate internationally and consider candidates with relevant experience or skills globally, based on the role requirements.",
    },
    {
      title: "How can I stay updated on job openings at Suvira Energy?",
      content:
        "Follow us on LinkedIn and regularly check our Careers Page for the latest openings and company updates.",
    },
    {
      title: "What is the salary package offered at Suvira Energy?",
      content:
        "At Suvira Energy, we offer competitive salary packages aligned with industry standards. Compensation is based on the candidate's qualifications, experience, and role. In addition to the base salary, we offer performance-based incentives, project bonuses, and other benefits such as professional development opportunities and travel allowances (where applicable).",
    },
  
  ];
  return (
    <div className="w-[90%] mx-auto p-4 pt-0 ">
      {accordionData.map((item, index) => (
        <div key={index} className="mb-5">
          <button
            className={`accordion  bg-[#05A6F01A] w-full text-left p-4 text-[22px]   flex items-center justify-between text-[#05A6F0]`}
            onClick={() => toggleAccordion(index)}
          >
            {item.title}
            { activeIndex === index ? <IoIosArrowUp />: <IoIosArrowDown />}
            
          </button>
          <div
            className={`panel ${
              activeIndex === index ? "block" : "hidden"
            }  p-4 rounded-md shadow-sm `}
          >
            <p className=' text-[#10100F] text-[22px]'>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Accordion