import { HiMiniSpeakerWave } from "react-icons/hi2";
import { useState } from "react";
import { getItem } from "../Services/TutorialService";

export default function AqidahComponent({
  aqidahNumber,
  aqidahqusetion,
  aqidahAnswer,
  aqidahId,
  isPlaying,
  onPlayAudio,
}) {
  const api = import.meta.env.VITE_API_UPLOADS_URL;
  const [aqidahVoice, setaqidahVoice] = useState(null);
  const [loading, setLoading] = useState(false);
  // get Hadith data
  const getAqidahqusetion = async (aqidahId) => {
    if (aqidahVoice) return; // Already fetched
    setLoading(true);
    try {
      const data = await getItem("aqidahs", aqidahId);
      setaqidahVoice(data.voice.path);
    } catch (error) {
      console.error("Failed to fetch aqidah audio:", error);
    } finally {
      setLoading(false);
    }
  };
  // handle play one sound
  const handleAudioClick = () => {
    onPlayAudio(aqidahId); // Notify parent about the play request
    getAqidahqusetion(aqidahId);
  };

  return (
    <>
      <div className="grid grid-cols-12  border border-[#005a8c] border-solid bg-[#EEF4F8] mt-[20px] rounded-[10px] p-[10px]">
        <div className="lg:p-[10px] text-[19px] text-left col-span-12">
          <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-1  ">
            <span className="font-semibold font-arabic text-xl capitalize text-slate-600">
              - Q{aqidahNumber}
            </span>

            <div className="flex flex-row justify-end">
              {isPlaying && aqidahVoice ? (
                <audio
                  controls
                  aria-label={`Audio for hadith ${aqidahNumber}`}
                  autoPlay
                  className="bg-gray-100 border border-[#bebebe] rounded-lg shadow-lg p-2"
                >
                  <source src={`${api}/${aqidahVoice}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div
                  className={`bg-[#005a8c] text-[#FFFFFF] lg:px-[20px] px-[10px] lg:py-[5px] py-[2px] text-right rounded-[5px] font-semibold text-lg flex flex-row items-center justify-end gap-2 cursor-pointer hover:bg-[#343746] transition-all ease-in-out duration-300 ${
                    loading ? "opacity-50" : ""
                  }`}
                  onClick={handleAudioClick}
                  disabled={loading}
                >
                  <HiMiniSpeakerWave />

                  {loading
                    ? "جاري التحميل..."
                    : isPlaying
                    ? "توقف"
                    : "إستمع الأن"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end p-[10px]  col-span-12">
          <div className="md:text-[20px] text-[18px] text-right text-[#f21d44] font-semibold font-english">
            <p>{aqidahqusetion} ؟ -</p>
          </div>
          <div className="md:text-[19px] text-[17px]      text-right text-slate-700 lg:font-thin font-semibold font-arabic ">
            <p>{aqidahAnswer}</p>
          </div>
        </div>
      </div>
    </>
  );
}
