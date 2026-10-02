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
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      {/* Light Header */}
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>Exit Waiting Room</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16 flex items-center">
        <div className="container-shell max-w-4xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-3.5 py-1 text-xs font-bold text-[#244A40] mb-3">
              <IconClock size={13} />
              <span>Demo Starts in 3 Minutes</span>
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[#25231F]">
              Online Demo Waiting Room
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#6F6A62]">
              Check your camera and audio before joining the 1-on-1 trial with <strong className="text-[#25231F]">Ananya Sharma</strong>.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Focal Object: Large Camera Preview */}
            <div className="lg:col-span-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-[rgba(55,48,40,0.12)] bg-[#25231F] shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-[#315F52] animate-pulse" />
                    <span>Camera Test: {cameraOn ? "Active" : "Disabled"}</span>
                  </div>

                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold">
                    30-Min Free Trial
                  </span>
                </div>

                {cameraOn ? (
                  <div className="text-center my-auto">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-2xl font-bold text-white border border-white/20">
                      AM
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white/90">Aarav Mehta (Student View)</p>
                    <p className="text-xs text-white/60">Simulated camera preview active</p>
                  </div>
                ) : (
                  <div className="text-center my-auto">
                    <p className="text-sm font-semibold text-white/80">Camera is turned off</p>
                  </div>
                )}

                {/* Receding Device Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMicrophoneOn((p) => !p)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold backdrop-blur-md transition-all ${
                      microphoneOn
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-[#C84B31] text-white"
                    }`}
                  >
                    {microphoneOn ? <IconMic size={15} /> : <IconMicOff size={15} />}
                    <span>{microphoneOn ? "Mic On" : "Mic Muted"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCameraOn((p) => !p)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold backdrop-blur-md transition-all ${
                      cameraOn
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-[#C84B31] text-white"
                    }`}
                  >
                    {cameraOn ? <IconVideo size={15} /> : <IconVideoOff size={15} />}
                    <span>{cameraOn ? "Camera On" : "Camera Off"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Educator Info & Join Action */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EEE9] text-sm font-extrabold text-[#244A40]">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                        Ananya Sharma
                      </h3>
                      <span className="text-[#315F52]"><IconShieldCheck size={16} /></span>
                    </div>
                    <p className="text-xs text-[#6F6A62]">Mathematics &amp; Science</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[rgba(55,48,40,0.08)] pt-4 text-xs text-[#6F6A62]">
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-bold text-[#25231F]">30 Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Curriculum:</span>
                    <span className="font-bold text-[#25231F]">Class 9 &bull; CBSE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Topic:</span>
                    <span className="font-bold text-[#25231F]">Quadratic Roots Diagnostic</span>
                  </div>
                </div>

                <Link
                  href="/demo/session"
                  className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 mt-2"
                >
                  <span>Join Demo Session</span>
                  <IconArrowRight size={16} />
                </Link>
              </div>

              <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFF7ED] p-4 text-xs text-[#6F6A62]">
                <div className="flex items-center gap-2 font-bold text-[#25231F] mb-1">
                  <IconCheck size={14} className="text-[#315F52]" />
                  <span>No payment required</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Evaluate concept clarity during this free trial. You will have full opportunity to choose a package afterwards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
