import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { getItem } from "../Services/TutorialService";
export default function AkidahComponent({
  aqidahNumber,
  aqidahqusetionA,
  aqidahAAnswer,
  aqidahqusetionE,
  aqidahEAnswer,
  aqidahId,
  isPlaying,
  onPlayAudio,
}) {
  const [collapes, setcollabse] = useState("");
  // Handle show and hide collapde
  const handleCollapse = (Itemid) => {
    setcollabse(Itemid === collapes ? null : Itemid);
  };
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
    <div className="py-4 px-4 bg-white shadow-md rounded-2xl my-10">
      <div className="flex  flex-col items-end gap-4 py-2 ">
        <div className="flex flex-row justify-start items-center w-full">
          {isPlaying && aqidahVoice ? (
            <audio
              controls
              aria-label={`Audio for hadith ${aqidahNumber}`}
              autoPlay
              className="bg-gray-100 border border-[#dad8d8] rounded-lg shadow-md p-1"
            >
              <source src={`${api}/${aqidahVoice}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div
              className={`  ${loading ? "opacity-50" : ""}`}
              onClick={handleAudioClick}
              disabled={loading}
            >
              <HiMiniSpeakerWave className="text-2xl text-[#50a2e6] cursor-pointer" />

              {loading ? "جاري التحميل..." : ""}
            </div>
          )}
        </div>

        <div className=" flex flex-row items-start justify-start gap-2">
          <div className="text-[#757575] font-bold text-[17px] flex flex-col  ">
            <p className="text-left flex flex-row   ">
              <span> Q{aqidahNumber} </span> - {`${aqidahqusetionE} ?`}
            </p>
            <p className="text-right flex flex-row  justify-end  ">
              : {`${aqidahqusetionA} ؟`}
              <span>&nbsp;- س{aqidahNumber} </span>
            </p>
          </div>
          <div className="font-bold ">
            {collapes === aqidahId ? (
              <span
                className="bg-[#B6CDFC] text-[#65ade7] block p-1 cursor-pointer rounded-md hover:bg-[#65ade7] hover:text-white transition-all ease-in-out duration-300"
                onClick={() => handleCollapse("")}
              >
                <FaMinus />
              </span>
            ) : (
              <span
                className="bg-[#ECF2FE] text-[#65ade7] block p-1 cursor-pointer rounded-md hover:bg-[#65ade7] hover:text-white transition-all ease-in-out duration-300"
                onClick={() => handleCollapse(aqidahId)}
              >
                <FaPlus />
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex  justify-end items-center    border-t border-solid border-[#F2F2F2] overflow-hidden transition-all ease-in-out duration-500 ${
          collapes === aqidahId ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex lg:flex-row items-center justify-between ">
          <p className=" text-xl py-4 text-slate-700 font-thin text-left">
            - {aqidahEAnswer}
          </p>
          <p className=" text-xl py-4 text-slate-700 font-thin text-right">
            ج - {aqidahAAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}
