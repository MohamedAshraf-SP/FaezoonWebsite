// import images
import imgsunnah from "/images/Hadith/hadith_icon2_huge.png";
// import icons
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { useState } from "react";
import { getItem } from "../Services/TutorialService";

export default function DuaComponent({
  DuaNumber,
  DuaName,
  DuaArabic,
  DuaEnglish,
  DuaId,
  isPlaying,
  onPlayAudio,
}) {
  const api = import.meta.env.VITE_API_UPLOADS_URL;
  const [hadithVoice, setHadithVoice] = useState(null);
  const [loading, setLoading] = useState(false);
  // get Hadith data
  const getHadith = async (DuaId) => {
    if (hadithVoice) return; // Already fetched
    setLoading(true);
    try {
      const data = await getItem("douas", DuaId);
      setHadithVoice(data.voice.path);
    } catch (error) {
      console.error("Failed to fetch hadith audio:", error);
    } finally {
      setLoading(false);
    }
  };
  // handle play one sound
  const handleAudioClick = () => {
    onPlayAudio(DuaId); // Notify parent about the play request
    getHadith(DuaId);
  };

  return (
    <div className="grid grid-cols-12 border border-[#005a8c] border-solid bg-[#EEF4F8] mt-[20px] rounded-[10px] p-[10px]">
      <div className="lg:p-[10px] text-[19px] text-left md:col-span-6 col-span-12">
        <div className="flex flex-row lg:items-center items-start  justify-start gap-1 py-[5px]">
          <div className="w-8 h-8 overflow-hidden hidden md:block">
            <img
              src={imgsunnah}
              alt={`Hadith icon for ${DuaNumber}`}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-row items-center justify-center ">
            <span className=" font-arabic text-xl">{DuaNumber} - </span>
            <h4 className="lg:text-lg text-[14px] font-sans font-bold text-[#1d455c]">
              &nbsp;{DuaName}
            </h4>
          </div>
        </div>

        <div className="md:text-[19px] text-[15px] lg:py-4 py-2 leading-relaxed text-left text-slate-800 font-thin font-english">
          <p>{DuaEnglish}</p>
        </div>
      </div>

      <div className="flex flex-col items-end p-[10px] md:col-span-6 col-span-12">
        {isPlaying && hadithVoice ? (
          <audio
            controls
            aria-label={`Audio for hadith ${DuaNumber}`}
            autoPlay
            className="bg-gray-100 border border-[#bebebe] rounded-lg shadow-lg p-2"
          >
            <source src={`${api}/${hadithVoice}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div
            className={`bg-[#005a8c] text-[#FFFFFF] px-[20px] py-[5px] text-right rounded-[5px] font-semibold text-lg flex flex-row items-center justify-end gap-2 cursor-pointer hover:bg-[#343746] transition-all ease-in-out duration-300 ${
              loading ? "opacity-50" : ""
            }`}
            onClick={handleAudioClick}
            disabled={loading}
          >
            <HiMiniSpeakerWave />

            {loading ? "جاري التحميل..." : isPlaying ? "توقف" : "إستمع الأن"}
          </div>
        )}
        <div className="md:text-[19px] text-[15px] leading-relaxed lg:py-4 py-4 text-right text-slate-800 font-thin font-arabic ">
          <p>{DuaArabic}</p>
        </div>
      </div>
    </div>
  );
}
