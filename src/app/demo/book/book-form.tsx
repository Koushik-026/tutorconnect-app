"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Logo } from "@/components/logo";
import type { Tutor } from "@/lib/types";
import type { StudentProfile } from "@/lib/types/database";
import {
  submitDemoBookingAction,
  createLearnerProfileAction,
} from "@/app/actions/workflow";
import {
    IconVideo,
  IconArrowRight,
  IconCheck,
  IconUser,
} from "@/components/ui/icons";

interface DemoBookFormProps {
  tutor: Tutor;
  initialProfiles: StudentProfile[];
  isAuthenticated: boolean;
}

function generateDynamicDemoOptions(availableDays: string[], availableTimes: string[]) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const options: { date: string; label: string; slots: string[] }[] = [];
  const now = new Date();

  // Look ahead over next 14 days, pick up to 5 matching tutor available days starting tomorrow
  for (let i = 1; i <= 14 && options.length < 5; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const dayName = daysOfWeek[d.getDay()];

    if (availableDays.length === 0 || availableDays.includes(dayName)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = String(year) + "-" + month + "-" + day;

      const dayAbbr = dayName.slice(0, 3);
      const monthAbbr = d.toLocaleString("en-US", { month: "short" });
      const label = dayAbbr + ", " + monthAbbr + " " + d.getDate();

      options.push({
        date: dateStr,
        label,
        slots: availableTimes.length > 0 ? availableTimes : ["4:00 PM", "5:00 PM", "6:00 PM"],
      });
    }
  }

  return options;
}

export function DemoBookForm({
  tutor,
  initialProfiles,
}: DemoBookFormProps) {
  const router = useRouter();

  const dynamicDates = useMemo(
    () => generateDynamicDemoOptions(tutor.availableDays, tutor.availableTimes),
    [tutor.availableDays, tutor.availableTimes]
  );

  const [profiles, setProfiles] = useState<StudentProfile[]>(initialProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    initialProfiles[0]?.id || ""
  );

  // Inline profile creation state
  const [showCreateProfile, setShowCreateProfile] = useState<boolean>(
    initialProfiles.length === 0
  );
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newClassLevel, setNewClassLevel] = useState("Class 9");
  const [newBoard, setNewBoard] = useState("CBSE");
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Booking fields
  const [selectedDate, setSelectedDate] = useState<string>(
    dynamicDates[0]?.date || ""
  );
  const currentSlots = useMemo(() => {
    const found = dynamicDates.find((d) => d.date === selectedDate);
    return found?.slots || tutor.availableTimes;
  }, [dynamicDates, selectedDate, tutor.availableTimes]);

  const [selectedSlot, setSelectedSlot] = useState<string>(
    currentSlots[0] || "04:30 PM"
  );
  const [selectedSubject, setSelectedSubject] = useState(
    tutor.subjects[0] || "Mathematics"
  );
  const [learningGoal, setLearningGoal] = useState(
    "Clarify core concept fundamentals and build exam problem-solving confidence."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Handler for creating a new learner profile inline
  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");

    if (!newDisplayName.trim()) {
      setProfileError("Please enter the student's name.");
      return;
    }

    setIsCreatingProfile(true);
    const fd = new FormData();
    fd.append("display_name", newDisplayName.trim());
    fd.append("class_level", newClassLevel);
    fd.append("board", newBoard);

    const res = await createLearnerProfileAction(fd);
    setIsCreatingProfile(false);

    if (res.success && res.profile) {
      setProfiles((prev) => [...prev, res.profile as StudentProfile]);
      setSelectedProfileId(res.profile.id);
      setShowCreateProfile(false);
      setNewDisplayName("");
    } else {
      setProfileError(res.error || "Unable to create profile.");
    }
  }

  // Handler for submitting the demo booking
  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingError("");

    if (!selectedProfileId) {
      setBookingError("Please select or create a student profile first.");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setBookingError("Please select an available date and time slot.");
      return;
    }

    // Convert slot (e.g. '04:30 PM' or '4:00 PM') into scheduledStartAt ISO string
    let hours = 16;
    let minutes = 30;
    const parts = selectedSlot.split(" ");
    if (parts.length === 2) {
      const [hStr, mStr] = parts[0].split(":");
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      if (parts[1] === "PM" && h < 12) h += 12;
      if (parts[1] === "AM" && h === 12) h = 0;
      hours = h;
      minutes = m;
    }

    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours, minutes, 0, 0);

    setIsSubmitting(true);

    const res = await submitDemoBookingAction({
      studentProfileId: selectedProfileId,
      tutorSlug: tutor.id,
      subject: selectedSubject,
      scheduledStartAt: scheduledDate.toISOString(),
      learningGoal,
    });

    setIsSubmitting(false);

    if (res.success && res.bookingId) {
      router.push("/demo/confirmation?booking_id=" + res.bookingId);
    } else {
      setBookingError(res.error || "Failed to schedule free demo. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href={"/tutors/" + tutor.id}
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition-colors"
          >
            &larr; Back to profile
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-3.5 py-1 text-xs font-bold text-[#244A40] mb-3">
              <IconVideo size={13} />
              <span>1-on-1 Free Online Demo</span>
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[#25231F]">
              Book Your Free 30-Min Demo
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#6F6A62]">
              Experience concept explanations and pedagogical tempo with{" "}
              <strong className="text-[#25231F]">{tutor.name}</strong> before choosing any package.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Booking Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[rgba(55,48,40,0.10)] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
              {/* Section 1: Learner Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#9B958C]">
                    1. Learner Profile
                  </label>
                  {profiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowCreateProfile((p) => !p)}
                      className="text-xs font-bold text-[#315F52] hover:underline min-h-[44px] flex items-center"
                    >
                      {showCreateProfile ? "Select Existing" : "+ Add Learner"}
                    </button>
                  )}
                </div>

                {showCreateProfile ? (
                  <div className="rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFFBF5] p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#244A40]">
                      <IconUser size={14} />
                      <span>Create Learner Profile</span>
                    </div>

                    {profileError && (
                      <div className="rounded-xl bg-[#FDE8E4] px-3 py-2 text-xs text-[#BA5945]">
                        {profileError}
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-bold text-[#6F6A62] mb-1">
                          Student Name
                        </label>
                        <input
                          type="text"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          placeholder="e.g. Aarav"
                          className="w-full min-h-[44px] rounded-xl border border-[rgba(55,48,40,0.15)] bg-white px-3 py-2 text-xs text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6F6A62] mb-1">
                          Class Level
                        </label>
                        <select
                          value={newClassLevel}
                          onChange={(e) => setNewClassLevel(e.target.value)}
                          className="w-full min-h-[44px] rounded-xl border border-[rgba(55,48,40,0.15)] bg-white px-3 py-2 text-xs text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                        >
                          {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6F6A62] mb-1">
                          Board
                        </label>
                        <select
                          value={newBoard}
                          onChange={(e) => setNewBoard(e.target.value)}
                          className="w-full min-h-[44px] rounded-xl border border-[rgba(55,48,40,0.15)] bg-white px-3 py-2 text-xs text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                        >
                          {["CBSE", "ICSE", "State Board", "IGCSE / IB"].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateProfile}
                      disabled={isCreatingProfile}
                      className="btn btn-primary min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl"
                    >
                      {isCreatingProfile ? "Saving Profile..." : "Save Profile"}
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProfileId(p.id)}
                        className={"min-h-[48px] text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between " + (
                          selectedProfileId === p.id
                            ? "border-[#315F52] bg-[#E4EEE9] text-[#244A40] shadow-xs font-bold"
                            : "border-[rgba(55,48,40,0.10)] bg-[#FFFBF5] text-[#25231F] hover:border-[rgba(55,48,40,0.20)]"
                        )}
                      >
                        <div>
                          <div className="text-xs font-bold">{p.display_name}</div>
                          <div className="text-[11px] text-[#6F6A62]">
                            {p.class_level} &bull; {p.board}
                          </div>
                        </div>
                        {selectedProfileId === p.id && <IconCheck size={16} className="text-[#315F52]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Subject & Goal */}
              <div className="border-t border-[rgba(55,48,40,0.08)] pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#9B958C] block mb-3">
                  2. Select Focus Subject
                </label>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubject(sub)}
                      className={"min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold border transition-all " + (
                        selectedSubject === sub
                          ? "bg-[#25231F] text-white border-[#25231F]"
                          : "bg-white text-[#25231F] border-[rgba(55,48,40,0.15)] hover:border-[#315F52]"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] font-bold text-[#6F6A62] mb-1">
                    Learning Goal / Hesitation Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    placeholder="e.g. Quadratic equations, sound waves, or essay writing"
                    className="w-full min-h-[44px] rounded-xl border border-[rgba(55,48,40,0.15)] bg-white px-3 py-2 text-xs text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Section 3: Dynamic Date & Slot Selection */}
              <div className="border-t border-[rgba(55,48,40,0.08)] pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#9B958C] block mb-3">
                  3. Select Preferred Date &amp; Time (Asia/Kolkata)
                </label>

                {/* Dynamic Dates */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                  {dynamicDates.map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.date);
                        if (item.slots.length > 0) {
                          setSelectedSlot(item.slots[0]);
                        }
                      }}
                      className={"min-h-[48px] p-2.5 rounded-xl border text-center transition-all " + (
                        selectedDate === item.date
                          ? "border-[#315F52] bg-[#E4EEE9] text-[#244A40] font-bold shadow-2xs"
                          : "border-[rgba(55,48,40,0.10)] bg-white text-[#25231F] hover:border-[rgba(55,48,40,0.20)]"
                      )}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-[#6F6A62]">{item.slots.length} slots</div>
                    </button>
                  ))}
                </div>

                {/* Slots */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={"min-h-[44px] p-2 rounded-xl border text-xs font-bold transition-all " + (
                        selectedSlot === slot
                          ? "bg-[#315F52] text-white border-[#315F52]"
                          : "bg-[#FFFBF5] text-[#25231F] border-[rgba(55,48,40,0.10)] hover:border-[#315F52]"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Error */}
              {bookingError && (
                <div className="rounded-2xl bg-[#FDE8E4] p-4 text-xs font-semibold text-[#BA5945] border border-[#BA5945]/20">
                  {bookingError}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting || profiles.length === 0}
                  className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-extrabold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
                >
                  <span>{isSubmitting ? "Confirming Booking..." : "Confirm Free Demo Booking"}</span>
                  <IconArrowRight size={15} />
                </button>
                <p className="mt-2 text-center text-[11px] text-[#9B958C]">
                  Duration: Exactly 30 minutes &bull; Free evaluation (₹0) &bull; No card required
                </p>
              </div>
            </div>

            {/* Right: Tutor Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#E4EEE9] text-base font-extrabold text-[#244A40]">
                    {tutor.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                      {tutor.name}
                    </h3>
                    <p className="text-xs text-[#6F6A62]">{tutor.headline}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[rgba(55,48,40,0.08)] pt-4 text-xs text-[#6F6A62]">
                  <div className="flex items-center justify-between">
                    <span>Format:</span>
                    <span className="font-bold text-[#25231F]">Online Classroom</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-bold text-[#25231F]">30 Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fee:</span>
                    <span className="font-bold text-[#315F52]">₹0 Free Demo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>City:</span>
                    <span className="font-bold text-[#25231F]">{tutor.city}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFF7ED] p-4 text-xs text-[#6F6A62] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#25231F]">
                  <IconCheck size={14} className="text-[#315F52]" />
                  <span>How the demo works</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Join the interactive digital room at your chosen time. The educator will walk through fundamental concepts, address doubts, and recommend a weekly learning rhythm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
