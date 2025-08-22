import Salwat from "/images/Hadith/salawat.png";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { addNewItem, getItem } from "../../../Services/TutorialService";
import PopUpMassage from "../../PopUpMassage";
import { CiSearch } from "react-icons/ci"; // Import the search icon
import PopUp from "../../PopUp";
import { useDispatch } from "react-redux";
import { updateData } from "../../../Rtk/slices/updataDataSlice";

export default function Tawheed() {
  const dispatch = useDispatch();
  const [popUpmsg, setpopUpmsg] = useState(false);
  const [actionmsg, setactionmsg] = useState("");
  const [serchForm, setSearchForm] = useState(false);
  const [selectedHaditnumber, setselectedHaditnumber] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [existingAudioFilename, setExistingAudioFilename] = useState("");

  // Toggle show serchForm
  const ShowSearchForm = () => {
    setSearchForm((prev) => !prev);
  };

  // add new Hadith
  const addHadith = async (Item, path) => {
    try {
      const response = await addNewItem(Item, path);
      setactionmsg("تم إضافة عنصر جديد");
      setpopUpmsg(true);

      setTimeout(() => setpopUpmsg(false), 3000);
    } catch (error) {
      // Set the error state if an error occurs
      setactionmsg("ادخل رقم مختلف للعنصر");
      setpopUpmsg(true);
      setTimeout(() => setpopUpmsg(false), 3000);
    }
  };

  // edit hadith
  const getSelectedItemId = (itemId, Item) => {
    setselectedHaditnumber(itemId);
    setisEdit(true);
    formik.voice = Item.voice;
    formik.setValues(Item);
  };
  // get hadith voice while click update
  useEffect(() => {
    const getVoice = async () => {
      if (isEdit && selectedHaditnumber) {
        try {
          const fetchedItem = await getItem("tawheeds", selectedHaditnumber);

          if (fetchedItem.voice.path) {
            const audioUrl = `${fetchedItem.voice.path
              ?.split("\\")
              .slice(2)
              ?.join("")
              .replace(/\\/g, "/")}`;
            setExistingAudioFilename(audioUrl);
          }
        } catch (error) {
          console.log("error here", error);
        }
      }
    };
    getVoice();
  }, [isEdit, selectedHaditnumber]);
  // Hadith Form
  const formik = useFormik({
    initialValues: {
      hID: "",
      english: "",
      arabic: "",
      voice: null,
    },
    validationSchema: Yup.object({
      hID: Yup.number()
        .min(0, "Fiqh Number can't be less than 0")
        .required("Number of Fiqh is required"),
      english: Yup.string().required("Fiqh in English is required"),
      arabic: Yup.string().required("Fiqh in Arabic is required"),
      voice: Yup.mixed().required("An audio file is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("number", values.hID);
      formData.append("english", values.english);
      formData.append("arabic", values.arabic);
      formData.append("voice", values.voice);
      if (isEdit) {
        dispatch(
          updateData({
            path: "tawheeds",
            itemId: selectedHaditnumber,
            updatedItem: formData,
          })
        );
        setisEdit(false);
        setselectedHaditnumber(null);
      } else {
        addHadith(formData, "tawheeds");
      }
      setExistingAudioFilename(null);
      resetForm();

      if (fileAudiotRef.current) {
        fileAudiotRef.current.value = null; // Clear the file input manually
      }
    },
  });
  // Use `useRef` to reference the file input"
  const fileAudiotRef = useRef(null);
  return (
    <div className="container py-10">
      {serchForm && (
        <PopUp
          toggleshowPopup={ShowSearchForm}
          path={"tawheeds"}
          getSelectedItemId={getSelectedItemId}
        />
      )}
      {popUpmsg && actionmsg.length > 0 ? (
        <PopUpMassage children={actionmsg} />
      ) : (
        ""
      )}

      <div className="flex lg:flex-row flex-col lg:items-start items-center justify-between bg-[rgb(235,240,255)] bg-[linear-gradient(90deg,_rgba(235,240,255,0.9976365546218487)_12%,_rgba(249,251,255,1)_69%)] px-6 overflow-numberden h-fit rounded-lg">
        <div className="lg:pt-6 py-2 flex flex-row items-center">
          <h2 className="text-[#202936] font-semibold font-sans lg:text-2xl text-xl">
            Tawheed
          </h2>
          <button
            className="ml-4 text-[15px] text-[#94a3b8] bg-[#fefeffe1]  text-left   border border-solid border-[#e5e7eb] flex flex-row justify-start lg:pr-20 px-6  lg:pl-3 gap-2 py-1 tracking-wide outline-none   rounded-md hover:border-[#bebebe] transition-all duration-300 ease-in-out items-center "
            onClick={ShowSearchForm}
          >
            <CiSearch size={24} /> Quick search...
          </button>
        </div>
        <div className="lg:h-20 lg:w-40 w-50 h-20 overflow-hidden   ">
          <img src={Salwat} alt="Salwat" className="w-full h-full" />
        </div>
      </div>

      {/* Hadith Form */}
      <div className="mt-6 rounded-md border border-solid border-neutral-200">
        <div className="text-xl font-medium py-4 px-4 text-[#202936] border-b border-solid border-[#dfe5efcc] bg-[#ebf0ff48]">
          <h3>{isEdit ? "Update Hadith" : "Add New Hadith"}</h3>
        </div>
        <form
          className="mt-8 grid grid-cols-12 gap-6 px-4 pb-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Hadith Number */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="number">
              tawheed Number
            </label>
            <input
              type="number"
              name="hID"
              placeholder="tawheed Number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.hID}
              className="Dashboardinput"
            />
            {formik.touched.hID && formik.errors.hID && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.hID}
              </div>
            )}
          </div>

          {/* Upload Sound */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel mb-1" htmlFor="voice">
              {isEdit ? "Upload New Sound (optional)" : "Upload Sound"}
            </label>

            <input
              ref={fileAudiotRef}
              type="file"
              name="voice"
              // accept="audio/*"
              onChange={(event) => {
                formik.setFieldValue("voice", event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              id="voice"
              className="block w-full text-md text-gray-800 border border-gray-300 rounded-md cursor-pointer bg-gray-50"
            />
            {existingAudioFilename && (
              <p className="text-gray-800 my-2 over">
                Current audio: {existingAudioFilename}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              mp3, wav, (MAX. 5MB limit).
            </p>
            {formik.touched.voice && formik.errors.voice && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.voice}
              </div>
            )}
          </div>

          {/* tawheed In Arabic */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="arabic">
              tawheed In Arabic
            </label>
            <textarea
              id="arabic"
              name="arabic"
              placeholder="أدخل العنصر باللغه العربيه"
              dir="rtl"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.arabic}
              className="Dashboardinput resize-none"
              style={{ width: "100%", height: "200px" }}
            />
            {formik.touched.arabic && formik.errors.arabic && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.arabic}
              </div>
            )}
          </div>

          {/* tawheed In English */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="english">
              tawheed In English
            </label>
            <textarea
              id="english"
              name="english"
              placeholder="Enter tawheed In English"
              dir="ltr"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.english}
              className="Dashboardinput resize-none"
              style={{ width: "100%", height: "200px" }}
            />
            {formik.touched.english && formik.errors.english && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.english}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              type="submit"
              className={`inline-block rounded-md lg:px-12 px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring ${
                !formik.isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {isEdit ? "Update tawheed" : "Add tawheed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
