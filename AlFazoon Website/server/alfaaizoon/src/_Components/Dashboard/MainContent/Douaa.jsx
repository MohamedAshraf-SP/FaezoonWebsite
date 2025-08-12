import DouaaImg from "/images/Douaa/Douaa.webp";
// Import icons

import { CiSearch } from "react-icons/ci";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  addNewItem,
  getDuaaCategories,
  getItem,
} from "../../../Services/TutorialService";
import PopUpMassage from "../../PopUpMassage";
import PopUp from "../../PopUp";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../../Rtk/slices/updataDataSlice";

export default function Douaa() {
  const dispatch = useDispatch();
  const [popUpmsg, setpopUpmsg] = useState(true);
  const [actionmsg, setactionmsg] = useState("");
  const [DuaaCategories, setDuaaCategories] = useState([]);
  const [serchForm, setSearchForm] = useState(false);
  const [selectedDouaaNumber, setselectedDouaaNumber] = useState(null);
  const [existingAudioFilename, setExistingAudioFilename] = useState("");
  const [isEdit, setisEdit] = useState(false);

  // Toggle show serchForm
  const ShowSearchForm = () => {
    setSearchForm((prev) => !prev);
  };

  // add new Hadith
  const AddDouaa = async (Item, path) => {
    try {
      const response = await addNewItem(Item, path);
      console.log(response);
      setactionmsg("تم إضافة دعاء جديد");

      setpopUpmsg(true);

      setTimeout(() => setpopUpmsg(false), 3000);
    } catch (error) {
      // Set the error state if an error occurs
      setactionmsg("ادخل رقم مختلف للدعاء");

      setpopUpmsg(true);
      setTimeout(() => setpopUpmsg(false), 3000);
    }
  };
  // edit hadith
  const getSelectedItemId = (itemId, Item) => {
    setselectedDouaaNumber(itemId);
    setisEdit(true);
    formik.setValues(Item);
  };

  // load Duaa Categorires
  const getCategories = async () => {
    try {
      const data = await getDuaaCategories("douas");
      setDuaaCategories(data);
    } catch (error) {
      console.log("error load category", error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  // Hadith Form
  const formik = useFormik({
    initialValues: {
      dID: "",
      name: "",
      english: "",
      arabic: "",
      type: "",
      voice: null,
    },
    validationSchema: Yup.object({
      dID: Yup.number()
        .min(0, "Hadith Number can't be less than 0")
        .required("Number of Hadith is required"),
      name: Yup.string(),
      english: Yup.string().required("Hadith in English is required"),
      arabic: Yup.string().required("Hadith in Arabic is required"),
      type: Yup.string()
        .required("duaa category is required")
        .test(
          "type",
          "Please enter a new Duaa type or select an existing category.",
          function (value) {
            // Ensure that either the `type` input or the select box is filled out
            return value || this.parent.selectedCategory;
          }
        ),
      voice: Yup.mixed().required("An audio file is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("number", values.dID);
      formData.append("name", values.name);
      formData.append("english", values.english);
      formData.append("arabic", values.arabic);
      formData.append("type", values.type);
      formData.append("voice", values.voice);
      if (isEdit) {
        dispatch(
          updateData({
            path: "douas",
            itemId: selectedDouaaNumber,
            updatedItem: formData,
          })
        );
        setisEdit(false);
        setselectedDouaaNumber(null);
      } else {
        AddDouaa(formData, "douas");
      }
      resetForm();
      if (fileAudiotRef.current) {
        fileAudiotRef.current.value = null; // Clear the file input manually
      }
    },
  });
  // Use `useRef` to reference the file input
  const fileAudiotRef = useRef(null);
  // get Akida voice while click update
  useEffect(() => {
    const getVoice = async () => {
      if (isEdit && selectedDouaaNumber) {
        try {
          const fetchedItem = await getItem("douas", selectedDouaaNumber);

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
  }, [isEdit, selectedDouaaNumber]);
  return (
    <div className="container py-10">
      {serchForm && (
        <PopUp
          toggleshowPopup={ShowSearchForm}
          path={"douas"}
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
            Duaa
          </h2>
          <button
            className="ml-4 text-[15px] text-[#94a3b8] bg-[#fefeffe1]  text-left   border border-solid border-[#e5e7eb] flex flex-row justify-start lg:pr-20 px-6  lg:pl-3 gap-2 py-1 tracking-wide outline-none   rounded-md hover:border-[#bebebe] transition-all duration-300 ease-in-out items-center "
            onClick={ShowSearchForm}
          >
            <CiSearch size={24} /> Quick search...
          </button>
        </div>
        <div className="lg:h-20 lg:w-40 w-40 h-30 overflow-hidden   ">
          <img src={DouaaImg} alt="DouaaImg" className="w-full h-full" />
        </div>
      </div>

      {/* Hadith Form */}
      <div className="mt-6 rounded-md border border-solid border-neutral-200">
        <div className="text-xl font-serif py-4 px-4 text-[#202936] border-b border-solid border-[#dfe5efcc] bg-[#ebf0ff48]">
          <h3>{isEdit ? "Update Duaa" : "Add New Duaa"}</h3>
        </div>
        <form
          className="mt-8 grid grid-cols-12 gap-6 px-4 pb-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Hadith Number */}
          <div className="md:col-span-4 col-span-12">
            <label className="Dashboardlabel" htmlFor="number">
              Duaa Number
            </label>
            <input
              type="number"
              name="dID"
              placeholder="Duaa Number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dID}
              className="Dashboardinput"
            />
            {formik.touched.dID && formik.errors.dID && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.dID}
              </div>
            )}
          </div>
          {/* Douaa type */}
          <div className="md:col-span-4 col-span-12">
            <label className="Dashboardlabel" htmlFor="number">
              Add New Type (optional)
            </label>
            <input
              type="text"
              name="type"
              placeholder="Duaa type"
              onChange={(e) => {
                const selectedType = e.target.value;
                formik.setFieldValue("type", selectedType); // Update 'type' based on dropdown selection
              }} // Update Formik's "type" value
              onBlur={formik.handleBlur}
              value={formik.values.type}
              className="Dashboardinput"
            />
            {formik.touched.type && formik.errors.type && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.type}
              </div>
            )}
          </div>
          <div className="md:col-span-4 col-span-12">
            <label className="Dashboardlabel" htmlFor="number">
              Duaa Type
            </label>
            <div className="relative w-64">
              <select
                name="selectedCategory"
                onChange={(e) => {
                  const newType = e.target.value;
                  formik.setFieldValue("type", newType); // Update 'type' to the new input
                }} // Sync with Formik's "type"
                onBlur={formik.handleBlur}
                className="Dashboardinput"
                value={formik.values.type} // Bind to Formik's "type" state
              >
                <option value="" disabled>
                  Select Duaa category
                </option>
                {DuaaCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {formik.touched.type && formik.errors.type && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.type}
              </div>
            )}
          </div>

          {/* Douaa type */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="name">
              Duaa Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Duaa Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="Dashboardinput"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-600 text-sm italic mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>
          {/* Upload Sound */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="voice">
              Upload Sound
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

          {/* Hadith In Arabic */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="arabic">
              Duaa In Arabic
            </label>
            <textarea
              id="arabic"
              name="arabic"
              placeholder="أدخل الدعاء باللغه العربيه"
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

          {/* Hadith In English */}
          <div className="md:col-span-6 col-span-12">
            <label className="Dashboardlabel" htmlFor="english">
              Duaa In English
            </label>
            <textarea
              id="english"
              name="english"
              placeholder="Enter Duaa In English"
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
              className={`inline-block rounded-md lg:px-12 px-6 py-3 text-md lg:text-sm  text-sm font-medium transition focus:outline-none focus:ring ${
                !formik.isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {isEdit ? "Update Duaa" : "Add Duaa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
