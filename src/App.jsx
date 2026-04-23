import React, { useState } from "react";

const categories = [
  { value: "cafe", label: "카페" },
  { value: "food", label: "식사/배달" },
  { value: "store", label: "편의점" },
  { value: "shopping", label: "쇼핑" },
];

const situations = ["혼자", "친구와", "스트레스", "심심함", "보상 심리"];

function CardBox({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-white/40 bg-white/85 shadow-lg backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function App() {
  const [step, setStep] = useState("hero");
  const [amount, setAmount] = useState("5500");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("혼자");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe9f2,_#fff7fb_38%,_#f6f3ff_76%,_#f5f5f7_100%)] px-4 py-6 text-zinc-900 md:py-10">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-700 shadow-sm">
            배포 테스트용 MVP
          </span>
          <div className="text-xs text-zinc-500">첫 경험 · 공감 반응 검증</div>
        </div>

        {step === "hero" && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111113_0%,#1d1b28_45%,#3d234f_100%)] text-white shadow-[0_24px_80px_rgba(46,18,76,0.35)]">
              <div className="relative p-7">
                <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />

                <div className="relative flex items-center justify-between text-sm text-white/65">
                  <span>오늘의 소비를 한 문장으로</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                    Spend Story
                  </span>
                </div>

                <div className="relative mt-10 space-y-5">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <span className="text-sm">☕</span>
                  </div>

                  <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                    소비를 기록하면,
                    <br />
                    하루를 한 문장으로 남겨줍니다
                  </h1>

                  <p className="max-w-sm text-sm leading-6 text-white/70">
                    오늘의 소비를 입력하면, 당신의 하루를 공감되는 한 문장으로 정리해줍니다.
                  </p>
                </div>

                <div className="relative mt-8 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-white/85 backdrop-blur-sm">
                  설명보다 먼저, “나 같네” 싶은 순간을 만드는 소비 문장 카드
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep("input")}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 text-base font-medium text-white shadow-lg transition hover:opacity-95"
              type="button"
            >
              오늘 소비 기록하기
            </button>
          </div>
        )}

        {step === "input" && (
          <CardBox>
            <div className="p-6">
              <div className="mb-5 space-y-1">
                <div className="text-lg font-semibold">오늘의 소비를 입력해봐</div>
                <p className="text-sm text-zinc-500">
                  짧게 입력할수록 결과가 더 직관적으로 보입니다.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-medium">금액</div>
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    placeholder="예: 5500"
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-zinc-400"
                  />
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">카테고리</div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-zinc-400"
                  >
                    {categories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">상황</div>
                  <select
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-zinc-400"
                  >
                    {situations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep("hero")}
                  className="h-12 rounded-2xl bg-zinc-100 text-zinc-800 transition hover:bg-zinc-200"
                  type="button"
                >
                  이전
                </button>
                <button
                  className="h-12 rounded-2xl bg-zinc-950 text-white transition hover:opacity-95"
                  type="button"
                >
                  결과 보기
                </button>
              </div>
            </div>
          </CardBox>
        )}
      </div>
    </div>
  );
}

export default App;
