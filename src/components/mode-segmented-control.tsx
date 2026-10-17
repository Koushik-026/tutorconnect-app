"use client";

import React, { useRef, useState, useEffect, useId, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconVideo, IconHomeTuition } from "./ui/icons";

export type TuitionMode = "online" | "home" | "both";

interface ModeOption {
  key: TuitionMode;
  label: string;
  icon?: React.ReactNode;
}

const options: ModeOption[] = [
  { key: "online", label: "Online", icon: <IconVideo size={13} /> },
  { key: "home", label: "Home", icon: <IconHomeTuition size={13} /> },
  { key: "both", label: "Both" },
];

interface ModeSegmentedControlProps {
  initialMode?: string;
  onChange?: (mode: TuitionMode) => void;
  className?: string;
}

function getNormalizedMode(raw?: string | null): TuitionMode {
  if (raw === "online") return "online";
  if (raw === "home") return "home";
  return "both";
}

export function ModeSegmentedControl({
  initialMode,
  onChange,
  className = "",
}: ModeSegmentedControlProps) {
  const router = useRouter();
  const groupId = useId();

  const [localMode, setLocalMode] = useState<TuitionMode>(() => getNormalizedMode(initialMode));

  // Determine active mode: if initialMode is provided, prioritize it
  const activeMode = initialMode !== undefined ? getNormalizedMode(initialMode) : localMode;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 4,
    width: 0,
  });
  const [hasMeasured, setHasMeasured] = useState(false);

  // Robust measurement of active indicator relative to container
  const updateMeasurements = useCallback(() => {
    const activeIndex = options.findIndex((opt) => opt.key === activeMode);
    const activeButton = buttonRefs.current[activeIndex];
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
      setHasMeasured(true);
    }
  }, [activeMode]);

  // Measure on activeMode change and setup ResizeObserver + window listeners
  useEffect(() => {
    updateMeasurements();

    const container = containerRef.current;
    if (!container) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateMeasurements();
      });
      resizeObserver.observe(container);
      buttonRefs.current.forEach((btn) => {
        if (btn) resizeObserver?.observe(btn);
      });
    }

    const handleResize = () => {
      updateMeasurements();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Font loading can shift text width
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        updateMeasurements();
      }).catch(() => {});
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [updateMeasurements]);

  const selectMode = useCallback(
    (mode: TuitionMode) => {
      setLocalMode(mode);

      if (onChange) {
        onChange(mode);
        return;
      }

      if (typeof window !== "undefined") {
        const current = new URLSearchParams(window.location.search);
        if (mode === "both") {
          current.delete("mode");
        } else {
          current.set("mode", mode);
        }

        const query = current.toString();
        const destination = query ? `/tutors?${query}` : "/tutors";
        router.push(destination, { scroll: false });
      }
    },
    [onChange, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (index + 1) % options.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = options.length - 1;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      const nextMode = options[nextIndex].key;
      selectMode(nextMode);
      buttonRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Tuition Mode"
      id={groupId}
      className={`relative inline-flex items-center rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-1 ${className}`}
    >
      {/* Gliding Active Indicator */}
      {hasMeasured && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-[var(--tc-surface)] shadow-xs transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      )}

      {/* Segment Buttons */}
      {options.map((option, index) => {
        const isSelected = activeMode === option.key;

        return (
          <button
            key={option.key}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => selectMode(option.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative z-10 inline-flex min-h-[34px] min-w-[70px] sm:min-w-[80px] items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tc-primary)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--tc-bg)] cursor-pointer select-none ${
              isSelected
                ? "text-[var(--tc-primary)] font-extrabold"
                : "text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)]"
            }`}
          >
            {option.icon && (
              <span
                className={`transition-colors duration-180 ${
                  isSelected ? "text-[var(--tc-primary)]" : "text-[var(--tc-text-secondary)]"
                }`}
              >
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
