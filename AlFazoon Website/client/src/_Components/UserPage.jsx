import { React, useState, useRef } from "react";
import {
  formatDataForDisplay,
  translateText,
} from "../Services/translateService";
// import icons
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import Overlay from "./Overlay";
import Navbar from "./Navbar";
import { getStudents } from "../Services/StudentService";
import { encodeMessageForWhatsApp } from "../Services/whatsapp";
function UserPage() {
  // start collect data from inputs as Ref
  const StudentDetails = useRef([]);
  const quranInputs = useRef([]);
  const MorgaaInputs = useRef([]);
  const HomeworkInputs = useRef([]);
  const IslamicStudies = useRef([]);
  const TeacherNotes = useRef([]);

  // inputs states
  const [Student_Details, setStudent_Details] = useState([]);
  const [quranDatatranslated, setquranData] = useState([]);
  const [MoragaaDatatranslated, setTMoragaaData] = useState([]);
  const [homeworkDatatranslated, sethomeworkData] = useState([]);
  const [IslamicStudiestranslated, setIslamicStudies] = useState([]);
  const [Teacher_notes, setTeacherNotes] = useState([]);
  const [Loading, showLoading] = useState(false);
  const [TextArea, showTextArea] = useState(false);

  // function to select one checkbox
  const [selectedcheckBox, setselectedcheckBox] = useState("");
  const [ErrorMsg, setErrorMsg] = useState("");
  const handleCheckboxChange = (checkboxId) => {
    setselectedcheckBox(checkboxId);
  };
  // funtion to display collected data
  const handleCollectData = async (e) => {
    e.preventDefault();
    // ensure that one checkbox is clicked
    if (!navigator.onLine) {
      setErrorMsg("لا يوجد إتصال بالانترنت يرجي المحاوله لاحقا.");
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Enable smooth scrolling
      });
      return; // Prevent form submission
    } else if (!selectedcheckBox) {
      setErrorMsg("يرجي إدخال حضور الطالب*");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    } else {
      StudentDetails.current[4];
      setErrorMsg("");
    }
    showLoading(true);
    // Translate Data
    const processAndTranslateInputs = async (inputsRef) => {
      return await Promise.all(
        inputsRef?.current?.map(async (input) => ({
          label: await translateText(input?.dataset?.label || "", "en"),
          value: await translateText(input?.value || "", "en"),
        }))
      );
    };
    // set translated inputs into state
    setquranData(
      await processAndTranslateInputs(quranInputs ? quranInputs : "")
    );
    setTMoragaaData(await processAndTranslateInputs(MorgaaInputs));
    sethomeworkData(await processAndTranslateInputs(HomeworkInputs));
    setIslamicStudies(await processAndTranslateInputs(IslamicStudies));
    setStudent_Details(await processAndTranslateInputs(StudentDetails));
    setTeacherNotes(await processAndTranslateInputs(TeacherNotes));

    showLoading(false);
    showTextArea(true);
  };
  // hadle day of today
  const today = new Date();
  const TodayDate = today.toISOString().split("T")[0];
  // function to display data in textarea
  const StudentDetailsData = `Student Data:\n${formatDataForDisplay(
    Student_Details || "",
    "Student Data"
  )}`;
  const formattedQuranData = `Quran Karim:\n${formatDataForDisplay(
    quranDatatranslated || "",
    "quran"
  )}`;
  const formattedMoragaaData = `Revision Quran:\n${formatDataForDisplay(
    MoragaaDatatranslated || "",
    "moragaa"
  )}`;
  const formattedHomeworkData = `Homework:\n${formatDataForDisplay(
    homeworkDatatranslated || "",
    "Homework"
  )}`;
  const formattedIslamicStudiesData = `Islamic Studies:\n${formatDataForDisplay(
    IslamicStudiestranslated || "",
    "Islamic Studies"
  )}`;
  const TeacherNotesData = `Teacher Notes:\n${formatDataForDisplay(
    Teacher_notes || "",
    "Teacher Notes"
  )}`;

  const initialContent = `${StudentDetailsData}\n\n${formattedQuranData}\n\n${formattedMoragaaData}\n\n${formattedHomeworkData}\n\n ${formattedIslamicStudiesData}\n\n${TeacherNotesData}`;

  // function to get data from input field search about student
  const [studentName, setstudenName] = useState("");
  const [AllStudents, setAllStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [displayStudent, setdisplaystudent] = useState([]);
  const SearchStudentName = async (e) => {
    e.preventDefault();
    const name = e.target.value.toLowerCase();
    setstudenName(name);
    try {
      const Students = await getStudents();
      setAllStudents(Students);
      const results = AllStudents.filter((student) => {
        const fullName =
          `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase();
        return fullName.includes(name);
      });
      setSearchResults(results);
    } catch (error) {
      console.log(error);
    }
  };
  // get student to display it
  const getstudent = (e, student) => {
    e.preventDefault;
    setdisplaystudent(student);
    setstudenName("");
  };
  // whats app func
  const WhatsappFunc = (e) => {
    e.preventDefault();
    const sendToWhatsapp = encodeMessageForWhatsApp(
      displayStudent.whatsapp,
      initialContent
    );

    // Redirect to WhatsApp using the generated link if valid
    if (sendToWhatsapp) {
      window.open(sendToWhatsapp, "_blank");
    } else {
      console.error("Failed to generate WhatsApp link.");
    }

    // Clear all input fields
    [
      quranInputs,
      MorgaaInputs,
      HomeworkInputs,
      StudentDetails,
      IslamicStudies,
      TeacherNotes,
    ].map((field) =>
      field?.current.forEach((input) => {
        if (input) input.value = "";
      })
    );
  };
  // collabse each section as want
  const [collabse, setcollabse] = useState("");
  const collabsesecion = (index) => {
    setcollabse(collabse == index ? null : index);
  };

  return (
    <>
      <section className="bg-bgColor h-full">
        <Navbar ButtonStatius={false} />
        {Loading && <Overlay title={"Translate"} />}
        <div className="container">
          <form className="pt-6 flex flex-row items-center justify-end gap-2">
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => SearchStudentName(e)}
              placeholder=" أدخل إسم الطالب"
              className={`text-right p-1 rounded-md border  border-solid border-slate-300 outline-none focus:border-PrimaryColor px-3`}
            />
          </form>
          {/* show search Results */}
          <div className="relative">
            {studentName && (
              <div
                className="absolute end-0 z-10 mt-2 w-60 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg h-[200px] overflow-y-scroll"
                role="menu"
              >
                {searchResults.length > 0 ? (
                  searchResults?.map((student, index) => (
                    <div key={index} className="p-2">
                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 "
                        role="menuitem"
                        onClick={(e) => getstudent(e, student)}
                      >
                        {student.firstName} {student.middleName}{" "}
                        {student.lastName}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm  mt-2 text-right p-1 text-textColor font-semibold">
                    لا يوجد طالب بهذا الاسم
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="w-full py-2">
            <p className=" lg:text-xl text-center text-sm text-red-600 font-semibold animate-pulse">
              {ErrorMsg}
            </p>
          </div>
          <div className="lg:py-10 py-3 mx-auto ">
            <h1 className="text-center text-textColor font-semibold md:text-2xl text-xl">
              بيانات الطالب
            </h1>
            <form
              className=" h-full w-full py-5 px-4 rounded-lg"
              onSubmit={handleCollectData}
            >
              <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="إسم المدرس"
                  // required
                  value={
                    displayStudent ? `${displayStudent.TeacherName || ""}` : ""
                  }
                  className="inputText"
                  data-label="إسم المدرس"
                  ref={(el) => (StudentDetails.current[1] = el)}
                />
                <input
                  type="date"
                  className="text-center inputText cursor-not-allowed "
                  // required
                  value={TodayDate}
                  readOnly
                  data-label="تاريخ"
                  ref={(el) => (StudentDetails.current[2] = el)}
                />
                <input
                  type="number"
                  placeholder="رقم الفصل"
                  // required
                  className="inputText"
                  value={
                    displayStudent ? `${displayStudent.ClassNum || ""}` : ""
                  }
                  min={0}
                  data-label="رقم فصل الطالب"
                  ref={(el) => (StudentDetails.current[3] = el)}
                />
              </div>
              <div className="grid grid-cols-1 my-2">
                <input
                  type="text"
                  placeholder="إسم الطالب"
                  className="inputText"
                  value={
                    displayStudent
                      ? `${displayStudent.firstName || ""} ${
                          displayStudent.middleName || ""
                        } ${displayStudent.lastName || ""}`
                      : ""
                  }
                  required
                  data-label="إسم الطالب"
                  ref={(el) => (StudentDetails.current[0] = el)}
                />
              </div>

              <div className="grid grid-cols-2 my-4">
                <div className="flex flex-row items-center justify-center gap-1">
                  <label className="font-medium text-xl text-textColor">
                    حاضر
                  </label>
                  <input
                    type="checkbox"
                    className="CheckBox "
                    value={"الطالب حضر"}
                    data-label="حضورالطالب"
                    checked={selectedcheckBox == "checkBox1"}
                    ref={(el) => {
                      if (selectedcheckBox == "checkBox1") {
                        StudentDetails.current[4] = el;
                      }
                    }}
                    onChange={() => handleCheckboxChange("checkBox1")}

                    // ref={(el) => (StudentDetails.current = el)}
                  />
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <label className="font-medium text-xl text-textColor">
                    غائب
                  </label>
                  <input
                    type="checkbox"
                    className="CheckBox"
                    data-label="حضور الطالب"
                    value={"غائب"}
                    checked={selectedcheckBox == "checkBox2"}
                    ref={(el) => {
                      if (selectedcheckBox == "checkBox2") {
                        StudentDetails.current[4] = el;
                      }
                    }}
                    onChange={() => handleCheckboxChange("checkBox2")}
                  />
                </div>
              </div>

              {/* start quran kareem form */}
              <div className="p-4 border border-dotted border-slate-500 rounded-lg my-4">
                <div className="flex flex-row items-center justify-between py-3">
                  <span
                    className="w-auto h-full p-1 rounded-full cursor-pointer text-xl font-medium bg-PrimaryButtonColor text-white hover:bg-white hover:text-slate-900 transition-all duration-200 "
                    onClick={() => collabsesecion(1)}
                  >
                    {collabse == 1 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                  <h1 className="text-right text-textColor font-semibold text-xl underline">
                    القرأن الكريم
                  </h1>
                </div>

                <div
                  className={` md:flex-row-reverse md:flex-wrap lg:flex-nowrap flex-col md:items-center items-end justify-start gap-2 ${
                    collabse == 1 ? "flex" : "hidden"
                  }`}
                >
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      تسميع
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="تسميع"
                      data-label="recitation"
                      ref={(el) => (quranInputs.current[0] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة الحفظ للتسميع
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder=" درجة الحفظ للتسميع"
                      data-label="grade"
                      ref={(el) => (quranInputs.current[1] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة التجويد للتسميع
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder="درجة التجويد للتسميع"
                      data-label="Tajweed"
                      ref={(el) => (quranInputs.current[2] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      حفظ للجديد
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="حفظ الجدبد"
                      data-label="new Quran"
                      ref={(el) => (quranInputs.current[3] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة حفظ القرآن الجديد
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder="درجة حفظ الجديد"
                      data-label="grade"
                      ref={(el) => (quranInputs.current[4] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة تجويد القرآن الجديد
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder="درجه تجويد الجديد"
                      data-label="Tajweed"
                      ref={(el) => (quranInputs.current[5] = el)}
                    />
                  </div>
                </div>
              </div>

              {/* end quran kareem form */}

              {/* start Moragaa quran  */}
              <div className="p-4 border border-dotted border-slate-500 rounded-lg my-4">
                <div className="flex flex-row items-center justify-between py-3">
                  <span
                    className="w-auto h-full p-1 rounded-full cursor-pointer text-xl font-medium bg-PrimaryButtonColor text-white hover:bg-white hover:text-slate-900 transition-all duration-200 "
                    onClick={() => collabsesecion(2)}
                  >
                    {collabse == 2 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                  <h1 className="text-right text-textColor font-semibold text-xl underline">
                    مراجعة القرأن
                  </h1>
                </div>

                <div
                  className={` md:flex-row-reverse md:flex-wrap lg:flex-nowrap flex-col md:items-center items-end justify-start gap-2 ${
                    collabse == 2 ? "flex" : "hidden"
                  }`}
                >
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      قريب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="قريب"
                      data-label="Close"
                      ref={(el) => (MorgaaInputs.current[0] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة حفظ القرأن القريب
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder=" درجة حفظ القريب"
                      data-label="Score"
                      ref={(el) => (MorgaaInputs.current[1] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة تجويد القرأن القريب
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder="درجة تجويد القريب"
                      data-label="Tajweed"
                      ref={(el) => (MorgaaInputs.current[2] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      القرأن البعيد
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="بعيد"
                      data-label="Far"
                      ref={(el) => (MorgaaInputs.current[3] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة حفظ القرأن البعيد
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder="درجة حفظ البعيد"
                      data-label="Score"
                      ref={(el) => (MorgaaInputs.current[4] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      درجة تجويد القرأن البعيد
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="inputText"
                      placeholder="درجه تجويد البعيد"
                      data-label="Tajweed"
                      ref={(el) => (MorgaaInputs.current[5] = el)}
                    />
                  </div>
                </div>
              </div>
              {/* end Moragaa quran  */}

              {/* start homework section */}
              <div className="p-4 border border-dotted border-slate-500 grid-flow-row rounded-lg my-4 space-y-2  ">
                <div className="flex flex-row items-center justify-between py-3">
                  <span
                    className="w-auto h-full p-1 rounded-full cursor-pointer text-xl font-medium bg-PrimaryButtonColor text-white hover:bg-white hover:text-slate-900 transition-all duration-200 "
                    onClick={() => collabsesecion(3)}
                  >
                    {collabse == 3 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                  <h1 className="text-right text-textColor font-semibold text-xl underline">
                    الواجب
                  </h1>
                </div>

                <div
                  className={`flex md:flex-row-reverse md:flex-wrap lg:flex-nowrap flex-col md:items-center items-end justify-start gap-2 ${
                    collabse == 3 ? "flex" : "hidden"
                  }`}
                >
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      الواجب سماع
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="سماع"
                      data-label="Listen"
                      ref={(el) => (HomeworkInputs.current[0] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      حفظ الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="حفظ"
                      data-label="Memorize"
                      ref={(el) => (HomeworkInputs.current[1] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      مراجعة الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText "
                      placeholder="مراجعة"
                      data-label="Review"
                      ref={(el) => (HomeworkInputs.current[2] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب سماع
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="سماع"
                      data-label="Was homework completed(Hearing) y / n ? "
                      ref={(el) => (HomeworkInputs.current[3] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب حفظ
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="حفظ"
                      data-label="Was homework completed(Memorization) y / n ?"
                      ref={(el) => (HomeworkInputs.current[4] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب مراجعة
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="مراجعة"
                      data-label="Was homework completed(Revision)?"
                      ref={(el) => (HomeworkInputs.current[5] = el)}
                    />
                  </div>
                </div>
              </div>

              {/* end homework section */}

              {/* start islamic studies */}
              <div className="p-4 border border-dotted border-slate-500 grid-flow-row rounded-lg my-4 space-y-2">
                <div className="flex flex-row   items-center justify-between py-3">
                  <span
                    className="w-auto h-full p-1 rounded-full cursor-pointer text-xl font-medium bg-PrimaryButtonColor text-white hover:bg-white hover:text-slate-900 transition-all duration-200 "
                    onClick={() => collabsesecion(4)}
                  >
                    {collabse == 4 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                  <h1 className="text-right text-textColor font-semibold text-xl underline">
                    المواد الشرعيه
                  </h1>
                </div>

                <div
                  className={`  md:flex-row-reverse    md:flex-wrap flex-col md:items-center items-end justify-start gap-2 ${
                    collabse == 4 ? "flex" : "hidden"
                  }`}
                >
                  <div className="flex flex-col items-end justify-end w-full md:w-3/12 py-2 ">
                    <label className="font-bold text-textColor py-1">
                      اللغة العربيه
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الدرس"
		      data-label=" Arabic langauge"
                      ref={(el) => (IslamicStudies.current[0] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الواجب"
                      data-label="تكليف"
                      ref={(el) => (IslamicStudies.current[1] = el)}
                    />
                  </div>
                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب؟
                    </label>

                    <input
                      type="text"
                      className="inputText"
                      placeholder="هل فعل الواجب؟"
                      data-label="Was homework completed(Memorization) y / n ?"
                      ref={(el) => (IslamicStudies.current[2] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-3/12 py-2">
                    <label className="font-bold text-textColor py-1">
                      الحديث
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الدرس"
                      data-label="الحديث"
                      ref={(el) => (IslamicStudies.current[3] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الواجب"
                      data-label="Review"
                      ref={(el) => (IslamicStudies.current[4] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب؟
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل القيمة هنا"
                      data-label="was Homework completed y / n"
                      ref={(el) => (IslamicStudies.current[5] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-3/12 py-2">
                    <label className="font-bold text-textColor py-1">
                      العقيدة
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الدرس"
                      data-label="Aqeeda (creed)"
                      ref={(el) => (IslamicStudies.current[6] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الواجب"
                      data-label="Review"
                      ref={(el) => (IslamicStudies.current[7] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب؟
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل القيمة هنا"
                      data-label="was Homework completed y / n?"
                      ref={(el) => (IslamicStudies.current[8] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-3/12 py-2">
                    <label className="font-bold text-textColor py-1">
                      الادب والاذكار
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الدرس"
                      data-label="Duas"
                      ref={(el) => (IslamicStudies.current[9] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الواجب"
                      data-label="Review"
                      ref={(el) => (IslamicStudies.current[10] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب؟
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل القيمة هنا"
                      data-label="was Homework completed y / n ?"
                      ref={(el) => (IslamicStudies.current[11] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-3/12 py-2">
                    <label className="font-bold text-textColor py-1">
                      تحفة الأطفال
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الدرس"
                      data-label="Tajweed poem (tuhfa)"
                      ref={(el) => (IslamicStudies.current[12] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      الواجب
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل الواجب"
                      data-label="Review"
                      ref={(el) => (IslamicStudies.current[13] = el)}
                    />
                  </div>

                  <div className="flex flex-col items-end justify-end w-full md:w-1/3 py-2">
                    <label className="font-bold text-textColor py-1">
                      هل فعل الواجب؟
                    </label>
                    <input
                      type="text"
                      className="inputText"
                      placeholder="أدخل القيمة هنا"
                      data-label="was Homework completed y / n?"
                      ref={(el) => (IslamicStudies.current[14] = el)}
                    />
                  </div>
                </div>
              </div>
              {/* end islamic studies */}

              {/* start teacher feedback */}
              <div className="p-4 border border-dotted border-slate-500 grid-flow-row rounded-lg my-4 space-y-2">
                <div className="flex flex-row items-center justify-between py-3">
                  <span
                    className="w-auto h-full p-1 rounded-full cursor-pointer text-xl font-medium bg-PrimaryButtonColor text-white hover:bg-white hover:text-slate-900 transition-all duration-200 "
                    onClick={() => collabsesecion(5)}
                  >
                    {collabse == 5 ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                  <h1 className="text-right text-textColor font-semibold text-xl underline">
                    ملاحظات المعلم
                  </h1>
                </div>

                <div className={`${collabse == 5 ? "flex" : "hidden"}`}>
                  <table className="w-full border-collapse text-right bg-[#ECFBF9] ">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2 text-center text-textColor">
                          ملاحظات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            className="inputText text-xl"
                            placeholder="أدخل القيمة هنا"
                            data-label="ملاحظات المعلم اليوم"
                            ref={(el) => (TeacherNotes.current[0] = el)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* end teacher feedback */}
              <div className="grid grid-cols-1 my-2">
                <button
                  type="submit"
                  className="flex items-center justify-center hover:bg-transparent cursor-pointer border border-solid rounded-md outline-none   px-6 py-2 text-[16px] font-semibold text-white shadow bg-cyan-500
                hover: border-cyan-500 hover:text-gray-400 "
                >
                  ترجم البيانات
                </button>
              </div>
            </form>
            {/* start textarea translation */}
            {TextArea && (
              <div>
                <div className="grid grid-cols-1 gap-3  pt-6 overflow-hidden">
                  <h1 className="text-right font-bold text-xl">
                    {" "}
                    جميع البيانات
                  </h1>

                  <textarea
                    readOnly
                    rows={10}
                    cols={50}
                    value={initialContent}
                    className="rounded-lg px-4 py-3 outline-none "
                  />
                </div>
                <div className="flex flex-row items-center justify-between py-4 px-4">
                  <a
                    target="_blank"
                    className="flex items-center justify-center hover:bg-transparent cursor-pointer border border-solid rounded-md outline-none   px-6 py-2 text-[16px] font-semibold text-white shadow bg-cyan-500
                hover: border-cyan-500 hover:text-gray-400 "
                    onClick={(e) => WhatsappFunc(e)}
                  >
                    أرسل البيانات
                  </a>
                </div>
              </div>
            )}
            {/* end textarea translation */}
          </div>
        </div>
      </section>
    </>
  );
}

export default UserPage;
