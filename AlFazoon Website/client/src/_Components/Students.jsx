import React, { useRef, useState, useEffect } from "react";
import PopUpMassage from "./PopUpMassage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import swal from "sweetalert2";
import {
  addStudent,
  editStudent,
  getStudents,
  deleteStudent,
} from "../Services/StudentService";
import { GetAllTeachers } from "../Services/TeacherServices";
// import teachers from "../../../server/models/teachers";

const initialContent = {
  firstName: "",
  middleName: "",
  lastName: "",
  age: "",
  birthDay: "",
  address: "",
  nationality: "",
  ClassNum: "",
  TeacherName: "",
  whatsapp: "",
  phone: "",
};

export default function Students() {
  const FormRef = useRef(null);
  const [formData, setFormData] = useState(initialContent);
  const [selectedStudent, setselectedStudent] = useState("");
  const [AllStudents, setStudents] = useState([]);
  const [popUpmsg, setpopUpmsg] = useState(false);
  const [actionmsg, setactionmsg] = useState("");
  const [TeachersName, setTeachersName] = useState([]);

  // Function to get student data for updating
  const handleStudentClick = (e, StudentDetails) => {
    e.preventDefault();
    setselectedStudent(StudentDetails);
    setFormData({
      ...initialContent,
      ...StudentDetails,
    });
  };

  // Function to load all students
  const fetchStudents = async () => {
    try {
      const Students = await getStudents();
      setStudents(Students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  // Function to collect form data
  const handleChange = (e) => {
    if (e?.target) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    } else {
      // Handle phone input
      setFormData({ ...formData, whatsapp: e });
    }
  };

  // Function to format the date as YYYY/MM/DD
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // Function to execute submit action
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (selectedStudent) {
  //       await editStudent(selectedStudent._id, formData);
  //       setactionmsg("Updating teacher success");
  //       FormRef.current.reset();
  //       setFormData(initialContent);
  //       setselectedStudent(null);
  //     } else {
  //       const response = await addStudent(formData);

  //       if (response.success) {
  //         setactionmsg("Adding new teacher success");
  //         FormRef.current.reset();
  //         setFormData(initialContent);
  //         setselectedStudent(null);
  //       } else {
  //         setactionmsg("You should enter a different number");
  //       }
  //     }

  //     setpopUpmsg(true);
  //     fetchStudents(); // Fetch the updated list of teachers

  //     // Empty form and reset state
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedStudent) {
        // Update teacher logic
        await editStudent(selectedStudent._id, formData);
        setactionmsg("Updating student success");

        // Reset form and clear selected teacher after updating
        FormRef.current.reset();
        setFormData(initialContent);
        setselectedStudent(null); // Clear selected teacher after update
      } else {
        // Add new teacher logic
        const response = await addStudent(formData);

        if (response.success) {
          setpopUpmsg(true);
          setactionmsg("Adding new student success");
          console.log("success");

          // Reset form only if adding the new teacher is successful
          FormRef.current.reset();
          setFormData(initialContent);
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setactionmsg("An error occurred. Please try again.");
    }
    fetchStudents();
  };

  // Function to confirm delete student
  const confirmDelete = (e, StudentId) => {
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
            await deleteStudent(StudentId); // Await the delete action
            setactionmsg("Deleting student success");
            setpopUpmsg(true);
            fetchStudents();
            // Fetch updated list after deletion
          } catch (error) {
            console.error("Error deleting student:", error);
          }
        }
      });
  };
  // get all teachers Name
  const GetTeachersName = async () => {
    try {
      const teachers = await GetAllTeachers();
      setTeachersName(teachers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchStudents();
    GetTeachersName(); // Load students on component mount
  }, []);

  return (
    <section className="">
      {popUpmsg && <PopUpMassage children={actionmsg} />}
      <div className="mx-auto max-w-screen-xl px-4  sm:px-6 lg:px-8">
        <div className="mx-auto ">
          <h1 className="text-textColor text-xl font-medium py-2">Students</h1>
          <div className="bg-gray-100  p-4 rounded-lg">
            <div className="overflow-x-auto h-[500px] ">
              {!AllStudents.length == 0 ? (
                <table className="min-w-full  overflow-scroll bg-white border border-gray-300">
                  <thead className="bg-gray-200 text-[12px]">
                    <tr>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        name
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Age
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Class
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Joining Date
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Nationality
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Teacher
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Address
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        parent Number
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Whats Number
                      </th>
                      <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {AllStudents?.map((student) => (
                      <tr
                        className="odd:bg-gray-50 hover:odd:bg-400 cursor-pointer"
                        key={student._id}
                      >
                        <td
                          className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900 hover:underline hover:text-red-500  cursor-pointer  "
                          onClick={(e) => handleStudentClick(e, student)}
                        >
                          {student.firstName} {student.middleName}{" "}
                          {student.lastName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.age}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.ClassNum}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.birthDay
                            ? new Date(student.birthDay)
                                .toISOString()
                                .split("T")[0]
                            : ""}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.nationality}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.TeacherName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.address}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                          {student.whatsapp}
                        </td>
                        <th className="px-4 py-2 border-b-2 border-gray-300 text-center">
                          <a
                            href="#"
                            onClick={(e) => confirmDelete(e, student?._id)}
                            className={
                              "inline-block w-full rounded-md hover:shadow-2xl  text-[14px] px-2 py-1 font-medium text-white sm:w-auto bg-red-600 hover:bg-red-500 outline-none"
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
                  There is No Students
                </p>
              )}
            </div>
          </div>
        </div>
        <div className=" gap-x-16 gap-y-8  md:py-8 py-4">
          <h1 className="text-textColor text-xl font-medium py-2">
            Student Form
          </h1>
          <div className="rounded-lg bg-gray-100 p-8 shadow-lg   lg:p-12">
            <form
              action="#"
              className="space-y-4"
              onSubmit={handleSubmit}
              ref={FormRef}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="">
                  <input
                    onChange={handleChange}
                    value={formData.firstName}
                    name="firstName"
                    className="Dashboardinput"
                    placeholder="First Name"
                    type="text"
                    required
                  />
                </div>
                <div className="">
                  <input
                    onChange={handleChange}
                    value={formData.middleName}
                    name="middleName"
                    className="Dashboardinput"
                    placeholder="Second Name"
                    type="text"
                  />
                </div>
                <div className="">
                  <input
                    onChange={handleChange}
                    value={formData.lastName}
                    name="lastName"
                    className="Dashboardinput"
                    placeholder="Last Name"
                    type="text"
                    required
                  />
                </div>

                <div>
                  <input
                    onChange={handleChange}
                    value={formData.age}
                    name="age"
                    className="Dashboardinput"
                    placeholder="Age"
                    type="number"
                    required
                    min={0}
                  />
                </div>

                <div>
                  <input
                    onChange={handleChange}
                    value={formData.TeacherName}
                    name="TeacherName"
                    className="Dashboardinput"
                    placeholder="Teacher Name"
                    type="text"
                    required
                  />
                  <div>
                    {/* <select
                      name="HeadlineAct"
                      id="HeadlineAct"
                      className=" py-3 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                    >
                      {TeachersName?.map((teacher) => (
                        <option
                          key={teacher._id}
                          onChange={handleChange}
                          className="Dashboardinput"
                          placeholder="Teacher Name"
                          value={formData.TeacherName}
                        >{`${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`}</option>
                      ))}
                    </select> */}
                  </div>
                </div>

                <div>
                  <input
                    onChange={handleChange}
                    value={formData.ClassNum}
                    name="ClassNum"
                    className="Dashboardinput"
                    placeholder="Class Num "
                    type="number"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <input
                    onChange={handleChange}
                    value={formData.nationality}
                    name="nationality"
                    className="Dashboardinput"
                    placeholder="Nationality"
                    type="text"
                    required
                  />
                </div>

                <div>
                  <input
                    className="Dashboardinput"
                    value={formData.address}
                    placeholder="Address"
                    type="text"
                    onChange={handleChange}
                    name="address"
                    required
                  />
                </div>
                <div>
                  <PhoneInput
                    containerClass="flex items-center border-none rounded-lg "
                    inputClass="w-full bg-transparent focus:outline-none  py-2 !h-auto"
                    buttonClass="border-r border-gray-100 "
                    className="w-full "
                    placeholder="Whats app Number"
                    country={"eg"}
                    min={0}
                    onChange={handleChange}
                    name="whatsapp"
                    value={formData.whatsapp}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    placeholder="Parent Number"
                    value={formData.phone}
                    name="phone"
                    type="number"
                    required
                    min={0}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    className="Dashboardinput"
                    value={
                      formData.birthDay ? (
                        new Date(formData.birthDay).toISOString().split("T")[0]
                      ) : (
                        <span>N/A</span>
                      )
                    }
                    type="date"
                    required
                    min={0}
                    onChange={handleChange}
                    name="birthDay"
                  />
                </div>
              </div>

              <div className="mt-4 flex md:flex-row flex-col items-center gap-5 py-3 ">
                <button
                  type="submit"
                  className={
                    "inline-block w-full rounded-lg hover:shadow-2xl   px-5 py-2 font-medium text-white sm:w-auto bg-green-600 hover:bg-green-500 outline-none"
                  }
                >
                  Add New Student
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
