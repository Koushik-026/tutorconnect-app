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
    <div className="flex h-screen flex-col bg-[#FCFBF8] text-[#20221F] overflow-hidden">
      {/* Light Clean Header */}
      <header className="h-16 shrink-0 border-b border-[rgba(54,48,60,0.08)] bg-white px-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden sm:inline-block h-4 w-px bg-[rgba(54,48,60,0.12)]" />
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#EEE7FF] px-3 py-0.5 text-xs font-bold text-[#594282]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7257A5]" />
            <span>Demo: Quadratic Equations</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[#FFFDF9] border border-[rgba(54,48,60,0.10)] px-3.5 py-1 text-xs font-extrabold text-[#20221F]">
            <span className="h-2 w-2 rounded-full bg-[#5D806F] animate-pulse" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setLeaveDialogOpen(true)}
            className="btn btn-outline min-h-[38px] px-4 text-xs font-bold text-[#C84B31] border-[#C84B31]/30 hover:bg-[#FCEEEA] rounded-full"
          >
            End Demo
          </button>
        </div>
      </header>

      {/* Main Classroom Split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Large Classroom Viewport (Video Viewport is appropriately dark for video clarity) */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-[#1E201D] text-white flex flex-col justify-between p-5 border border-[rgba(54,48,60,0.12)] shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            {/* Top Bar inside Viewport */}
            <div className="flex items-center justify-between text-xs text-white/80 z-10">
              <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-[#5D806F]" />
                <span className="font-semibold">Tutor: Ananya Sharma</span>
              </div>
              <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 font-bold text-[11px]">
                Interactive Whiteboard Mode
              </span>
            </div>

            {/* Whiteboard Workspace Simulation */}
            <div className="my-auto max-w-lg mx-auto text-center space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wider text-[#EEE7FF] font-bold">Concept Exercise</p>
                <p className="text-lg font-bold mt-2 font-mono text-white">ax² + bx + c = 0</p>
                <p className="text-xs text-white/70 mt-2">
                  &ldquo;Notice how splitting the middle term works when the product a &bull; c is negative.&rdquo;
                </p>
              </div>
            </div>

            {/* Student PiP Preview (Bottom Right) */}
            <div className="absolute bottom-5 right-5 h-28 w-40 sm:h-36 sm:w-52 rounded-2xl overflow-hidden border border-white/20 bg-[#2C2E2A] shadow-lg flex flex-col justify-between p-2.5">
              <span className="text-[10px] font-bold text-white/80 bg-black/50 rounded px-1.5 py-0.5 self-start">
                You (Aarav)
              </span>
              <div className="text-center my-auto">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE7FF] text-xs font-bold text-[#594282]">
                  AM
                </div>
              </div>
              <span className="text-[10px] text-white/60 text-right">Class 9</span>
            </div>
          </div>

          {/* Floating Tactile Classroom Controls (Light theme surface) */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[rgba(54,48,60,0.12)] bg-white px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => setMicrophoneOn((p) => !p)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  microphoneOn ? "bg-[#FCFBF8] text-[#20221F] hover:bg-[#EEE7FF]" : "bg-[#C84B31] text-white"
                }`}
                title={microphoneOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {microphoneOn ? <IconMic size={16} /> : <IconMicOff size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCameraOn((p) => !p)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  cameraOn ? "bg-[#FCFBF8] text-[#20221F] hover:bg-[#EEE7FF]" : "bg-[#C84B31] text-white"
                }`}
                title={cameraOn ? "Disable Camera" : "Enable Camera"}
              >
                {cameraOn ? <IconVideo size={16} /> : <IconVideoOff size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setScreenSharing((p) => !p)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  screenSharing ? "bg-[#7257A5] text-white" : "bg-[#FCFBF8] text-[#20221F] hover:bg-[#EEE7FF]"
                }`}
                title="Share Screen"
              >
                <IconScreenShare size={16} />
              </button>

              <button
                type="button"
                onClick={() => setChatOpen((p) => !p)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition relative ${
                  chatOpen ? "bg-[#7257A5] text-white" : "bg-[#FCFBF8] text-[#20221F] hover:bg-[#EEE7FF]"
                }`}
                title="Class Notes & Chat"
              >
                <IconMessageSquare size={16} />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#5D806F]" />
              </button>
            </div>
          </div>
        </div>

        {/* Light Chat / Notes Drawer */}
        {chatOpen && (
          <aside className="w-80 sm:w-96 border-l border-[rgba(54,48,60,0.10)] bg-white flex flex-col z-20 shadow-lg">
            <div className="flex h-16 items-center justify-between border-b border-[rgba(54,48,60,0.08)] px-5">
              <div>
                <h3 className="text-sm font-bold text-[#20221F]">Class Chat &amp; Notes</h3>
                <p className="text-[11px] text-[#6D706A]">Shared with tutor</p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6D706A] hover:bg-[#FCFBF8]"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "Aarav" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] font-bold text-[#969991] mb-1">
                    {msg.sender} &bull; {msg.time}
                  </span>
                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === "Aarav"
                        ? "bg-[#7257A5] text-white"
                        : "bg-[#EEE7FF]/60 text-[#20221F] border border-[rgba(54,48,60,0.06)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[rgba(54,48,60,0.08)] flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a doubt or note..."
                className="flex-1 rounded-full border border-[rgba(54,48,60,0.12)] bg-[#FCFBF8] px-4 py-2 text-xs text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7257A5] text-white shadow-xs"
              >
                <IconSend size={14} />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Leave Confirmation Dialog */}
      {leaveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-6 sm:p-8 shadow-xl text-center space-y-4">
            <h3 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#20221F]">
              Finish Demo Session?
            </h3>
            <p className="text-xs text-[#6D706A] leading-relaxed">
              You will be taken to a brief feedback screen to share how your trial went and view class package options.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLeaveDialogOpen(false)}
                className="btn btn-outline flex-1 rounded-full text-xs font-bold"
              >
                Continue Demo
              </button>
              <button
                type="button"
                onClick={handleEndSession}
                className="btn btn-primary flex-1 rounded-full text-xs font-bold"
              >
                End &amp; Give Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
