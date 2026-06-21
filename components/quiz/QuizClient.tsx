"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EmailCapture } from "@/components/EmailCapture";
import { questions, resolveResult, type Answers } from "@/data/quiz";
import styles from "./Quiz.module.css";

const STORAGE_KEY = "tls-quiz";
const TOTAL = questions.length;

// sport answer → the most relevant on-site buying guide
const GUIDE_FOR: Record<string, string> = {
  "road-cycling": "/buying-guides/cycling",
  gravel: "/buying-guides/cycling",
  running: "/buying-guides/running",
  triathlon: "/buying-guides/running",
  "gym-multi": "/buying-guides/gym",
  climbing: "/buying-guides",
};

const BUDGET_LABEL: Record<string, string> = {
  "under-500": "under €500",
  "500-1500": "€500–1,500",
  "1500-5000": "€1,500–5,000",
  "no-ceiling": "no ceiling",
};

type Phase = "intro" | "questions" | "result";

export function QuizClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  // restore progress on refresh
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { phase: Phase; step: number; answers: Answers };
      if (saved.answers) setAnswers(saved.answers);
      if (saved.phase) setPhase(saved.phase);
      if (typeof saved.step === "number") setStep(saved.step);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, step, answers }));
    } catch {
      /* ignore */
    }
  }, [phase, step, answers]);

  const result = useMemo(
    () => (phase === "result" ? resolveResult(answers) : null),
    [phase, answers],
  );

  function choose(qid: string, value: string) {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    if (step < TOTAL - 1) {
      setStep(step + 1);
    } else {
      setPhase("result");
    }
  }

  function back() {
    if (phase === "result") {
      setPhase("questions");
      setStep(TOTAL - 1);
      return;
    }
    if (step > 0) setStep(step - 1);
    else setPhase("intro");
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setUnlocked(false);
    setPhase("intro");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function copyShare(profileName: string) {
    const url = typeof window !== "undefined" ? `${window.location.origin}/find-your-watch` : "";
    const text = `My watch profile from The Long Second: “${profileName}”. Find yours: ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  // ── intro ──
  if (phase === "intro") {
    return (
      <div className={styles.stage}>
        <div className={styles.intro}>
          <p className={styles.kicker}>Find your watch</p>
          <h1 className={styles.introTitle}>
            Seven questions. One honest recommendation.
          </h1>
          <p className={styles.introBody}>
            Not a personality test — a diagnostic. Tell us how you train, what you’ll
            spend, and whether you want a watch you wind or one that tracks you, and we’ll
            name the real pieces worth your money.
          </p>
          <button type="button" className={styles.primary} onClick={() => setPhase("questions")}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // ── result ──
  if (phase === "result" && result) {
    const { profile, recommendations } = result;
    const [first, ...rest] = recommendations;
    const guide = GUIDE_FOR[answers.sport] ?? "/buying-guides";
    return (
      <div className={styles.stage}>
        <div className={styles.result}>
          <div className={styles.resultHead}>
            <p className={styles.kicker}>Your profile</p>
            <h1 className={styles.profileName}>{profile.name}</h1>
            <p className={styles.profileTagline}>{profile.tagline}</p>
          </div>

          <ol className={styles.recs}>
            <li className={styles.rec}>
              <RecCard rec={first} index={1} />
            </li>

            {!unlocked ? (
              <li className={styles.gateWrap}>
                <div className={styles.lockedPreview} aria-hidden="true">
                  {rest.map((r, i) => (
                    <div key={r.name} className={styles.lockedRow}>
                      <span>{String(i + 2).padStart(2, "0")}</span>
                      <span className={styles.lockedBar} />
                    </div>
                  ))}
                </div>
                <div className={styles.gate}>
                  <EmailCapture
                    variant="gate"
                    source="quiz"
                    sport={answers.sport}
                    budget={answers.budget}
                    profile={profile.name}
                    hook="Unlock your full watch profile."
                    offer={`Your other recommendations at ${BUDGET_LABEL[answers.budget] ?? "your budget"}, the full ${profile.name} write-up, and the athlete’s buying guide — straight to your inbox.`}
                    cta="Unlock result"
                    onSuccess={() => setUnlocked(true)}
                  />
                </div>
              </li>
            ) : (
              rest.map((r, i) => (
                <li key={r.name} className={styles.rec}>
                  <RecCard rec={r} index={i + 2} />
                </li>
              ))
            )}
          </ol>

          {unlocked && (
            <div className={styles.unlockedExtra}>
              <p className={styles.profileBlurb}>{profile.blurb}</p>
              <div className={styles.resultActions}>
                <Link href={guide} className={styles.primary}>
                  Read the {answers.sport === "running" ? "running" : "buying"} guide →
                </Link>
                <button
                  type="button"
                  className={styles.ghost}
                  onClick={() => copyShare(profile.name)}
                >
                  {copied ? "Link copied" : "Share result"}
                </button>
              </div>
            </div>
          )}

          <div className={styles.resultFoot}>
            <button type="button" className={styles.textBtn} onClick={back}>
              ← Change an answer
            </button>
            <button type="button" className={styles.textBtn} onClick={restart}>
              Start over
            </button>
          </div>
          <p className={styles.disclaimer}>
            Real picks at approximate prices — confirm specs and availability before you
            buy. We take no commission on these recommendations.
          </p>
        </div>
      </div>
    );
  }

  // ── questions ──
  const q = questions[step];
  return (
    <div className={styles.stage}>
      <div className={styles.quizHead}>
        <button type="button" className={styles.textBtn} onClick={back}>
          ← Back
        </button>
        <span className={styles.progress} aria-hidden="true">
          {String(step + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <span className={styles.progressFill} style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
      </div>

      <p ref={liveRef} className={styles.srOnly} aria-live="polite">
        Question {step + 1} of {TOTAL}
      </p>

      <div key={q.id} className={styles.question}>
        <div className={styles.questionHead} id={`q-${q.id}`}>
          <h2 className={styles.prompt}>{q.prompt}</h2>
          {q.help && <p className={styles.help}>{q.help}</p>}
        </div>

        <div className={styles.options} role="group" aria-labelledby={`q-${q.id}`}>
          {q.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={styles.option}
              aria-pressed={answers[q.id] === opt.value}
              data-selected={answers[q.id] === opt.value || undefined}
              onClick={() => choose(q.id, opt.value)}
            >
              <span className={styles.optLabel}>{opt.label}</span>
              {opt.hint && <span className={styles.optHint}>{opt.hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecCard({
  rec,
  index,
}: {
  rec: import("@/data/quiz").Recommendation;
  index: number;
}) {
  const inner = (
    <>
      <div className={styles.recHead}>
        <span className={styles.recNum}>{String(index).padStart(2, "0")}</span>
        <span className={styles.recBrand}>{rec.brand}</span>
        <span className={styles.recMovement}>{rec.movement === "gps" ? "GPS" : "Mechanical"}</span>
      </div>
      <h3 className={styles.recName}>{rec.name}</h3>
      <p className={styles.recReason}>{rec.reason}</p>
      <div className={styles.recFoot}>
        <span className={styles.recPrice}>{rec.priceEUR}</span>
        {rec.affiliateUrl && <span className={styles.recLink}>Where to buy ↗</span>}
      </div>
    </>
  );
  return rec.affiliateUrl ? (
    <a className={styles.recCard} href={rec.affiliateUrl} rel="nofollow noreferrer" target="_blank">
      {inner}
    </a>
  ) : (
    <div className={styles.recCard}>{inner}</div>
  );
}
