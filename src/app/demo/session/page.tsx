"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

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
    text: "Welcome Aarav! Can you hear me clearly?",
    time: "4:01 PM",
  },
  {
    id: 2,
    sender: "Aarav",
    text: "Yes ma'am, loud and clear.",
    time: "4:01 PM",
  },
  {
    id: 3,
    sender: "Ananya",
    text: "Great! We'll start with a quick Mathematics concept and then move to Science.",
    time: "4:03 PM",
  },
];

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export default function DemoSessionPage() {
  const [microphoneOn, setMicrophoneOn] =
    useState(true);

  const [cameraOn, setCameraOn] =
    useState(true);

  const [screenSharing, setScreenSharing] =
    useState(false);

  const [chatOpen, setChatOpen] =
    useState(true);

  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [message, setMessage] =
    useState("");

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [leaveDialogOpen, setLeaveDialogOpen] =
    useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds(
        (current) => current + 1,
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  function sendMessage(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "Aarav",
        text: trimmed,
        time: "Now",
      },
    ]);

    setMessage("");
  }

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-hidden bg-[#090909] text-white"
    >
      {/* =====================================================
          TOP MEETING BAR
      ====================================================== */}
      <header className="flex h-[68px] items-center justify-between border-b border-white/10 bg-[#080808] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="shrink-0 text-xl font-extrabold tracking-[-0.04em] text-white sm:text-2xl"
          >
            Tutor
            <span className="text-blue-400">
              Connect
            </span>
          </Link>

          <div className="hidden h-7 w-px bg-white/20 sm:block" />

          <p className="hidden truncate text-sm font-bold text-slate-200 sm:block">
            Mathematics & Science Demo · Class 9
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200">
            <span className="h-2 w-2 rounded-full bg-red-500" />

            {formatElapsed(elapsedSeconds)}
          </div>

          <button
            type="button"
            aria-label="Session information"
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ⓘ
          </button>
        </div>
      </header>

      {/* =====================================================
          MEETING BODY
      ====================================================== */}
      <div className="flex h-[calc(100vh-68px)]">
        {/* ===================================================
            VIDEO AREA
        ==================================================== */}
        <section className="relative min-w-0 flex-1 overflow-y-auto p-3 pb-28 sm:p-4 sm:pb-28 lg:p-5">
          <div
            className={`mx-auto grid h-full max-w-[1500px] gap-3 sm:gap-4 ${
              chatOpen
                ? "lg:grid-cols-2"
                : "md:grid-cols-2"
            }`}
          >
            {/* ===============================================
                TUTOR VIDEO
            ================================================ */}
            <article className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:min-h-[400px] lg:min-h-0">
              <div
                role="img"
                aria-label="Ananya Sharma teaching during the online demo"
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCI3mSCmOtVNbtxOSPFC9_IIqYE7gDeXH6d5O_-Wx4l4a2p0Ry2XbQi5uqzxPiAFM-VgEGmfmektwbEtHzbXmTVyM7bXizvgu9w2FEq8TARq6sd00qOvmr4yzHTU5x-E-xD9Twv1UZDIO8Au_x0oNLDAcq6Ba2m3LfNWD9uigalpztDg1B8W_dGVw-ETcKY1pXJRiRqcF9Xg-9xnHSrY-tXt9l35p1px40ZZC8P_YWU2qxKX-3jDSq5qw')",
                }}
              />

              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-4 left-4 rounded-lg bg-black/65 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                Ananya Sharma · Tutor
              </div>

              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-sm backdrop-blur">
                🎙
              </div>
            </article>

            {/* ===============================================
                STUDENT VIDEO
            ================================================ */}
            <article className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:min-h-[400px] lg:min-h-0">
              {cameraOn ? (
                <div
                  role="img"
                  aria-label="Aarav Reddy attending the online demo"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDA4aTZLVZtGruc3e5DeW774iO_KmjVluCE3Pzqel-6xWAVPFM6gb4D4RNy89vatEtgISqKVBvkuW2pSBwQehj6RaekQSNJMR8uNkc18hqYGQdjNaajqrxqlC0UlpcYrx_euSe77I0lbgoDs8-yIgt0rWvFC-9KIfdVkjbbcBpyktT3CH-dxJxMUioIvy2MGUI2rAsEDAvF10dOfoiMqnTYGTHTpWVPURsKUfhRLVXWvqbqxrcMngUztQ')",
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-2xl font-extrabold text-white">
                      AR
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-300">
                      Camera off
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-4 left-4 rounded-lg bg-black/65 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                Aarav Reddy · Student
              </div>

              {!microphoneOn && (
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm shadow-lg">
                  ×
                </div>
              )}
            </article>
          </div>

          {/* ===============================================
              SCREEN SHARE STATUS
          ================================================ */}
          {screenSharing && (
            <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full border border-blue-400/30 bg-blue-600/90 px-4 py-2 text-xs font-extrabold text-white shadow-xl backdrop-blur">
              You are sharing your screen
            </div>
          )}

          {/* ===============================================
              FLOATING CONTROLS
          ================================================ */}
          <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-[#24211f]/95 p-3 shadow-2xl backdrop-blur-xl sm:gap-3 sm:p-4 lg:left-[calc(50%-180px)]">
            <button
              type="button"
              aria-label={
                microphoneOn
                  ? "Mute microphone"
                  : "Unmute microphone"
              }
              onClick={() =>
                setMicrophoneOn(
                  (current) => !current,
                )
              }
              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition sm:h-13 sm:w-13 ${
                microphoneOn
                  ? "bg-[#27364b] text-white hover:bg-[#334762]"
                  : "bg-red-600 text-white hover:bg-red-700"
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
              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition sm:h-13 sm:w-13 ${
                cameraOn
                  ? "bg-[#27364b] text-white hover:bg-[#334762]"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {cameraOn ? "▣" : "×"}
            </button>

            <button
              type="button"
              aria-label={
                screenSharing
                  ? "Stop sharing screen"
                  : "Share screen"
              }
              onClick={() =>
                setScreenSharing(
                  (current) => !current,
                )
              }
              className={`hidden h-12 w-12 items-center justify-center rounded-full text-lg transition sm:flex sm:h-13 sm:w-13 ${
                screenSharing
                  ? "bg-blue-600 text-white"
                  : "bg-[#27364b] text-white hover:bg-[#334762]"
              }`}
            >
              ▣
            </button>

            <div className="mx-1 hidden h-8 w-px bg-white/15 sm:block" />

            <button
              type="button"
              onClick={() =>
                setLeaveDialogOpen(true)
              }
              className="flex min-h-12 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700 sm:px-8"
            >
              Leave Demo
            </button>

            {/* Chat toggle for smaller screens */}
            <button
              type="button"
              aria-label={
                chatOpen
                  ? "Close meeting chat"
                  : "Open meeting chat"
              }
              onClick={() =>
                setChatOpen(
                  (current) => !current,
                )
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#27364b] text-lg text-white transition hover:bg-[#334762] lg:hidden"
            >
              ✉
            </button>
          </div>
        </section>

        {/* ===================================================
            MEETING CHAT
        ==================================================== */}
        {chatOpen && (
          <aside className="fixed inset-x-0 bottom-0 top-[68px] z-50 flex w-full flex-col border-l border-white/10 bg-[#151515] sm:left-auto sm:w-[390px] lg:static lg:z-auto lg:w-[360px] xl:w-[390px]">
            <div className="flex h-[60px] items-center justify-between border-b border-white/10 px-5">
              <h2 className="font-extrabold text-white">
                Meeting Chat
              </h2>

              <button
                type="button"
                aria-label="Close meeting chat"
                onClick={() =>
                  setChatOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {messages.map((chatMessage) => {
                const mine =
                  chatMessage.sender ===
                  "Aarav";

                return (
                  <div
                    key={chatMessage.id}
                    className={
                      mine
                        ? "ml-auto max-w-[85%]"
                        : "mr-auto max-w-[85%]"
                    }
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>
                        {mine
                          ? "You"
                          : chatMessage.sender}
                      </span>

                      <span>
                        {chatMessage.time}
                      </span>
                    </div>

                    <div
                      className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                        mine
                          ? "bg-blue-950 text-blue-50"
                          : "bg-slate-800 text-slate-100"
                      }`}
                    >
                      {chatMessage.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={sendMessage}
              className="border-t border-white/10 p-4"
            >
              <div className="relative">
                <input
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value,
                    )
                  }
                  type="text"
                  placeholder="Send a message to everyone..."
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-slate-800 px-4 pr-12 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />

                <button
                  type="submit"
                  aria-label="Send message"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-blue-400 transition hover:bg-white/10 hover:text-blue-300"
                >
                  ➤
                </button>
              </div>
            </form>
          </aside>
        )}

        {/* ===================================================
            CLOSED CHAT BUTTON — DESKTOP
        ==================================================== */}
        {!chatOpen && (
          <button
            type="button"
            onClick={() =>
              setChatOpen(true)
            }
            className="fixed right-5 top-[88px] z-30 hidden rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-extrabold text-white shadow-xl transition hover:bg-slate-700 lg:block"
          >
            ✉ Open Chat
          </button>
        )}
      </div>

      {/* =====================================================
          LEAVE DEMO DIALOG
      ====================================================== */}
      {leaveDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-demo-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
              ×
            </div>

            <h2
              id="leave-demo-title"
              className="mt-5 text-2xl font-extrabold"
            >
              Leave the demo?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              After leaving, you&apos;ll be
              taken to the demo feedback step where you
              can decide whether you want to continue
              with this tutor.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setLeaveDialogOpen(false)
                }
                className="btn btn-secondary w-full"
              >
                Stay in Demo
              </button>

              <Link
                href="/demo/feedback"
                className="btn w-full bg-red-600 text-white hover:bg-red-700"
              >
                Leave Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}