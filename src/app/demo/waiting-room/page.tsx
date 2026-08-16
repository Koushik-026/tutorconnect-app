"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";

export default function DemoWaitingRoomPage() {
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connectionChecked, setConnectionChecked] =
    useState(false);
  const [tutorReady, setTutorReady] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9ff]">
      <div
        aria-hidden="true"
        className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl"
      />

      {/* Header */}
      <header className="relative z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="container-shell flex h-[72px] items-center justify-between">
          <Logo />

          <Link
            href="/dashboard/student"
            className="text-sm font-bold text-slate-500 transition hover:text-blue-700"
          >
            Exit waiting room
          </Link>
        </div>
      </header>

      <div className="container-shell relative z-10 py-8 sm:py-10 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.45fr)_380px] xl:gap-10">
          {/* =================================================
              CAMERA PREVIEW
          ================================================== */}
          <section>
            <div className="relative overflow-hidden rounded-[26px] border border-slate-300 bg-slate-950 shadow-[0_25px_70px_rgba(15,23,42,0.15)]">
              <div
                role="img"
                aria-label="Video preview before joining the demo"
                className={`aspect-video w-full bg-cover bg-center transition ${
                  cameraOn ? "" : "opacity-0"
                }`}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=1600&q=85')",
                }}
              />

              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center text-white">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-xl font-extrabold">
                      AR
                    </div>

                    <p className="mt-4 font-bold">
                      Camera is off
                    </p>
                  </div>
                </div>
              )}

              {/* Camera status */}
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                <span
                  className={`mr-2 inline-block h-2 w-2 rounded-full ${
                    cameraOn
                      ? "bg-teal-500"
                      : "bg-slate-400"
                  }`}
                />

                {cameraOn
                  ? "Camera On"
                  : "Camera Off"}
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-xl sm:bottom-6">
                <button
                  type="button"
                  aria-label={
                    microphoneOn
                      ? "Turn microphone off"
                      : "Turn microphone on"
                  }
                  onClick={() =>
                    setMicrophoneOn(
                      (current) => !current,
                    )
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
                    microphoneOn
                      ? "bg-white text-slate-900"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {microphoneOn ? "🎙" : "×"}
                </button>

                <button
                  type="button"
                  aria-label={
                    cameraOn
                      ? "Turn camera off"
                      : "Turn camera on"
                  }
                  onClick={() =>
                    setCameraOn(
                      (current) => !current,
                    )
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
                    cameraOn
                      ? "bg-white text-slate-900"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {cameraOn ? "▣" : "×"}
                </button>

                <button
                  type="button"
                  aria-label="Device settings"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg text-slate-900"
                >
                  ⚙
                </button>
              </div>
            </div>

            {/* Device status */}
            <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 sm:grid-cols-2">
              <p className="flex items-center justify-center gap-2">
                <span
                  className={
                    microphoneOn
                      ? "text-teal-600"
                      : "text-red-600"
                  }
                >
                  ●
                </span>

                {microphoneOn
                  ? "Microphone working"
                  : "Microphone muted"}
              </p>

              <p className="flex items-center justify-center gap-2">
                <span className="text-teal-600">
                  ●
                </span>

                Speaker working
              </p>
            </div>
          </section>

          {/* =================================================
              JOIN PANEL
          ================================================== */}
          <aside>
            <span className="badge badge-blue">
              Free Online Demo
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Ready to join?
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-600">
              {tutorReady ? (
                <>
                  <strong className="text-blue-700">
                    Ananya Sharma
                  </strong>{" "}
                  is ready. You can join the demo now.
                </>
              ) : (
                <>
                  Waiting for{" "}
                  <strong className="text-blue-700">
                    Ananya Sharma
                  </strong>{" "}
                  to start the demo.
                </>
              )}
            </p>

            {/* Session info */}
            <article className="tc-card mt-7 overflow-hidden">
              <div className="flex gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  ▣
                </span>

                <div>
                  <p className="font-extrabold text-slate-950">
                    Schedule
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    4 August 2026
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    4:00 PM – 4:30 PM IST
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 p-5">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    ◫
                  </span>

                  <div>
                    <p className="font-extrabold text-slate-950">
                      Subjects
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="badge badge-violet">
                        Mathematics
                      </span>

                      <span className="badge badge-violet">
                        Science
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Development status control */}
            {!tutorReady ? (
              <button
                type="button"
                onClick={() => setTutorReady(true)}
                className="btn btn-secondary mt-6 w-full"
              >
                Check if tutor is ready
              </button>
            ) : (
              <Link
                href="/demo/session"
                className="btn btn-primary mt-6 w-full"
              >
                Join Demo
                <span aria-hidden="true">→</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() =>
                setConnectionChecked(true)
              }
              className="mt-5 w-full text-center text-sm font-extrabold text-blue-700 transition hover:text-blue-800"
            >
              Test my connection
            </button>

            {connectionChecked && (
              <div
                role="status"
                className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900"
              >
                ✓ Frontend connection test passed.
                Real microphone, camera and network
                diagnostics will be connected with the
                video-session provider.
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
              Frontend preview: tutor-arrival status and
              device diagnostics are simulated until the
              live video-session backend is connected.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}