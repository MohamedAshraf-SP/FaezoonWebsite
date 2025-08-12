import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NoDataFounded from "/images/No data/55024593_9264820.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import _ from "lodash";
// Import Components
import NewNavbar from "../_Components/NewNavbar";
import { fetchData } from "../Rtk/slices/LoadDataslice";
import { fetchSearchResult } from "../Rtk/slices/SearchSlice";
import { getCount } from "../Services/TutorialService";
import { highlightText } from "../assets/HighlightText";
import Pagination from "../_Components/Pagination";
import AqidahComponent from "../_Components/AqidahComponent";
import FixedHeader from "../_Components/FixedHeader";

export default function Akida() {
  const dispatch = useDispatch();
  const loadLimit = import.meta.env.VITE_API_LOAD_LIMI;
  const fetchDataStatus = useSelector((state) => state.fetchedData.status);
  const Allaqidah = useSelector((state) => state.fetchedData.results);
  const searchStatus = useSelector((state) => state.search.status);
  const searchResult = useSelector((state) => state.search.searchresult);
  // Local states
  const [playingId, setPlayingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Audio Play/Pause
  const handlePlayAudio = (id) => {
    setPlayingId((prevPlayingId) => (prevPlayingId === id ? null : id));
  };

  // Handle Search with Debouncing
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      debouncedFetch(value);
    }
  };

  const debouncedFetch = _.debounce((searchValue) => {
    dispatch(
      fetchSearchResult({ path: "/aqidahs/search", searchWord: searchValue })
    );
  }, 300);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, []);

  // Load Categories with Counts
  const categoryNames = [
    "hadiths",
    "azkars",
    "aqidahs",
    "douas",
    "arboonNawwis",
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await Promise.all(
          categoryNames.map(async (category) => {
            const count = await getCount(category);
            return { name: category, count, link: category };
          })
        );
        setCategories(categoryData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Fetch Hadith data based on current page
  useEffect(() => {
    dispatch(fetchData(`aqidahs/?limit=${loadLimit}&page=${currentPage}`));
  }, [dispatch, currentPage]);

  return (
    <>
      <NewNavbar />
      <FixedHeader subtitle={"Cread"} />
      <div className="py-10 container">
        <div className="grid grid-cols-12 md:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-9 col-span-12 h-fit">
            <input
              className="Dashboardinput cursor-pointer !w-full lg:hidden :block"
              placeholder="Search here"
              autoFocus
              onKeyUp={handleSearch}
            />
            <div>
              {/* Loading Search Results */}
              {searchValue && searchStatus === "Loading..." && (
                <div className="flex flex-row items-center justify-center w-full overflow-hidden">
                  <div className="loader w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}

              {/* Display Search Results */}
              {searchValue &&
                searchStatus === "Success" &&
                searchResult.length > 0 && (
                  <div>
                    {searchResult.map((aqidah) => (
                      <AqidahComponent
                        key={aqidah._id}
                        aqidahNumber={aqidah.aID}
                        aqidahqusetion={highlightText(
                          aqidah.arabic,
                          searchValue
                        )}
                        aqidahAnswer={highlightText(
                          aqidah.english,
                          searchValue
                        )}
                        aqidahId={aqidah._id}
                        isPlaying={playingId === aqidah._id}
                        onPlayAudio={handlePlayAudio}
                      />
                    ))}
                  </div>
                )}

              {/* No Search Results */}
              {searchValue &&
                searchStatus === "Success" &&
                searchResult.length === 0 && (
                  <div className="lg:w-[360px] lg:h-[360px] mx-auto">
                    <img src={NoDataFounded} alt="No Data Found" />
                    <p className="flex flex-row items-center justify-center text-center text-xl my-2 font-medium py-2">
                      No results found. Please try a different search term.
                    </p>
                  </div>
                )}

              {/* Loading Default Hadiths */}
              {!searchValue && fetchDataStatus === "Loading..." && (
                <div className="flex flex-col items-start gap-6 w-full">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="w-full">
                      <Skeleton height={20} width="20%" />
                      <Skeleton height={200} width="100%" />
                    </div>
                  ))}
                </div>
              )}

              {/* Display Default Hadiths */}
              {!searchValue &&
                fetchDataStatus === "success" &&
                Allaqidah?.aqidahs?.length > 0 && (
                  <div>
                    {Allaqidah.aqidahs.map((aqidah) => (
                      <AqidahComponent
                        key={aqidah._id}
                        aqidahNumber={aqidah.aID}
                        aqidahqusetion={highlightText(
                          aqidah.arabic,
                          searchValue
                        )}
                        aqidahAnswer={highlightText(
                          aqidah.english,
                          searchValue
                        )}
                        aqidahId={aqidah._id}
                        isPlaying={playingId === aqidah._id}
                        onPlayAudio={handlePlayAudio}
                      />
                    ))}
                  </div>
                )}

              {/* No Hadiths Fetched */}
              {!searchValue &&
                fetchDataStatus === "success" &&
                Allaqidah?.aqidahs?.length === 0 && (
                  <p className="text-center font-medium">
                    No aqidahs available.
                  </p>
                )}

              {/* Pagination */}
              {!searchValue &&
                fetchDataStatus === "success" &&
                Allaqidah?.aqidahs?.length > 0 && (
                  <div className="pt-8 mx-auto">
                    <Pagination
                      currentPage={currentPage}
                      pagecount={Allaqidah?.pagesCount}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 col-span-12 py-[10px]">
            {/* Search Bar */}
            <input
              className="Dashboardinput cursor-pointer !w-full hidden lg:block"
              placeholder="Search here"
              autoFocus
              onKeyUp={handleSearch}
            />
            <div className="text-center py-4">
              <h2 className="text-left font-light  text-[20px] pb-2 flex flex-row items-center justify-start gap-6">
                Important
                <hr className="border-t border-solid border-gray-300 w-full" />
              </h2>
              <p className="font-english leading-relaxed  font-medium text-[16px] text-[#5f6068]">
                This collection presents Islamic beliefs in a clear
                question-and-answer format, focusing on the core principles of
                faith. Using trusted sources from the Quran and Sunnah, it
                serves as an accessible guide for anyone seeking to deepen their
                understanding. Each question is designed to clarify essential
                aspects of the Muslim creed, offering valuable insights to
                support and strengthen one’s faith.
              </p>
            </div>
            <div className="text-center py-8 ">
              <h2 className="text-left font-light  text-[20px] pb-2 flex flex-row items-center justify-start gap-6">
                Categories{" "}
                <hr className="border-t border-solid border-gray-300 w-full" />
              </h2>

              <div className="flex flex-col items-start space-y-4">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/Tutorials/${category.link}`}
                      className="flex flex-row items-center justify-between rounded-md overflow-hidden w-full bg-[#F2F2F2] cursor-pointer hover:translate-x-2 transition-transform duration-300 group capitalize"
                    >
                      <div className="text-textColor p-2 font-semibold">
                        {category.name}
                      </div>
                      <div className="bg-[#343746] py-2 px-4 text-white group-hover:bg-[#005A8C]">
                        {category?.count?.count}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-start w-full space-y-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <Skeleton key={index} height={20} width={200} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
