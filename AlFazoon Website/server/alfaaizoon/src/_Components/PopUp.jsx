// import images
import NoDataFounded from "/images/No data/55024593_9264820.svg";
import React, { useEffect, useRef, useState } from "react";
// import icons
import { CiSearch } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
// redu
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResult } from "../Rtk/slices/SearchSlice";
import { fetchData } from "../Rtk/slices/LoadDataslice";
import { deleteData } from "../Rtk/slices/deleteDataSlice";
import _ from "lodash";
// import component
import swal from "sweetalert2";
import PopUpMassage from "./PopUpMassage";
import { highlightText } from "../assets/HighlightText";
import Pagination from "./Pagination";
export default function PopUp({ toggleshowPopup, path, getSelectedItemId }) {
  const loadLimit = import.meta.env.VITE_API_LOAD_LIMI;
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.search.searchresult);
  const existingData = useSelector((state) => state.fetchedData.results);
  const searchStatus = useSelector((state) => state.search.status);
  const dataStatus = useSelector((state) => state.fetchedData.status);
  const [searchValue, setSearchValue] = useState("");
  const [popUpmsg, setpopUpmsg] = useState(true);
  const [actionmsg, setactionmsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const popupRef = useRef(null);
  // get selected item id
  const handleItemClick = (itemId, item) => {
 
    getSelectedItemId(itemId, item);
    toggleshowPopup();
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      debouncedFetch(value);
    }
  };

  // handle search
  const debouncedFetch = _.debounce((searchValue) => {
    dispatch(
      fetchSearchResult({ path: `/${path}/search`, searchWord: searchValue })
    );
  }, 300);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, []);
  // handle delete item
  const DeleteItem = async (ItemId) => {
    try {
      const result = await swal.fire({
        title: "Are you sure you want to delete?",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          // Await the dispatch of the deleteItem action
          await dispatch(deleteData({ path: path, itemId: ItemId }));
          await dispatch(fetchData(path));
          setactionmsg("Delete Item Success");
          setpopUpmsg(true);
        } catch (error) {
          console.error("Error deleting Item:", error);
          setpopUpmsg(true);
          setactionmsg("Delete Item failed");
        }
      }
    } catch (error) {
      console.log("Error in delete confirmation:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchData(`${path}/?limit=${loadLimit}&page=${currentPage}`));
  }, [dispatch, currentPage, path]);

  // Hide the popup when clicking outside of it
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (popupRef.current && !popupRef.current.contains(e.target)) {
  //       toggleshowPopup();
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [popupRef, toggleshowPopup]);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center fadeIn transition-all duration-300 ease-in-out">
      {popUpmsg && <PopUpMassage children={actionmsg} />}

      <div className="relative bg-white lg:w-[600px] h-[500px]  rounded-lg shadow-lg overflow-y-scroll custom-scrollbar pb-10">
        {/* Search Bar */}
        <div className="flex items-center justify-between p-4 border-b border-solid border-gray-200">
          <div className="flex items-center gap-2">
            <CiSearch className="text-2xl text-gray-600" />
            <input
              type="text"
              placeholder="Search Here"
              className="outline-none text-sm w-full p-2"
              autoFocus={true}
              onChange={handleChange}
            />
          </div>
          <button
            className="px-3 py-1 rounded-xl text-sm font-semibold text-slate-600 hover:bg-gray-100 transition"
            onClick={toggleshowPopup}
          >
            ESC
          </button>
        </div>

        {/* Display Data */}
        <div className="p-4">
          {dataStatus === "loading" && <p>Loading data...</p>}
          {dataStatus === "failed" && <p>Failed to load static data.</p>}

          {searchValue.length === 0 ? (
            existingData[path]?.map((Item) => (
              <div
                key={Item._id}
                className="flex flex-col-reverse lg:flex-row items-center justify-between  lg:py-4 py-2 border-b border-solid border-gray-200 hover:bg-gray-50 px-4 cursor-pointer transition"
              >
                <div className="flex flex-col justify-start ">
                  <h3 className="text-m text-gray-800">
                    {Item.english.split(" ").slice(0, 20).join(" ")}....
                  </h3>
                  <h4 className="text-sm font-medium text-gray-500">
                    {Item.arabic.split(" ").slice(0, 20).join(" ")}....
                  </h4>
                </div>
                <div className="flex flex-row items-center justify-end  gap-4 text-lg text-gray-400  w-full ">
                  <button
                    className="hover:text-blue-500 transition"
                    onClick={() => handleItemClick(Item._id, Item)}
                  >
                    <FiEdit />
                  </button>
                  <hr className="w-[1px] h-8 bg-gray-300" />
                  <button
                    className="hover:text-red-500 transition"
                    onClick={() => DeleteItem(Item._id, path)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            ))
          ) : searchStatus === "loading" ? (
            <p>Searching...</p>
          ) : searchResults?.length > 0 ? (
            searchResults.map((Item) => (
              <div
                key={Item._id}
                className="flex items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50 px-4 cursor-pointer transition"
              >
                <div className="flex flex-col">
                  <h3 className="text-md  text-gray-800">
                    {highlightText(
                      Item.english.split(" ").slice(0, 20).join(" "),
                      searchValue
                    )}
                    ....
                  </h3>
                  <h4 className="text-sm font-medium text-gray-500">
                    {highlightText(
                      Item.arabic.split(" ").slice(0, 20).join(" "),
                      searchValue
                    )}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-lg text-gray-400">
                  <button className="hover:text-blue-500 transition">
                    <FiEdit />
                  </button>
                  <hr className="w-[1px] h-8 bg-gray-300" />
                  <button
                    className="hover:text-red-500 transition"
                    onClick={() => DeleteItem(Item._id, path)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-800 font-bold text-lg overflow-hidden w-80 h-80 mx-auto">
              <img
                src={NoDataFounded}
                alt="NoDataFounded"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
        {existingData[path]?.length > 0 && (
          <div className="pt-8 mx-auto">
            <Pagination
              currentPage={currentPage}
              pagecount={existingData?.pagesCount}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
