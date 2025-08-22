import studentImg from "/images/Overview/students.webp";
import TeacgerImg from "/images/Overview/teachers.webp";
import creadImg from "/images/Overview/cread.webp";
import tawheedImg from "/images/Overview/tawheed.jpg";

import DuasImg from "/images/Overview/duas.webp";
import HadithImg from "/images/Overview/hadith.webp";
import AzkarImg from "/images/Overview/Azkar.jpg";
import NawawiImg from "/images/Overview/40Nawiwai.webp";
import { useEffect, useState } from "react";
import { getCount } from "../../../Services/TutorialService";
import { getTeachersCount } from "../../../Services/TeacherServices";
import { getStudentsCount } from "../../../Services/StudentService";

export default function Overview() {
  const [categories, setCategories] = useState([]);
  const [Teachers, setTeachersCount] = useState(null);
  const [Students, setStudentsCount] = useState(null);
  const categoryNames = [
    { endpoint: 'hadiths', name: "hadith", img: HadithImg },
    { endpoint: 'azkars', name: "azkar", img: AzkarImg },
    { endpoint: 'douas', name: "doua", img: DuasImg },
    { endpoint: 'arboonNawwis', name: "arboon Nawwi", img: NawawiImg },
    { endpoint: 'aqidahs', name: "aqidah", img: creadImg },
    { endpoint: 'tawheeds', name: "tawheed", img: tawheedImg },
    { endpoint: 'feqhs', name: "fiqh", img: creadImg },
    { endpoint: 'arboonNawwis', name: "Prophet Stories", img: NawawiImg },
    { endpoint: 'sahabaaStories', name: "Companions Stories", img: NawawiImg },

  ];
  const OtherFields = [
    {
      name: "Teachers",
      count: Teachers?.count,
      Img: TeacgerImg,
    },
    { name: "Students", count: Students?.count, Img: studentImg },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await Promise.all(
          categoryNames?.map(async (category) => {
            const count = await getCount(category.endpoint);
            return {
              name: category.name,
              count,
              img: category.img,
            };
          })
        );
        setCategories(categoryData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const students = await getStudentsCount();
        const teachers = await getTeachersCount();

        setStudentsCount(students);
        setTeachersCount(teachers);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="py-14 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {OtherFields?.map((category, index) => (
        <div
          key={index}
          className="relative w-full h-[250px] bg-cover bg-center cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${category.Img})` }}
        >
          {/* Lighter Overlay with Dark Background */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>

          {/* Content with Better Font Style and Colors */}
          <div className="relative z-10 flex flex-col justify-center h-full p-6">
            <h2 className="text-2xl capitalize  text-white font-sans font-semibold">
              {category.name}
            </h2>
            <span className="text-lg font-normal text-slate-100">
              {category?.count || 0} entries
            </span>
          </div>
        </div>
      ))}
      {categories?.map((category, index) => (
        <div
          key={index}
          className="relative w-full h-[250px] bg-cover bg-center cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: `url(${category.img})` }}
        >
          {/* Lighter Overlay with Dark Background */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>

          {/* Content with Better Font Style and Colors */}
          <div className="relative z-10 flex flex-col justify-center h-full p-6">
            <h2 className="text-2xl capitalize  text-white font-sans font-semibold">
              {category.name}
            </h2>
            <span className="text-lg font-normal text-slate-100">
              {category?.count?.count || 0} entries
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
