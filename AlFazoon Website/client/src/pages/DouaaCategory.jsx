import React, { useEffect, useState } from "react";
// load images
import deathimg from "/images/Douaa/deathDuaa.webp";
import qurandua from "/images/Douaa/quranic_duas.webp";
import sunnahDua from "/images/Douaa/sunnah-Duaa.webp";
import otherDaua from "/images/Douaa/Other duas.png";
import NewCategory from "/images/Douaa/another.webp";
// import defaultImg from "/images/Douaa/defaultDuaa.webp" // Uncomment this line for default image
// import components
import NewNavbar from "../_Components/NewNavbar";
import FixedHeader from "../_Components/FixedHeader";
import { getDuaaCategories } from "../Services/TutorialService";
import { useNavigate } from "react-router-dom";
export default function DouaaCategory() {
  const DuaaImgs = [deathimg, qurandua, sunnahDua, otherDaua];
  const [skeletonLoading, setSkeltonLoading] = useState(false);
  const [categories, setcategories] = useState([]);
  const navigate = useNavigate();
  // Fetch Duaa Category
  const fetchDuaaCategories = async () => {
    try {
      setSkeltonLoading(true);
      const categoryNames = await getDuaaCategories("douas");
      const categoryData = await Promise.all(
        categoryNames?.map(async (category, index) => {
          const image = DuaaImgs[index]; // Use defaultImg if you have a fallback
          return { name: category, image };
        })
      );
      setcategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setSkeltonLoading(false);
    }
  };
  const handleCategoryClick = (categoryName) => {
    navigate(`/Tutorials/douas/${categoryName}`);
  };
  useEffect(() => {
    fetchDuaaCategories();
  }, []);

  return (
    <>
      <NewNavbar />
      <FixedHeader subtitle={"Douaa"} />
      <div className="py-10 container mx-auto">
        <h1 className="text-black text-center lg:text-3xl text-xl font-serif font-medium pt-3 pb-8">
          Duaa Categories
        </h1>
        {skeletonLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton Loading */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="py-4 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category, index) => (
              <div
                onClick={() => handleCategoryClick(category.name)}
                key={index}
                className="flex flex-col items-center rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-md transition-transform duration-300 ease-in-out hover:scale-105">
                  {category.name ? (
                    <img
                      src={category.image}
                      alt={`${category.name} category`}
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={NewCategory}
                      alt="No Name category"
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  )}
                </div>
                <div className="py-4 text-[16px] text-slate-900 font-semibold">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
