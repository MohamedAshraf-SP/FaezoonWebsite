import React, { useEffect, useState } from "react";

import { FaUserTie } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { getStudentsCount } from "../Services/StudentService";
import { getTeachersCount } from "../Services/TeacherServices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OverView() {
  const [StudentsCount, setStudentsCount] = useState(0);
  const [TeacherssCount, setTeacherssCount] = useState(0);
  // Function to get all student count
  const fetchStudents = async () => {
    try {
      const data = await getStudentsCount();
      setStudentsCount(data.count);
    } catch (error) {
      console.error("Error fetching student count:", error);
    }
  };
  // Function to get all Teachers count
  const fetchTeachers = async () => {
    try {
      const data = await getTeachersCount();
      setTeacherssCount(data?.count);
    } catch (error) {
      // console.error("Error fetching student count:", error);
    }
  };
  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  return (
    <div className="flex md:flex-row flex-col items-center gap-10 justify-center">
      {StudentsCount ? (
        <div className="bg-white border border-solid border-slate-200 rounded-2xl">
          <div className="flex flex-col items-center gap-2 w-40 h-40 p-3">
            <h1 className="capitalize text-gray-400 text-xl">Total Students</h1>
            <span className="text-xl text-textColor font-semibold py-1">
              {StudentsCount > 0 ? StudentsCount : <Skeleton height={30} />}
            </span>
            <div className="bg-PrimaryColor w-10 h-10 rounded-full flex items-center justify-center">
              <FaUserTie className="text-white" />
            </div>
          </div>
        </div>
      ) : (
        <Skeleton height={160} width={130} />
      )}
      {TeacherssCount ? (
        <div className="bg-white border border-solid border-slate-200 rounded-2xl">
          <div className="flex flex-col items-center gap-2 w-40 h-40 p-3">
            <h1 className="capitalize text-gray-400 text-xl">Total Teachers</h1>
            <span className="text-xl text-textColor font-semibold py-1">
              {TeacherssCount > 0 ? TeacherssCount : "No teacher"}
            </span>
            <div className="bg-PrimaryColor w-10 h-10 rounded-full flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
          </div>
        </div>
      ) : (
        <Skeleton height={160} width={130} />
      )}
    </div>
  );
}
