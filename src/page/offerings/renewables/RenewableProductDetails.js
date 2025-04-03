import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { renewableCards } from '../../../mockData/chemicalsData';
import Header from '../../../component/Header';
import PageBannerWithTitle from '../../../component/PageBannerWithTitle';
import icons from '../../../assets';
import { IoSearchOutline } from 'react-icons/io5';
import { ImageWithLoader } from '../../../component/ImageLoader';
import ChemicalProductsCards from '../downstream/ChemicalProductsCards';
import ReadMoreBtn from '../../../component/ReadMoreBtn';
import Footer from '../../../component/Footer';

function RenewableProductDetails() {
    const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const { pageId } = useParams();
  const decodedPageId = decodeURIComponent(pageId);
  const location = useLocation();
  const { logoSrc, cardTitle } = location.state || {};

  const splitTextInSpans = (
    text,
    firstSpanClassName = "",
    secondSpanClassName = "",
    firstSpanWordCount = 1
  ) => {
    if (!text) return null;

    const words = text.split(" ");
    const firstWords = words.slice(0, firstSpanWordCount).join(" ");
    const remainingWords = words.slice(firstSpanWordCount).join(" ");

    return (
      <>
        <span className={firstSpanClassName}>{firstWords}</span>
        {remainingWords && (
          <span className={secondSpanClassName}> {remainingWords}</span>
        )}
      </>
    );
  };

  const filteredCards = renewableCards
    .filter(
      (card) =>
        card.cardTitle !== cardTitle &&
        card.sectorSection === decodedPageId &&
        card.cardTitle
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
    )
    .slice(0, 4);

  // Debounce implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
   <>
     <Header />
      <PageBannerWithTitle
        title={decodedPageId}
        backgroundImage={icons.AboutUs}
      />
      <div className="mt-11 w-full flex justify-center items-center flex-col">
        <div className=" flex items-center justify-between w-[80%]">
          <div className=" w-[70%] xl:w-[530px]  bg-[#05A6F01A] border border-[#05A6F0] p-[11px] rounded-[50px] flex items-center hover:border-[#0c8ce9]">
            <IoSearchOutline className=" size-6 mr-3" />
            <input
              type="text"
              placeholder="Search Products"
              className=" w-full h-full border-none outline-none focus:border-[1px] focus:border-black placeholder:text-black bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className=" mr-4">
            <ImageWithLoader src={icons.sortSvg} alt="sort" />
          </button>
        </div>

        <div className="h-[1px] w-[90%] bg-black mt-11"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11 w-[90%] mx-auto my-11 ">
          {searchQuery.length !== 0 &&
            filteredCards.length > 0 &&
            filteredCards.map((item, index) => (
              <ChemicalProductsCards
                key={item.id || index}
                cardData={item}
                navigate={navigate}
                splitTextInSpans={splitTextInSpans}
                sectorSection={item.sectorSection}
              />
            ))}
        </div>
        <div className="xl:w-[80%] justify-center items-center gap-8   mt-11 flex lg:items-start lg:justify-between mb-11 flex-col lg:flex-row w-[90%]">
          <div className="flex flex-col gap-5 lg:w-[35%] w-full  text-left lg:order-1 order-2">
            <img
              src={logoSrc}
              alt={cardTitle}
              className=" h-[700px] xl:w-[470px] w-[90%] object-cover rounded-md"
            />

            <h3 className=" text-xl font-medium">
              <span className=" text-[#05A6F0]">Chemical</span>
              <span> Composition :</span>
            </h3>

            <p className=" text-lg">
              2-acrylamido-2-methylpropanesulfonic acid
            </p>

            <h3 className=" text-xl font-medium">Appearance :</h3>
            <ul className=" list-disc ml-8 w-[80%] ">
              <li>
                Fluid Loss Control Additive P (powder): White to cream-colored
                powder..
              </li>
              <li>
                Fluid Loss Control Additive L (liquid): Viscous liquid with a
                yellow tint.
              </li>
            </ul>

            <h3 className=" text-xl font-medium">Solubility :</h3>
            <p className=" text-lg">
              Completely soluble in water, with final viscosity as a limiting
              factor.
            </p>

            <ReadMoreBtn text="Download PDF" />
          </div>
          <div className=" lg:w-[62%] w-full flex flex-col gap-5 lg:order-2 order-1">
            <h1 className=" md:text-4xl text-2xl  font-[Poppins] font-medium xl:leading-[3rem]">
              {splitTextInSpans(cardTitle, "text-[#81BC06]", "text-black", 2)}
            </h1>
            <div className="h-[1px] w-full bg-black mt-5"></div>
            <h3 className=" text-2xl font-medium mt-6">
              <span className=" text-[#05A6F0]">Product</span>
              <span> Description :</span>
            </h3>

            <p className=" text-lg font-normal">
              Fluid loss control agents are essential components in well cement
              compositions, designed to minimize fluid loss to permeable
              formations or zones during cementing operations. It is a highly
              effective fluid loss and gas migration control additive, making
              the cementing process in oil and gas wells more reliable and
              efficient. This additive significantly reduces the filtration rate
              under field conditions while enhancing the stability of the cement
              system.
            </p>

            <h3 className=" text-2xl font-medium mt-6">
              <span> Benefits :</span>
            </h3>
            <ul className=" list-disc ml-8 text-lg ">
              <li>Effectively reduces fluid loss in cement slurries.</li>
              <li>
                Consistently performs in both low and high-temperature
                environments.
              </li>
              <li>
                Provides secondary gas migration control, serving as a potential
                latex replacement.
              </li>
              <li>
                Salt-resistant and compatible with NaCl concentrations up to
                18%.
              </li>
              <li>Maintains cement stone strength without adverse effects.</li>
              <li>
                Compatible with all dispersants, delivering optimal performance.
              </li>
            </ul>

            <h3 className=" text-2xl font-medium mt-6">
              <span className=" text-[#05A6F0]">Recommendations</span>
              <span> for use :</span>
            </h3>

            <p className=" text-lg font-normal">
              It is a fully synthetic product effective across a wide BHCT
              temperature range, from 32°F to 410°F. Recommended dosages for the
              powder form range from 0.2% to 1.0% by weight of cement, depending
              on the required filtration and rheological properties.
            </p>

            <h3 className=" text-2xl font-medium mt-6">
              <span className=" text-[#05A6F0]">Packaging</span>
              <span> and Storage :</span>
            </h3>

            <p className=" text-lg font-normal">
              It is a fully synthetic product effective across a wide BHCT
              temperature range, from 32°F to 410°F. Recommended dosages for the
              powder form range from 0.2% to 1.0% by weight of cement, depending
              on the required filtration and rheological properties.
            </p>

            <h3 className=" text-2xl font-medium mt-6">
              <span className=" text-[#05A6F0]">Safety</span>
              <span> Requirements :</span>
            </h3>

            <p className=" text-lg font-normal">
              Personal protective equipment (PPE) is required when handling the
              product. Always consult the MSDS before use, whether in the
              laboratory or in the field.
            </p>
          </div>
        </div>
        <div className="h-[1px] w-[90%] bg-black "></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11 w-[90%] mx-auto my-11 ">
          {filteredCards.map((item, index) => (
            <ChemicalProductsCards
              key={item.id || index}
              cardData={item}
              sector={"renewable"}
              navigate={navigate}
              splitTextInSpans={splitTextInSpans}
              sectorSection={item.sectorSection}
            />
          ))}
        </div>
      </div>
      <Footer />
   </>
  )
}

export default RenewableProductDetails