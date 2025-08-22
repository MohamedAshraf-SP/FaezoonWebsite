import TeacherImg from "/images/Teachers/teachers.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert2";
import {
  addNewTeacher,
  DeleteTeacher,
  GetAllTeachers,
  updateTeacher,
} from "../../../Services/TeacherServices";
import { useEffect, useState } from "react";
import PopUpMassage from "../../PopUpMassage";
export default function Teachers() {
  const [Teachers, setTeachers] = useState([]);
  const [selectedTeacherID, setSelectedTeacher] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [popUpmsg, setpopUpmsg] = useState(false);
  const [actionmsg, setactionmsg] = useState("");

  // Load ALL Teachers
  const getAllTeachers = async () => {
    try {
      const data = await GetAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.log("failed adding Teachers");
    }
  };
  // Add new Teacher Func
  const addTeacher = async (item) => {
    try {
      await addNewTeacher(item);
      setpopUpmsg(true);
      setactionmsg("Add New Teacher Success");
      setTimeout(() => setpopUpmsg(false), 3000);
    } catch (error) {
      setactionmsg("Add New Teacher Fail");
      setpopUpmsg(true);
      setTimeout(() => setpopUpmsg(false), 1000);
    }
    getAllTeachers();
  };
  // Update Teacher Func
  //-------------- get selected Teacher id
  const getSelectedTeacherId = (TeacherID, TeacherData) => {
    window.scrollTo(0, 0);
    setSelectedTeacher(TeacherID);
    setisEdit(true);
    formik.setValues(TeacherData);
  };
  const updateSelectedTeacher = async (TeacherID, newTeacherData) => {
    try {
      await updateTeacher(TeacherID, newTeacherData);
      setactionmsg("Update Teacher Success");
      setpopUpmsg(true);
    } catch (error) {
      setactionmsg("Update Teacher Fail");
      setpopUpmsg(true);
    }
    getAllTeachers();
    setisEdit(false);
    setSelectedTeacher(null);
  };
  // Delete Teacher
  const deleteTeacher = async (TeacherId) => {
    try {
      swal
        .fire({
          title: "Are you sure you want to delete?",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await DeleteTeacher(TeacherId); // Await the delete action
              setpopUpmsg(true);
              setactionmsg("Delete Teacher Sucess");
              setTimeout(() => setpopUpmsg(false), 1000);
              getAllTeachers();
            } catch (error) {
              console.error("Error deleting student:", error);
              setactionmsg("Delete Teacher fail");
              setpopUpmsg(true);
            }
          }
        });
    } catch (error) {
      console.log("error delete teacher");
    }
    getAllTeachers();
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      age: "",
      birthDay: "",
      address: "",
      nationality: "",
      classID: "",
      phone: "",
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Name is required"),
      middleName: Yup.string().required("Second Name is required"),
      birthDay: Yup.date().required("Date of Join is required"),
      age: Yup.number().min(0, "Age cant be 0"),
      userName: Yup.string().required("UserName is required"),
      password: Yup.string().required("Password is required"),
      classID: Yup.number().required("class Number is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (isEdit) {
        updateSelectedTeacher(selectedTeacherID, values);
      } else {
        addTeacher(values);
      }
      getAllTeachers();
      resetForm();
    },
  });

  // get all teacher always
  useEffect(() => {
    getAllTeachers();
  }, []);
  return (
    <>
      <div className="container py-10">
        {popUpmsg && actionmsg.length > 0 ? (
          <PopUpMassage children={actionmsg} />
        ) : (
          ""
        )}
        {/* start title secton */}
        <div className="flex flex-row items-start justify-between bg-[rgb(235,240,255)] bg-[linear-gradient(90deg,_rgba(235,240,255,0.9976365546218487)_12%,_rgba(249,251,255,1)_69%)] lg:px-6 px-2 overflow-hidden h-fit rounded-lg ">
          <div className="pt-6">
            <h2 className="text-[#202936] font-semibold font-sans text-2xl">
              Our Teachers
            </h2>
            <p className="text-sm mt-1 text-gray-800 ">
              <span className="text-gray-400">Dashboard</span>
              <strong> . </strong>Our Teachers
            </p>
          </div>

          <div className="h-30 w-40 overflow-hidden">
            <img src={TeacherImg} alt="TeacherImg" className="w-full h-full" />
          </div>
        </div>
        {/* start teacher form */}
        <div className="mt-6 rounded-md border border-solid border-neutral-200 pb-4 ">
          <div className="text-xl fonr-medium py-4 px-4 text-[#202936] border-b border-solid border-[#dfe5efcc] font-medium bg-[#ebf0ff48]">
            <h3>{isEdit ? "Update Teacher" : "Add New Teacher"}</h3>
          </div>
          <form
            className="mt-8 grid grid-cols-12 gap-6 px-4"
            onSubmit={formik.handleSubmit}
          >
            {/* Name Input */}
            <div className="md:col-span-4 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600 font-sans"
              >
                First name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div className="md:col-span-4 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600 font-sans"
              >
                Second name
              </label>
              <input
                type="text"
                name="middleName"
                placeholder="Second name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.middleName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.middleName && formik.errors.middleName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.middleName}
                </div>
              )}
            </div>
            <div className="md:col-span-4 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600 font-sans"
              >
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.lastName}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600 font-sans"
              >
                Age
              </label>
              <input
                type="number"
                min={0}
                name="age"
                placeholder="Age"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.age}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.age && formik.errors.age && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.age}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600 font-sans"
              >
                Date of Join
              </label>
              <input
                type="date"
                name="birthDay"
                placeholder="Date of Join"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={
                  formik.values.birthDay ? (
                    new Date(formik.values.birthDay).toISOString().split("T")[0]
                  ) : (
                    <span>N/A</span>
                  )
                }
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.birthDay && formik.errors.birthDay && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.birthDay}
                </div>
              )}
            </div>

            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600  font-sans"
              >
                class Number
              </label>
              <input
                type="number"
                min={0}
                name="classID"
                placeholder="Teaching class number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.classID}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.classID && formik.errors.classID && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.classID}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600  font-sans"
              >
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nationality}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.nationality && formik.errors.nationality && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.nationality}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600  font-sans"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.address}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600  font-sans"
              >
                Mobile
              </label>
              <input
                type="number"
                min={0}
                name="phone"
                placeholder="Mobile"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.phone}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600  font-sans"
              >
                User name
              </label>
              <input
                type="text"
                min={0}
                name="userName"
                placeholder="user Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.userName && formik.errors.userName && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.userName}
                </div>
              )}
            </div>
            <div className="md:col-span-3 col-span-12">
              <label
                htmlFor="userName"
                className="block text-md font-semibold text-slate-600  font-sans"
              >
                password
              </label>
              <input
                type="text"
                min={0}
                name="password"
                placeholder="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="mt-1 w-full h-9 rounded-md p-2 font-thin text-secondary outline-none border border-solid border-[#dfe5ef] focus:border-[#5D87FF]"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600 text-sm italic mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>
            {/* Submit Button */}
            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
                className={`inline-block rounded-md lg:px-12 px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring 
                      ${!formik.isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isEdit ? "Updat Teacher" : "Add Teacher"}
              </button>
            </div>
          </form>
        </div>
        {/* start display teachers */}

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-14 h-[500px] ">
          {Teachers?.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-[13px] text-gray-300 capitalize bg-gray-50 dark:bg-gray-600 dark:text-gray-300 ">
                <tr>
                  <th scope="col" className="px-2 py-3 font-sans">
                    Teacher name
                  </th>
                  <th scope="col" className="px-2 py-3  font-sans">
                    <div className="flex items-center justify-center">
                      class Number
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Nationality
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Mobile
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      Date of Join
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      User Name
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <div className="flex items-center justify-center">
                      password
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="px-2 py-3 font-sans">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Teachers?.map((teacher) => (
                  <tr
                    className="  border-b dark:bg-gray-600 text-white text-md " key={teacher._id}
                  >
                    <th
                      scope="row"
                      className="px-2 py-4 font-medium text-gray-300 whitespace-nowrap dark:text-white"
                    >
                      {teacher.firstName} {teacher.middleName}{" "}
                      {teacher.lastName}
                    </th>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {teacher.classID}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {teacher.nationality}
                    </td>
                    <td className="px-2 py-4 text-center"> {teacher.phone}</td>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {teacher.birthDay
                        ? new Date(teacher.birthDay).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {teacher.userName}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {" "}
                      {teacher.password}
                    </td>
                    <td className="px-2 py-4 text-right">
                      <span
                        onClick={() =>
                          getSelectedTeacherId(teacher._id, teacher)
                        }
                        className="font-semibold text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      >
                        Edit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className="font-semibold text-red-600 dark:text-blue-500 hover:underline cursor-pointer"
                        onClick={() => deleteTeacher(teacher._id)}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="m-4">Loading....</p>
          )}
        </div>
      </div>
    </>
  );
}
