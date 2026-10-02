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
    <div className="flex min-h-screen flex-col bg-[#0f172a] text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-3.5 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <IconArrowLeft size={14} />
            <span>Leave Waiting Room</span>
          </Link>
        </div>
      </header>

      {/* Main Waiting Room Interface */}
      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left: Video Preview (7 cols) */}
            <div className="space-y-4 lg:col-span-7">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl flex items-center justify-center">
                {cameraOn ? (
                  <div
                    role="img"
                    aria-label="Student camera preview"
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=1200&q=80')",
                    }}
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-slate-200 mb-2">
                      AR
                    </div>
                    <p className="text-xs font-medium">Camera is disabled</p>
                  </div>
                )}

                {/* Floating Media Toggles */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-slate-900/80 p-2 shadow-lg backdrop-blur-md border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setMicrophoneOn(!microphoneOn)}
                    title={microphoneOn ? "Mute Microphone" : "Unmute Microphone"}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                      microphoneOn
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-rose-600 hover:bg-rose-700 text-white"
                    }`}
                  >
                    {microphoneOn ? <IconMic size={18} /> : <IconMicOff size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCameraOn(!cameraOn)}
                    title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                      cameraOn
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-rose-600 hover:bg-rose-700 text-white"
                    }`}
                  >
                    {cameraOn ? <IconVideo size={18} /> : <IconVideoOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Microphone &bull; {microphoneOn ? "Active" : "Muted"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Network &bull; Stable connection</span>
                </div>
              </div>
            </div>

            {/* Right: Tutor Readiness & Join Action (5 cols) */}
            <div className="space-y-5 lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-lg">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
                  <IconClock size={13} />
                  <span>Starts in 2 minutes</span>
                </div>

                <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-white">
                  Mathematics &amp; Science Demo
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                  30-Minute Free Evaluation with Ananya Sharma
                </p>

                {/* Tutor status card */}
                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-xs font-extrabold text-white shadow-xs"
                    >
                      AS
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200 text-sm">Ananya Sharma</span>
                        <IconShieldCheck size={14} className="text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        In room &bull; Whiteboard ready
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="mt-5 space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-emerald-400 shrink-0" />
                    <span>Audio &amp; camera hardware verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-emerald-400 shrink-0" />
                    <span>Shared interactive canvas loaded</span>
                  </div>
                </div>

                {/* Primary Join Action */}
                <div className="mt-6">
                  <Link
                    href="/demo/session"
                    className="btn bg-blue-600 hover:bg-blue-500 text-white font-extrabold w-full min-h-[50px] text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Enter Demo Session</span>
                    <IconArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
