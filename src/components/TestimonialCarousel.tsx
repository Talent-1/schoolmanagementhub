"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  role?: string;
  avatar?: string | null;
};

export default function TestimonialCarousel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const isPointerDown = useRef(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data?.data) setItems(data.data);
      })
      .catch(() => {
        // fallback to a small inline set
        if (mounted)
          setItems([
            { id: 1, quote: "HillCity made onboarding fast.", name: "Aisha M." },
          ]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5500);
    return () => clearInterval(t);
  }, [items]);

  const prev = () => setIndex((i) => (items.length ? (i - 1 + items.length) % items.length : 0));
  const next = () => setIndex((i) => (items.length ? (i + 1) % items.length : 0));

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) prev();
    else if (dx < -40) next();
    startX.current = null;
  }

  // Pointer (mouse) drag for desktop
  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    isPointerDown.current = true;
    startX.current = e.clientX;
  }
  function onPointerMove() {
    if (!isPointerDown.current || startX.current == null) return;
    // no-op during move; logic on up
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!isPointerDown.current || startX.current == null) return;
    const dx = e.clientX - startX.current;
    if (dx > 40) prev();
    else if (dx < -40) next();
    isPointerDown.current = false;
    startX.current = null;
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  const t = items[index];

  return (
    <section
      className="rounded-[1.5rem] border border-white/8 bg-slate-950/80 p-6 shadow-sm"
      tabIndex={0}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full p-1">
          {t?.avatar ? (
            <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full" />
          ) : (
            <div className="rounded-full bg-linear-to-br from-cyan-400 via-sky-500 to-indigo-600 h-10 w-10 flex items-center justify-center">
              <Image src="/HillCity-logo.svg" alt="logo" width={28} height={28} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <blockquote className="text-lg leading-7 text-white animate-fade-in-up">
            “{t?.quote ?? "Loading..."}”
          </blockquote>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-white">{t?.name ?? "—"}</p>
              <p className="text-xs text-slate-400">{t?.role ?? ""}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="h-8 w-8 rounded-full bg-white/6 text-white/90"
              >
                ‹
              </button>
              <div className="flex items-center gap-2">
                {items.length
                  ? items.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Show testimonial ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-2 w-8 rounded-full transition-all duration-200 ${
                          i === index ? "bg-cyan-400" : "bg-white/10"
                        }`}
                      />
                    ))
                  : null}
              </div>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="h-8 w-8 rounded-full bg-white/6 text-white/90"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
