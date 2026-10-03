"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DemoBookingRow } from "@/lib/types/database";
import {
  IconMic,
  IconMicOff,
  IconVideo,
  IconVideoOff,
  IconScreenShare,
  IconMessageSquare,
  IconX,
  IconSend,
} from "@/components/ui/icons";

type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  time: string;
};

function DemoSessionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [tutorName, setTutorName] = useState("Educator");
  const [studentName, setStudentName] = useState("Student");
  const [subjectName, setSubjectName] = useState("Focus Subject");

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
      sender: "Educator",
      text: "Welcome to our demo class! Let's explore foundational concepts together.",
      time: "04:30 PM",
    },
    {
      id: 2,
      sender: "Student",
      text: "Hello! I am ready to begin.",
      time: "04:31 PM",
    },
  ]);

  useEffect(() => {
    if (!bookingId || !isSupabaseConfigured()) return;

    async function loadSession() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("demo_bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

        if (data) {
          const row = data as DemoBookingRow;
          setTutorName(row.tutor_name);
          setSubjectName(row.subject);

          const { data: sp } = await supabase
            .from("student_profiles")
            .select("display_name")
            .eq("id", row.student_profile_id)
            .single();

          const sName = sp?.display_name || "Student";
          setStudentName(sName);
          setMessages([
            {
              id: 1,
              sender: row.tutor_name,
              text: "Hi " + sName + "! Welcome to our demo class on " + row.subject + ". Let's start with core problem intuition.",
              time: "04:30 PM",
            },
            {
              id: 2,
              sender: sName,
              text: "Hello! I am ready to review my hesitation points.",
              time: "04:31 PM",
            },
          ]);
        }
      } catch {
        // Retain default session preview
      }
    }

    loadSession();
  }, [bookingId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: studentName,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const handleConfirmLeave = () => {
    const nextUrl = bookingId ? "/demo/feedback?booking_id=" + bookingId : "/demo/feedback";
    router.push(nextUrl);
  };

  return (
    <div className="flex h-screen flex-col bg-[#25231F] text-white">
      {/* Simulation Banner */}
      <div className="bg-[#FFFBF5] text-[#25231F] text-center px-4 py-1.5 text-xs font-semibold border-b border-[rgba(55,48,40,0.10)] flex items-center justify-center gap-2">
        <span className="rounded-full bg-[#E3EADD] px-2 py-0.5 text-[10px] font-bold text-[#244A40]">
          Interactive Demo Room Preview
        </span>
        <span>Audio/video streams, whiteboard, and chat are simulated for preview purposes.</span>
      </div>

      {/* Classroom Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden sm:inline-block text-white/30 text-xs">|</span>
          <div className="hidden sm:block">
            <h1 className="text-xs font-bold text-white/90">
              Demo: {subjectName} with {tutorName}
            </h1>
            <p className="text-[10px] text-white/50">{studentName} (Student)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90">
            <span className="h-2 w-2 rounded-full bg-[#315F52] animate-pulse" />
            <span>{formatTimer(secondsRemaining)} remaining</span>
          </div>

          <button
            type="button"
            onClick={() => setLeaveDialogOpen(true)}
            className="rounded-full bg-[#C84B31] px-4 min-h-[44px] text-xs font-bold text-white transition-opacity hover:opacity-90 flex items-center"
          >
            Leave Demo
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Interactive Canvas Workspace */}
        <div className="flex flex-1 flex-col p-4">
          <div className="relative flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-[#1D1B18] overflow-hidden">
            <div className="text-center p-8 max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 mb-4 text-2xl font-bold">
                TC
              </div>
              <h2 className="text-base font-bold text-white/90">
                Shared Concept Canvas Preview
              </h2>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">
                In actual sessions, tutor and student collaborate on an interactive live board. Concept diagrams, problem steps, and digital annotations appear in real-time.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  Concept Step Breakdown
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  Visual Problem Notation
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  Lesson Notes Export
                </span>
              </div>
            </div>

            {/* Video Pip (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 flex gap-3">
              {/* Tutor Pip */}
              <div className="h-28 w-40 overflow-hidden rounded-xl border border-white/20 bg-black/60 shadow-lg flex flex-col justify-between p-2">
                <span className="text-[10px] font-bold text-white/80">{tutorName} (Tutor)</span>
                <div className="text-center my-auto text-xs font-extrabold text-white/40">
                  {tutorName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[9px] text-[#315F52] font-semibold">Demo Stream</span>
              </div>

              {/* Student Pip */}
              <div className="h-28 w-40 overflow-hidden rounded-xl border border-white/20 bg-black/60 shadow-lg flex flex-col justify-between p-2">
                <span className="text-[10px] font-bold text-white/80">{studentName} (You)</span>
                <div className="text-center my-auto text-xs font-extrabold text-white/40">
                  {studentName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[9px] text-white/40 font-semibold">{cameraOn ? "Preview On" : "Preview Off"}</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-3 flex shrink-0 items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setMicrophoneOn((p) => !p)}
              className={"flex items-center gap-2 rounded-full px-4 min-h-[44px] text-xs font-bold transition-all " + (
                microphoneOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-[#C84B31] text-white"
              )}
            >
              {microphoneOn ? <IconMic size={16} /> : <IconMicOff size={16} />}
              <span>{microphoneOn ? "Mic On" : "Muted"}</span>
            </button>

            <button
              type="button"
              onClick={() => setCameraOn((p) => !p)}
              className={"flex items-center gap-2 rounded-full px-4 min-h-[44px] text-xs font-bold transition-all " + (
                cameraOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-[#C84B31] text-white"
              )}
            >
              {cameraOn ? <IconVideo size={16} /> : <IconVideoOff size={16} />}
              <span>{cameraOn ? "Camera On" : "Camera Off"}</span>
            </button>

            <button
              type="button"
              onClick={() => setScreenSharing((p) => !p)}
              className={"flex items-center gap-2 rounded-full px-4 min-h-[44px] text-xs font-bold transition-all " + (
                screenSharing ? "bg-[#315F52] text-white" : "bg-white/10 hover:bg-white/20 text-white"
              )}
            >
              <IconScreenShare size={16} />
              <span>{screenSharing ? "Sharing Screen" : "Share Screen"}</span>
            </button>

            <button
              type="button"
              onClick={() => setChatOpen((p) => !p)}
              className={"flex items-center gap-2 rounded-full px-4 min-h-[44px] text-xs font-bold transition-all " + (
                chatOpen ? "bg-white text-[#25231F]" : "bg-white/10 hover:bg-white/20 text-white"
              )}
            >
              <IconMessageSquare size={16} />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Right: Simulated Chat Sidebar */}
        {chatOpen && (
          <div className="w-80 border-l border-white/10 bg-[#1D1B18] flex flex-col">
            <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
              <span className="text-xs font-bold text-white/90">Session Chat Preview</span>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-white/50 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span className="font-bold text-white/80">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="rounded-xl bg-white/5 p-2.5 text-white/90 leading-relaxed">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a response..."
                className="flex-1 min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white placeholder-white/40 focus:border-[#315F52] focus:outline-hidden"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#315F52] px-3 min-h-[44px] text-white hover:bg-[#315F52]/90 flex items-center justify-center"
              >
                <IconSend size={15} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Leave Confirmation Dialog */}
      {leaveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-[#25231F] text-center shadow-xl space-y-4">
            <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold">
              Leave Demo Session?
            </h3>
            <p className="text-xs text-[#6F6A62] leading-relaxed">
              We hope this 1-on-1 demo gave you a clear feel for the educator&apos;s teaching tempo. Take 30 seconds to share brief feedback and explore package options.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLeaveDialogOpen(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-[rgba(55,48,40,0.15)] text-xs font-bold hover:bg-black/5"
              >
                Stay in Demo
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="flex-1 min-h-[44px] rounded-xl bg-[#315F52] text-xs font-bold text-white hover:bg-[#315F52]/90"
              >
                Leave &amp; Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DemoSessionPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#25231F] text-white text-xs">Loading demo room...</div>}>
      <DemoSessionInner />
    </Suspense>
  );
}
