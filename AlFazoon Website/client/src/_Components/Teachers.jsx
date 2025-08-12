import React, { useEffect, useRef, useState } from "react";
import { BiSolidHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";

import swal from "sweetalert2";
import {
  addNewTeacher,
  DeleteTeacher,
  updateTeacher,
  GetAllTeachers,
} from "../Services/TeacherServices";
import PopUpMassage from "./PopUpMassage";

const initialContent = {
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
};

export default function Teachers() {
  const formRef = useRef(null);
  const [AllTeachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState(initialContent);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [popUpmsg, setpopUpmsg] = useState(false);
  const [actionmsg, setactionmsg] = useState("");

  // Function to fill data form to update
  const handleTeacherClick = (e, teacherDetails) => {
    e.preventDefault();
    setSelectedTeacher(teacherDetails);
    setFormData({
      ...initialContent,
      ...teacherDetails,
    });
  };

  // Function to collect data from inputs
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedTeacher) {
        // Update teacher logic
        await updateTeacher(selectedTeacher._id, formData);
        setactionmsg("Updating teacher success");

        // Reset form and clear selected teacher after updating
        formRef.current.reset();
        setFormData(initialContent);
        setSelectedTeacher(null); // Clear selected teacher after update
      } else {
        // Add new teacher logic
        const response = await addNewTeacher(formData);
        console.log("not_select");

        if (response.success) {
          setpopUpmsg(true);
          setactionmsg("Adding new teacher success");
          console.log("success");

          // Reset form only if adding the new teacher is successful
          formRef.current.reset();
          setFormData(initialContent);
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setactionmsg("An error occurred. Please try again.");
    }
    fetchTeachers();
  };

  // Load all teachers
  const fetchTeachers = async () => {
    try {
      const teachers = await GetAllTeachers();
      // console.log("Fetched Teachers: ", teachers); // Log before setting state
      setTeachers(teachers); // Update state with the latest teachers
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  // Confirm delete teacher
  const confirmDelete = (e, teacherId) => {
    e.preventDefault();
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
            await DeleteTeacher(teacherId); // Await the delete action
            setactionmsg("Deleting Teacher success");
            setpopUpmsg(true);
            fetchTeachers();
            // Fetch updated list after deletion
          } catch (error) {
            console.error("Error deleting student:", error);
          }
        }
      });
  };

  // handle show or hide password
  const [passwordstatus, showpassword] = useState(false);
  const handlepassword = () => {
    showpassword(!passwordstatus);
  };

  useEffect(() => {
    fetchTeachers(); // Initial fetch on component mount
  }, []);
  return (
    <section className="">
      {popUpmsg && <PopUpMassage children={actionmsg} />}
      <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8">
        <div className="mx-auto ">
          <h1 className="text-textColor text-xl font-medium py-2">Teachers</h1>
          <div className="bg-gray-100  p-4 rounded-lg">
            <div className="overflow-x-auto">
              <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                  <div className="overflow-x-auto h-[500px]">
                    {!AllTeachers?.length == 0 ? (
                      <table className="min-w-full  overflow-scroll divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="text-left text-[14px]">
                          <tr>
                            <th className="whitespace-nowrap  px-4 py-2 font-bold text-center text-textColor">
                              Name
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              Class Number
                            </th>

                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              Nationality
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              Mobile
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              Date of Joining
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              UserName
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              password
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-center text-textColor">
                              Delete
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                          {AllTeachers?.map((teacher) => (
                            <tr
                              className="odd:bg-gray-50 hover:odd:bg-400 cursor-pointer"
                              key={teacher._id}
                            >
                              <td
                                className="whitespace-nowrap px-4 py-2 font-medium  text-center  text-gray-900 hover:underline cursor-pointer hover:text-red-500"
                                onClick={(e) => handleTeacherClick(e, teacher)}
                              >
                                {teacher.firstName} {teacher.middleName}{" "}
                                {teacher.lastName}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                                {teacher.classID}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                                {teacher.nationality}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                                {teacher.phone}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                                {teacher.birthDay
                                  ? new Date(teacher.birthDay)
                                      .toISOString()
                                      .split("T")[0]
                                  : "N/A"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                                {teacher.userName}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                                {teacher.password}
                              </td>
                              <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                                <a
                                  href="#"
                                  onClick={(e) =>
                                    confirmDelete(e, teacher?._id)
                                  }
                                  className={
                                    "inline-block w-full rounded-md   text-[14px] px-2 py-1 font-medium text-white sm:w-auto bg-red-600 hover:bg-red-500 outline-none"
                                  }
                                >
                                  {" "}
                                  Delete
                                </a>
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center text-xl font-bold text-textColor">
                        There is No Teachers
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* start Teacher Form */}
        <div className=" gap-x-16 gap-y-8 md:py-8 py-4">
          <h1 className="text-textColor text-xl font-medium py-2">
            Teacher Form
          </h1>
          <div className="rounded-lg bg-gray-100 p-8 shadow-lg   lg:p-12">
            <form
              action="#"
              onSubmit={handleSubmit}
              ref={formRef}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="First Name"
                    type="text"
                    required
                    name="firstName"
                    onChange={handleChange}
                    value={formData.firstName}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Second Name"
                    type="text"
                    name="middleName"
                    onChange={handleChange}
                    value={formData.middleName}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Third Name"
                    type="text"
                    required
                    name="lastName"
                    onChange={handleChange}
                    value={formData.lastName}
                  />
                </div>

                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Age"
                    type="number"
                    required
                    min={0}
                    name="age"
                    onChange={handleChange}
                    value={formData.age}
                  />
                </div>

                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Date of join"
                    type="date"
                    required
                    name="birthDay"
                    onChange={handleChange}
                    value={
                      formData.birthDay
                        ? new Date(formData.birthDay)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"
                    }
                  />
                </div>

                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Address"
                    type="text"
                    required
                    name="address"
                    onChange={handleChange}
                    value={formData.address}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Nationality"
                    type="text"
                    required
                    name="nationality"
                    onChange={handleChange}
                    value={formData.nationality}
                  />
                </div>

                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Teaching Class Number"
                    type="number"
                    required
                    min={0}
                    name="classID"
                    onChange={handleChange}
                    value={formData.classID}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="mobile Number"
                    type="number"
                    required
                    min={0}
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="User Name"
                    type="text"
                    required
                    name="userName"
                    onChange={handleChange}
                    value={formData.userName}
                  />
                </div>
                <div className="relative">
                  <input
                    className="Dashboardinput"
                    placeholder="password"
                    type={`${passwordstatus ? "text" : "password"}`}
                    required
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                  />

                  <span className="absolute inset-y-0 end-0 text-xl grid place-content-center px-4 text-gray-400 cursor-pointer duration-200  hover:text-black">
                    {!passwordstatus ? (
                      <BiSolidHide onClick={handlepassword} />
                    ) : (
                      <BiShow onClick={handlepassword} />
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex md:flex-row flex-col items-center gap-5 py-3 ">
                <button
                  type="submit"
                  className={
                    "inline-block w-full rounded-lg hover:shadow-2xl   px-5 py-2 font-medium text-white sm:w-auto bg-green-600 hover:bg-green-500 outline-none"
                  }
                >
                  Add New Teacher
                </button>
                <button
                  className={
                    "inline-block w-full rounded-lg hover:shadow-2xl   px-5 py-2 font-medium text-white sm:w-auto bg-sky-600 hover:bg-sky-400 outline-none"
                  }
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
