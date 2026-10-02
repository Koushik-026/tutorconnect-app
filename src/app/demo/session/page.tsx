"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconMic,
  IconMicOff,
  IconVideo,
  IconVideoOff,
  IconScreenShare,
  IconMessageSquare,
  IconX,
  IconSend,
  IconShieldCheck,
  IconPhone,
} from "@/components/ui/icons";

type ChatMessage = {
  id: number;
  sender: "Ananya" | "Aarav";
  text: string;
  time: string;
};

export default function DemoSessionPage() {
  const router = useRouter();

  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 minutes
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "Ananya",
      text: "Hi Aarav! Welcome to our demo class. Let's start with quadratic roots.",
      time: "04:30 PM",
    },
    {
      id: 2,
      sender: "Aarav",
      text: "Hello ma'am, yes! I struggle with factoring when coefficients are negative.",
      time: "04:31 PM",
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "Aarav",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const handleEndSession = () => {
    router.push("/demo/feedback");
  };

  return (
    <div className="flex h-screen flex-col bg-[#F7F4EE] text-[#232520] overflow-hidden">
      {/* Light Paper Bloom Header */}
      <header className="h-14 shrink-0 border-b border-[#E4DED4] bg-[#FFFEFB] px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="hidden sm:flex items-center gap-2 border-l border-[#E4DED4] pl-3 text-xs">
            <span className="font-bold text-[#232520]">Ananya Sharma</span>
            <span className="text-[#676B64]">&bull; Grade 10 Mathematics</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F7867]">
              <IconShieldCheck size={13} />
              Verified Demo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light Timer Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#B7A5DE]/40 bg-[#EFEAF8] px-3 py-1 text-xs font-bold text-[#66518A]">
            <span className="h-2 w-2 rounded-full bg-[#66518A] animate-pulse" />
            <span>Time Left: {formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setLeaveDialogOpen(true)}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            End Demo
          </button>
        </div>
      </header>

      {/* Main Classroom Area: Center Stage is High-Contrast Video Viewport */}
      <main id="main-content" className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 p-3 sm:p-4 flex flex-col items-center justify-center">
          {/* Main Video Viewport (Dark/Neutral for optimal educational contrast) */}
          <div className="relative w-full h-full max-h-[82vh] rounded-2xl bg-[#181A18] overflow-hidden flex items-center justify-center shadow-lg border border-[#E4DED4]">
            {/* Tutor Main Avatar / Feed */}
            <div className="flex flex-col items-center text-center p-6">
              <div
                role="img"
                aria-label="Ananya Sharma"
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-[#66518A]/50 bg-cover bg-center shadow-md"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80')",
                }}
              />
              <p className="mt-4 font-[family-name:var(--font-manrope)] text-lg font-bold text-white">
                Ananya Sharma
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#E6F0EA] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#4F7867] animate-pulse" />
                Live 1-on-1 Interactive Demo
              </div>
            </div>

            {/* Tutor Name Overlay Badge */}
            <div className="absolute top-4 left-4 rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
              <span>Ananya Sharma (Tutor)</span>
              <IconShieldCheck size={14} className="text-[#4F7867]" />
            </div>

            {/* Screen Share Mock Banner if active */}
            {screenSharing && (
              <div className="absolute top-4 right-4 rounded-xl bg-[#66518A]/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                <IconScreenShare size={14} />
                <span>Sharing Interactive Canvas</span>
              </div>
            )}

            {/* Student Picture-in-Picture (PiP) */}
            <div className="absolute bottom-4 right-4 h-28 w-40 sm:h-36 sm:w-52 rounded-xl border border-white/20 bg-[#232520] shadow-xl overflow-hidden">
              {cameraOn ? (
                <div
                  role="img"
                  aria-label="Student video preview"
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=600&q=80')",
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#676B64]">
                  Camera off
                </div>
              )}
              <div className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                You (Aarav)
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Chat Drawer: Light Paper Bloom Styling */}
        {chatOpen && (
          <aside className="w-80 shrink-0 border-l border-[#E4DED4] bg-[#FFFEFB] flex flex-col z-10 shadow-lg">
            <div className="flex h-12 items-center justify-between border-b border-[#E4DED4] px-4">
              <span className="text-xs font-bold text-[#232520]">Session Chat</span>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-[#676B64] hover:text-[#232520]"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F4EE]/40">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl p-3 text-xs ${
                    m.sender === "Aarav"
                      ? "bg-[#66518A] text-white ml-6 shadow-xs"
                      : "bg-[#FFFEFB] text-[#232520] mr-6 border border-[#E4DED4] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] opacity-80">
                    <span className="font-bold">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-[#E4DED4] p-3 flex gap-2 bg-[#FFFEFB]">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask doubt or share equation..."
                className="flex-1 rounded-xl border border-[#E4DED4] bg-[#F7F4EE] px-3 py-2 text-xs text-[#232520] placeholder:text-[#676B64] focus:outline-hidden focus:border-[#66518A]"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#66518A] text-white hover:bg-[#4E3C70] shrink-0"
              >
                <IconSend size={15} />
              </button>
            </form>
          </aside>
        )}
      </main>

      {/* Bottom Floating Control Bar: Light Paper Bloom Controls */}
      <footer className="h-16 shrink-0 border-t border-[#E4DED4] bg-[#FFFEFB]/95 px-4 flex items-center justify-center gap-3 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={() => setMicrophoneOn(!microphoneOn)}
          title={microphoneOn ? "Mute" : "Unmute"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            microphoneOn
              ? "bg-[#F7F4EE] border border-[#E4DED4] text-[#232520] hover:bg-[#EFEAF8] hover:text-[#66518A]"
              : "bg-rose-600 text-white"
          }`}
        >
          {microphoneOn ? <IconMic size={18} /> : <IconMicOff size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setCameraOn(!cameraOn)}
          title={cameraOn ? "Stop Video" : "Start Video"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            cameraOn
              ? "bg-[#F7F4EE] border border-[#E4DED4] text-[#232520] hover:bg-[#EFEAF8] hover:text-[#66518A]"
              : "bg-rose-600 text-white"
          }`}
        >
          {cameraOn ? <IconVideo size={18} /> : <IconVideoOff size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setScreenSharing(!screenSharing)}
          title={screenSharing ? "Stop Sharing" : "Share Screen"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            screenSharing
              ? "bg-[#66518A] text-white"
              : "bg-[#F7F4EE] border border-[#E4DED4] text-[#232520] hover:bg-[#EFEAF8] hover:text-[#66518A]"
          }`}
        >
          <IconScreenShare size={18} />
        </button>

        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          title="Toggle Chat"
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            chatOpen
              ? "bg-[#66518A] text-white"
              : "bg-[#F7F4EE] border border-[#E4DED4] text-[#232520] hover:bg-[#EFEAF8] hover:text-[#66518A]"
          }`}
        >
          <IconMessageSquare size={18} />
        </button>

        <button
          type="button"
          onClick={() => setLeaveDialogOpen(true)}
          className="flex h-11 px-5 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition gap-1.5 shadow-xs ml-2"
        >
          <IconPhone size={15} />
          <span>Conclude Demo</span>
        </button>
      </footer>

      {/* Leave Confirmation Dialog: Light Paper Bloom */}
      {leaveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 text-center shadow-xl">
            <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
              End Demo Session?
            </h3>
            <p className="mt-2 text-xs text-[#676B64] leading-relaxed">
              You will be redirected to leave feedback and explore personalized class packages.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaveDialogOpen(false)}
                className="rounded-xl border border-[#E4DED4] bg-[#FFFEFB] py-2.5 text-xs font-bold text-[#232520] hover:bg-[#F7F4EE] transition-colors"
              >
                Continue Demo
              </button>
              <button
                type="button"
                onClick={handleEndSession}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white transition-colors"
              >
                Conclude Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
