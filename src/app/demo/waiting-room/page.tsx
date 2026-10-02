"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconVideo,
  IconVideoOff,
  IconMic,
  IconMicOff,
  IconCheck,
  IconShieldCheck,
  IconArrowRight,
  IconClock,
  IconArrowLeft,
} from "@/components/ui/icons";

export default function DemoWaitingRoomPage() {
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Light Paper Bloom Header */}
      <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#676B64] hover:text-[#66518A] transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>Exit Waiting Room</span>
          </Link>
        </div>
      </header>

      {/* Main Light Shell */}
      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-2xl">
          {/* Waiting Room Primary Surface */}
          <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs space-y-6">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4DED4] pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F0EA] px-3 py-0.5 text-xs font-bold text-[#4F7867]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F7867] animate-pulse" />
                  Tutor is Ready
                </span>
                <h1 className="mt-2 font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[#232520] sm:text-2xl">
                  Demo Session Waiting Room
                </h1>
                <p className="mt-0.5 text-xs text-[#676B64]">
                  Session with <strong className="text-[#232520]">Ananya Sharma</strong> &bull; Grade 10 Mathematics
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-xl border border-[#E4DED4] bg-[#F7F4EE] px-3 py-1.5 text-xs font-bold text-[#66518A]">
                <IconClock size={14} />
                <span>Starts in 02:45</span>
              </div>
            </div>

            {/* Central Camera Preview Surface */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#E4DED4] bg-[#232520] shadow-inner">
              {cameraOn ? (
                <div
                  role="img"
                  aria-label="Student video preview"
                  className="h-full w-full bg-cover bg-center opacity-90"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=1200&q=80')",
                  }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-[#676B64]">
                  <IconVideoOff size={40} className="mb-2 text-[#E4DED4]" />
                  <span className="text-xs font-bold text-white">Camera is turned off</span>
                </div>
              )}

              {/* Status overlay chips inside camera box */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white">
                  Aarav Mehta (You)
                </span>
                <span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                  microphoneOn ? "bg-[#4F7867] text-white" : "bg-rose-600 text-white"
                }`}>
                  {microphoneOn ? "Mic On" : "Muted"}
                </span>
              </div>

              {/* Quick toggle controls over camera */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMicrophoneOn(!microphoneOn)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    microphoneOn
                      ? "bg-white/90 text-[#232520] hover:bg-white"
                      : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                  title={microphoneOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {microphoneOn ? <IconMic size={16} /> : <IconMicOff size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    cameraOn
                      ? "bg-white/90 text-[#232520] hover:bg-white"
                      : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                  title={cameraOn ? "Turn Off Video" : "Turn On Video"}
                >
                  {cameraOn ? <IconVideo size={16} /> : <IconVideoOff size={16} />}
                </button>
              </div>
            </div>

            {/* Device Readiness Badges */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#E4DED4] bg-[#F7F4EE] p-3 text-xs">
                <IconCheck size={15} className="text-[#4F7867]" />
                <div>
                  <p className="font-bold text-[#232520]">Audio Input</p>
                  <p className="text-[11px] text-[#676B64]">Default Microphone OK</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#E4DED4] bg-[#F7F4EE] p-3 text-xs">
                <IconCheck size={15} className="text-[#4F7867]" />
                <div>
                  <p className="font-bold text-[#232520]">Video Feed</p>
                  <p className="text-[11px] text-[#676B64]">HD Webcam 720p</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#E4DED4] bg-[#F7F4EE] p-3 text-xs">
                <IconShieldCheck size={15} className="text-[#4F7867]" />
                <div>
                  <p className="font-bold text-[#232520]">Connection</p>
                  <p className="text-[11px] text-[#676B64]">High-speed (Fast)</p>
                </div>
              </div>
            </div>

            {/* Single Prominent Join Action */}
            <div className="pt-2">
              <Link
                href="/demo/session"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-4 text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
              >
                <span>Join Demo Session Now</span>
                <IconArrowRight size={16} />
              </Link>
              <p className="mt-2 text-center text-xs text-[#676B64]">
                Need a moment? The session will remain open for 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
