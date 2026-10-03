"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import type { Tutor } from "@/lib/types";
import type { StudentProfile } from "@/lib/types/database";
import {
  submitDemoBookingAction,
  createLearnerProfileAction,
} from "@/app/actions/workflow";
import {
  IconClock,
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

const availableSlots: Record<string, string[]> = {
  "2026-10-05": ["10:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
  "2026-10-06": ["11:30 AM", "03:00 PM", "05:00 PM", "07:00 PM"],
  "2026-10-07": ["09:30 AM", "01:00 PM", "04:00 PM", "06:30 PM"],
  "2026-10-08": ["10:00 AM", "02:30 PM", "05:00 PM"],
  "2026-10-09": ["11:00 AM", "03:30 PM", "06:00 PM", "07:30 PM"],
};

const dateOptions = [
  { date: "2026-10-05", label: "Mon, Oct 5", note: "4 slots" },
  { date: "2026-10-06", label: "Tue, Oct 6", note: "4 slots" },
  { date: "2026-10-07", label: "Wed, Oct 7", note: "4 slots" },
  { date: "2026-10-08", label: "Thu, Oct 8", note: "3 slots" },
  { date: "2026-10-09", label: "Fri, Oct 9", note: "4 slots" },
];

export function DemoBookForm({
  tutor,
  initialProfiles,
  isAuthenticated,
}: DemoBookFormProps) {
  const router = useRouter();

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
  const [selectedDate, setSelectedDate] = useState("2026-10-05");
  const [selectedSlot, setSelectedSlot] = useState("04:30 PM");
  const [selectedSubject, setSelectedSubject] = useState(
    tutor.subjects[0] || "Mathematics"
  );
  const [learningGoal, setLearningGoal] = useState(
    "Clarify core concept fundamentals and build exam problem-solving confidence."
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const currentSlots = availableSlots[selectedDate] || [
    "10:00 AM",
    "02:00 PM",
    "05:00 PM",
  ];

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!newDisplayName.trim()) {
      setProfileError("Please provide learner's name.");
      return;
    }

    setIsCreatingProfile(true);
    setProfileError("");

    const formData = new FormData();
    formData.append("display_name", newDisplayName);
    formData.append("class_level", newClassLevel);
    formData.append("board", newBoard);

    const res = await createLearnerProfileAction(formData);
    setIsCreatingProfile(false);

    if (res.success && res.profile) {
      const created = res.profile as StudentProfile;
      setProfiles((prev) => [...prev, created]);
      setSelectedProfileId(created.id);
      setShowCreateProfile(false);
    } else {
      setProfileError(res.error || "Failed to create learner profile.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBookingError("");

    if (!selectedProfileId && profiles.length > 0) {
      setBookingError("Please select a student profile.");
      return;
    }

    // Convert date + slot to ISO start string
    // e.g. "2026-10-05" + "04:30 PM"
    const [time, period] = selectedSlot.split(" ");
    const [hourStr, minStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const scheduledDate = new Date(`${selectedDate}T00:00:00`);
    scheduledDate.setHours(hour, parseInt(minStr, 10), 0, 0);

    setIsSubmitting(true);

    if (!isAuthenticated) {
      // Offline / unauthenticated demo fallback
      const query = new URLSearchParams({
        tutor: tutor.id,
        date: selectedDate,
        time: selectedSlot,
        student: "Demo Learner",
        subject: selectedSubject,
      });
      router.push(`/demo/confirmation?${query.toString()}`);
      return;
    }

    const res = await submitDemoBookingAction({
      studentProfileId: selectedProfileId,
      tutorSlug: tutor.id,
      tutorName: tutor.name,
      subject: selectedSubject,
      scheduledStartAt: scheduledDate.toISOString(),
      learningGoal,
    });

    setIsSubmitting(false);

    if (res.success && res.bookingId) {
      router.push(`/demo/confirmation?booking_id=${res.bookingId}&tutor=${tutor.id}`);
    } else {
      setBookingError(res.error || "Failed to confirm demo booking.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={`/tutors/${tutor.id}`}
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
          >
            &larr; Back to Tutor
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-3.5 py-1 text-xs font-bold text-[#244A40]">
              <IconVideo size={13} />
              <span>Free 30-Minute Online Trial &bull; ₹0 Payment</span>
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#25231F]">
              Schedule Your Free Demo
            </h1>
            <p className="mt-2 text-sm text-[#6F6A62]">
              Connect 1-on-1 with <strong className="text-[#25231F]">{tutor.name}</strong> to evaluate teaching rapport before choosing any package.
            </p>
          </div>

          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-8">
            {/* 1. Student Profile Selection / Inline Creation */}
            <div className="border-b border-[rgba(55,48,40,0.08)] pb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62]">
                  1. Learner Profile
                </label>
                {profiles.length > 0 && !showCreateProfile && (
                  <button
                    type="button"
                    onClick={() => setShowCreateProfile(true)}
                    className="text-xs font-bold text-[#315F52] hover:underline"
                  >
                    + Add Another Learner
                  </button>
                )}
              </div>

              {showCreateProfile ? (
                <form
                  onSubmit={handleCreateProfile}
                  className="rounded-2xl border border-[#315F52]/30 bg-[#F4F8F6] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#244A40]">
                      Create Learner Profile
                    </span>
                    {profiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowCreateProfile(false)}
                        className="text-[11px] font-semibold text-[#6F6A62]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {profileError && (
                    <div className="rounded-xl bg-[#FEE2E2] p-2.5 text-xs text-[#DC2626] font-semibold">
                      {profileError}
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6F6A62] block mb-1">
                        Learner Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Mehta"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-[rgba(55,48,40,0.12)] bg-white px-3 py-2 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6F6A62] block mb-1">
                        Class / Grade *
                      </label>
                      <select
                        value={newClassLevel}
                        onChange={(e) => setNewClassLevel(e.target.value)}
                        className="w-full rounded-xl border border-[rgba(55,48,40,0.12)] bg-white px-3 py-2 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                      >
                        {[
                          "Class 6",
                          "Class 7",
                          "Class 8",
                          "Class 9",
                          "Class 10",
                          "Class 11",
                          "Class 12",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6F6A62] block mb-1">
                        Board *
                      </label>
                      <select
                        value={newBoard}
                        onChange={(e) => setNewBoard(e.target.value)}
                        className="w-full rounded-xl border border-[rgba(55,48,40,0.12)] bg-white px-3 py-2 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                      >
                        {["CBSE", "ICSE", "State Board", "IB / IGCSE"].map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingProfile}
                    className="btn btn-primary min-h-[40px] px-5 rounded-full text-xs font-bold"
                  >
                    {isCreatingProfile ? "Saving Profile..." : "Save Learner Profile"}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profiles.map((p) => {
                    const isSelected = selectedProfileId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProfileId(p.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-[#315F52] bg-[#E4EEE9]/40 shadow-xs"
                            : "border-[rgba(55,48,40,0.10)] bg-[#FFF7ED] hover:border-[#315F52]/40"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm ${
                            isSelected
                              ? "bg-[#315F52] text-white"
                              : "bg-white text-[#6F6A62]"
                          }`}
                        >
                          <IconUser size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#25231F]">
                            {p.display_name}
                          </p>
                          <p className="text-[11px] text-[#6F6A62]">
                            {p.class_level} &bull; {p.board}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Primary Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {bookingError && (
                <div className="rounded-xl bg-[#FEE2E2] p-3 text-xs text-[#DC2626] font-semibold">
                  {bookingError}
                </div>
              )}

              {/* 2. Date Selection Pills */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block mb-3">
                  2. Select Preferred Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(opt.date);
                        setSelectedSlot(availableSlots[opt.date]?.[0] || "10:00 AM");
                      }}
                      className={`rounded-2xl border p-3.5 text-center transition-all ${
                        selectedDate === opt.date
                          ? "border-[#315F52] bg-[#E4EEE9]/50 shadow-xs"
                          : "border-[rgba(55,48,40,0.10)] bg-[#FFF7ED] hover:border-[#315F52]/40"
                      }`}
                    >
                      <p
                        className={`text-xs font-bold ${
                          selectedDate === opt.date ? "text-[#244A40]" : "text-[#25231F]"
                        }`}
                      >
                        {opt.label}
                      </p>
                      <span className="text-[10px] font-semibold text-[#6F6A62] mt-0.5 block">
                        {opt.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Time Slot Selection */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block mb-3">
                  3. Select 30-Minute Online Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {currentSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center justify-center gap-1.5 rounded-2xl border py-3 px-4 text-xs font-bold transition-all ${
                        selectedSlot === slot
                          ? "border-[#315F52] bg-[#315F52] text-white shadow-xs"
                          : "border-[rgba(55,48,40,0.10)] bg-[#FFF7ED] text-[#25231F] hover:border-[#315F52]/40"
                      }`}
                    >
                      <IconClock size={13} />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Subject Selection & Goal */}
              <div className="border-t border-[rgba(55,48,40,0.08)] pt-6 space-y-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block">
                  4. Tuition Focus
                </label>

                <div>
                  <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                    Subject for Demo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSubject(s)}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                          selectedSubject === s
                            ? "bg-[#315F52] text-white shadow-xs"
                            : "bg-[#FFF7ED] border border-[rgba(55,48,40,0.12)] text-[#25231F] hover:border-[#315F52]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                    Focus Topics / Specific Concept Questions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] p-3 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="border-t border-[rgba(55,48,40,0.08)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#315F52] font-semibold">
                  <IconCheck size={16} />
                  <span>Free demo &bull; Exactly 30 minutes &bull; Online 1-on-1</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (profiles.length === 0 && !selectedProfileId)}
                  className="btn btn-primary w-full sm:w-auto min-h-[48px] px-8 rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Confirming..." : "Confirm Free Demo"}</span>
                  <IconArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
