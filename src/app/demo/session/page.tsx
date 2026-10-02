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

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "Ananya",
    text: "Hello Aarav! Welcome to your trial session. Can you see the whiteboard clearly?",
    time: "4:01 PM",
  },
  {
    id: 2,
    sender: "Aarav",
    text: "Yes ma'am, perfectly clear.",
    time: "4:01 PM",
  },
  {
    id: 3,
    sender: "Ananya",
    text: "Excellent! Let's explore quadratic equations with our visual problem solving method.",
    time: "4:03 PM",
  },
];

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function DemoSessionPage() {
  const router = useRouter();

  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(245); // ~4m 5s into demo
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "Aarav",
      text: message.trim(),
      time: "4:05 PM",
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  }

  function handleEndSession() {
    router.push("/demo/feedback");
  }

  return (
    <div className="flex h-screen flex-col bg-[#0b0f19] text-white overflow-hidden">
      {/* Top Session Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Logo compact />
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="hidden sm:block">
            <span className="font-bold text-xs text-slate-200">
              Mathematics Demo &bull; Ananya Sharma
            </span>
          </div>
        </div>

        {/* Elapsed Timer & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{formatElapsed(elapsedSeconds)} / 30:00</span>
          </div>

          <button
            type="button"
            onClick={() => setLeaveDialogOpen(true)}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs"
          >
            End Demo
          </button>
        </div>
      </header>

      {/* Main Video Workspace + Chat Drawer */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Tutor Stream (Main Stage) */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center p-3 sm:p-5">
          <div className="relative h-full w-full max-w-5xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center">
            {/* Tutor Video Stream Mock */}
            <div
              role="img"
              aria-label="Tutor teaching live on video"
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
              }}
            />

            {/* Tutor Name Overlay */}
            <div className="absolute top-4 left-4 rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 border border-slate-700/60">
              <span>Ananya Sharma (Tutor)</span>
              <IconShieldCheck size={14} className="text-emerald-400" />
            </div>

            {/* Screen Share Mock Banner if active */}
            {screenSharing && (
              <div className="absolute top-4 right-4 rounded-xl bg-blue-600/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                <IconScreenShare size={14} />
                <span>Sharing Interactive Canvas</span>
              </div>
            )}

            {/* Student Picture-in-Picture (PiP) */}
            <div className="absolute bottom-4 right-4 h-28 w-40 sm:h-36 sm:w-52 rounded-xl border border-slate-700 bg-slate-800 shadow-xl overflow-hidden">
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
                <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-bold text-slate-400">
                  Camera off
                </div>
              )}
              <div className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                You (Aarav)
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Chat Drawer */}
        {chatOpen && (
          <aside className="w-80 shrink-0 border-l border-slate-800 bg-slate-900 flex flex-col z-10">
            <div className="flex h-12 items-center justify-between border-b border-slate-800 px-4">
              <span className="text-xs font-bold text-slate-200">Session Chat</span>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl p-3 text-xs ${
                    m.sender === "Aarav"
                      ? "bg-blue-600 text-white ml-6"
                      : "bg-slate-800 text-slate-200 mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] opacity-75">
                    <span className="font-bold">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-slate-800 p-3 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a doubt..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 shrink-0"
              >
                <IconSend size={15} />
              </button>
            </form>
          </aside>
        )}
      </main>

      {/* Bottom Floating Control Bar */}
      <footer className="h-16 shrink-0 border-t border-slate-800 bg-slate-900/90 px-4 flex items-center justify-center gap-3 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={() => setMicrophoneOn(!microphoneOn)}
          title={microphoneOn ? "Mute" : "Unmute"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            microphoneOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {microphoneOn ? <IconMic size={18} /> : <IconMicOff size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setCameraOn(!cameraOn)}
          title={cameraOn ? "Stop Video" : "Start Video"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            cameraOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {cameraOn ? <IconVideo size={18} /> : <IconVideoOff size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setScreenSharing(!screenSharing)}
          title={screenSharing ? "Stop Sharing" : "Share Screen"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            screenSharing ? "bg-blue-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
          }`}
        >
          <IconScreenShare size={18} />
        </button>

        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          title="Toggle Chat"
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            chatOpen ? "bg-blue-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
          }`}
        >
          <IconMessageSquare size={18} />
        </button>

        <button
          type="button"
          onClick={() => setLeaveDialogOpen(true)}
          className="flex h-11 px-5 items-center justify-center rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition gap-1.5 shadow-sm ml-2"
        >
          <IconPhone size={15} />
          <span>Leave Session</span>
        </button>
      </footer>

      {/* Leave Confirmation Dialog */}
      {leaveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
            <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-white">
              End Demo Session?
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              You will be redirected to leave feedback and explore class packages.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaveDialogOpen(false)}
                className="btn btn-secondary text-xs font-bold"
              >
                Continue Demo
              </button>
              <button
                type="button"
                onClick={handleEndSession}
                className="btn btn-primary bg-rose-600 hover:bg-rose-700 border-transparent text-xs font-bold"
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