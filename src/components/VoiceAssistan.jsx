import { Mic, Loader2, AlertTriangle } from "lucide-react";

export default function VoiceAssistant({ volume = 0, state = "listening" }) {
    
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-24 h-24 flex items-center justify-center">

        {/* --- LISTENING STATE --- */}
        {state === "listening" && (
          <>
            <div className="absolute w-24 h-24 rounded-full bg-blue-400 opacity-50 animate-ping"></div>
            <div className="absolute w-20 h-20 rounded-full bg-blue-500 animate-pulse"></div>
            <div
              className="w-16 h-16 rounded-full bg-blue-600 transition-transform duration-200 flex items-center justify-center text-white"
              style={{ transform: `scale(${1 + volume * 0.5})` }}
            >
              <Mic size={28} />
            </div>
          </>
        )}

        {/* --- PROCESSING STATE --- */}
        {state === "processing" && (
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <Loader2 className="animate-spin" size={28} />
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {state === "error" && (
          <div className="w-16 h-16 rounded-full bg-red-600 animate-pulse flex items-center justify-center text-white">
            <AlertTriangle size={28} />
          </div>
        )}

      </div>
    </div>
  );
}
