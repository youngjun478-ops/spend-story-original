import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Coffee, MessageCircleHeart, Share2, Sparkles, Store, UtensilsCrossed, Wallet } from "lucide-react";

type Step = "hero" | "input" | "result";
type Reaction = "up" | "down" | null;

type RecordItem = {
  id: number;
  amount: string;
  category: string;
  situation: string;
  title: string;
  date: string;
};

type LinePack = {
  title: string;
  subtitle: string;
};

const categories = [
  { value: "cafe", label: "카페", icon: Coffee },
  { value: "food", label: "식사/배달", icon: UtensilsCrossed },
  { value: "store", label: "편의점", icon: Store },
  { value: "shopping", label: "쇼핑", icon: Wallet },
];

const situations = ["혼자", "친구와", "스트레스", "심심함", "보상 심리"];

const lineLibrary: Record<string, LinePack[]> = {
  "cafe|혼자": [
    { title: "버티려고 들어갔는데, 생각보다 오래 있었다", subtitle: "혼자 있는 시간이 필요했던 날은 커피보다 자리가 더 중요했다." },
    { title: "집에 가기 싫어서 들어간 건데, 나올 이유도 없었다", subtitle: "목적이 있는 소비라기보다 잠깐 기대고 싶은 마음에 가까웠다." },
    { title: "공부하러 왔다기보다, 그냥 앉아 있고 싶었다", subtitle: "할 일이 있었지만 오늘의 집중은 카페의 분위기에 먼저 기대고 있었다." },
    { title: "커피보다 자리가 더 필요했던 날이었다", subtitle: "오늘의 소비는 음료가 아니라 머물 공간을 사는 쪽에 가까웠다." },
  ],
  "food|스트레스": [
    { title: "배고파서라기보다, 그냥 시켰다", subtitle: "오늘의 소비는 허기를 채운 게 아니라 마음을 잠깐 눌러둔 쪽에 가까웠다." },
    { title: "먹고 싶은 건 아니었는데, 그냥 먹었다", subtitle: "선택의 이유가 분명하지 않을수록 감정이 먼저 움직였을 가능성이 크다." },
    { title: "기분이 나빠서 시켰는데, 딱히 나아지진 않았다", subtitle: "배달은 빠르게 도착했지만 마음은 그렇게 빨리 정리되지 않았다." },
    { title: "오늘은 음식이 아니라 핑계를 시킨 느낌이다", subtitle: "그 순간의 주문은 해결책보다는 잠깐의 멈춤에 가까웠다." },
  ],
  "store|심심함": [
    { title: "필요 없는데도 손이 갔다", subtitle: "작은 금액일수록 이유보다 기분이 먼저 움직이는 순간이 있다." },
    { title: "심심해서 나왔는데, 뭔가를 사긴 했다", subtitle: "목적 없는 외출은 생각보다 자주 목적 없는 지출로 이어진다." },
    { title: "딱히 사고 싶은 건 없었는데, 그냥 하나 집었다", subtitle: "선택의 크기는 작아도 그날의 마음은 꽤 정확하게 드러난다." },
    { title: "이 정도는 괜찮겠지, 라고 생각했다", subtitle: "가벼운 지출일수록 스스로를 설득하는 속도도 빨라진다." },
  ],
  "shopping|보상 심리": [
    { title: "굳이 안 사도 됐는데, 오늘은 조금 필요했다", subtitle: "소비라기보다 스스로에게 건넨 작은 핑계 같은 선택이었다." },
    { title: "참으려고 했는데, 오늘은 그냥 샀다", subtitle: "버틴 하루 끝에 생기는 허용의 순간은 생각보다 단단하다." },
    { title: "필요한 건 아니었는데, 갖고 싶긴 했다", subtitle: "욕구와 필요가 어긋날 때, 사람은 대체로 욕구 쪽으로 조금 더 기운다." },
    { title: "돈을 썼다기보다, 나를 달랬다", subtitle: "오늘의 선택은 효율보다 감정 회복에 가까운 방향이었다." },
  ],
  fallback: [
    { title: "별일 없는 줄 알았는데, 마음이 먼저 움직인 하루였다", subtitle: "소비를 돌아보면 오늘의 감정선이 생각보다 또렷하게 남는다." },
    { title: "그냥 지나간 하루인 줄 알았는데, 소비는 남았다", subtitle: "기록이 남는 순간 평범한 하루도 생각보다 구체적인 장면이 된다." },
    { title: "지금 보면 별거 아닌데, 그땐 필요했다", subtitle: "그 순간 자연스러웠던 선택은 나중에 보면 꽤 솔직한 힌트가 된다." },
    { title: "굳이 안 해도 될 선택이었는데, 그냥 했다", subtitle: "아주 작은 소비에도 그날의 기분은 의외로 정확하게 스며든다." },
  ],
};

function pickCategoryLabel(value: string) {
  return categories.find((c) => c.value === value)?.label ?? value;
}

function buildResult(category: string, situation: string, amount: string): LinePack {
  const key = `${category}|${situation}`;
  const pool = lineLibrary[key] ?? lineLibrary.fallback;
  const numeric = Number(amount || 0);
  const index = Math.abs((numeric || 1) + key.length) % pool.length;
  return pool[index];
}

function CardBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-white/40 bg-white/85 shadow-lg backdrop-blur ${className}`}>{children}</div>;
}

export default function ViralMVP() {
  const [step, setStep] = useState<Step>("hero");
  const [amount, setAmount] = useState("5500");
  const [category, setCategory] = useState("cafe");
  const [situation, setSituation] = useState("혼자");
  const [reacted, setReacted] = useState<Reaction>(null);
  const [savedRecords, setSavedRecords] = useState<RecordItem[]>([
    {
      id: 1,
      amount: "5500",
      category: "cafe",
      situation: "혼자",
      title: "버티려고 들어갔는데, 생각보다 오래 있었다",
      date: new Date().toISOString(),
    },
  ]);

  const result = useMemo(() => buildResult(category, situation, amount), [category, situation, amount]);
  const CategoryIcon = categories.find((c) => c.value === category)?.icon ?? Coffee;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe9f2,_#fff7fb_38%,_#f6f3ff_76%,_#f5f5f7_100%)] px-4 py-6 text-zinc-900 md:py-10">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-700 shadow-sm">배포 테스트용 MVP</span>
          <div className="text-xs text-zinc-500">첫 경험 · 공감 반응 검증</div>
        </div>

        <AnimatePresence mode="wait">
          {step === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111113_0%,#1d1b28_45%,#3d234f_100%)] text-white shadow-[0_24px_80px_rgba(46,18,76,0.35)]">
                <div className="relative p-7">
                  <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-3xl" />
                  <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />

                  <div className="relative flex items-center justify-between text-sm text-white/65">
                    <span>오늘의 소비를 한 문장으로</span>
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div className="relative mt-10 space-y-5">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur">
                      <Coffee className="h-5 w-5" />
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
              >
                오늘 소비 기록하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CardBox>
                <div className="p-6">
                  <div className="mb-5 space-y-1">
                    <div className="text-lg font-semibold">오늘의 소비를 입력해봐</div>
                    <p className="text-sm text-zinc-500">짧게 입력할수록 결과가 더 직관적으로 보입니다.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">금액</div>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
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
                      className="flex h-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-800 transition hover:bg-zinc-200"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> 이전
                    </button>
                    <button
                      onClick={() => setStep("result")}
                      className="h-12 rounded-2xl bg-zinc-950 text-white transition hover:opacity-95"
                    >
                      결과 보기
                    </button>
                  </div>
                </div>
              </CardBox>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,#d946ef_0%,#f43f5e_46%,#fb923c_100%)] text-white shadow-[0_28px_90px_rgba(244,63,94,0.28)]">
                <div className="relative p-7">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
                  <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-yellow-200/20 blur-3xl" />

                  <div className="relative flex items-center justify-between text-sm text-white/75">
                    <span>오늘의 카드</span>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 backdrop-blur">
                      <CategoryIcon className="h-4 w-4" />
                      {pickCategoryLabel(category)}
                    </div>
                  </div>

                  <div className="relative mt-10 space-y-5">
                    <h2 className="text-[30px] font-semibold leading-tight tracking-tight">{result.title}</h2>
                    <p className="text-sm leading-6 text-white/90">{result.subtitle}</p>
                  </div>

                  <div className="relative mt-8 rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
                    <div className="text-xs text-white/70">오늘 입력한 소비</div>
                    <div className="mt-2 text-sm font-medium text-white/95">
                      {pickCategoryLabel(category)} · {Number(amount || 0).toLocaleString("ko-KR")}원 · {situation}
                    </div>
                  </div>

                  <div className="relative mt-8 flex items-center justify-between text-xs text-white/75">
                    <span>shareable card preview</span>
                    <Share2 className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <CardBox>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageCircleHeart className="h-4 w-4" /> 이 결과, 어땠어?
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setReacted("up")}
                      className={`h-12 rounded-2xl border transition ${
                        reacted === "up" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-900"
                      }`}
                    >
                      공감됨 👍
                    </button>
                    <button
                      onClick={() => setReacted("down")}
                      className={`h-12 rounded-2xl border transition ${
                        reacted === "down" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-900"
                      }`}
                    >
                      별로임 👎
                    </button>
                  </div>

                  <div className="mt-3 text-xs leading-5 text-zinc-500">
                    실제 테스트에서는 “무슨 앱인지 바로 이해됐는지”, “한 번 더 해보고 싶은지”도 함께 확인합니다.
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSavedRecords((prev) => [
                          {
                            id: Date.now(),
                            amount,
                            category,
                            situation,
                            title: result.title,
                            date: new Date().toISOString(),
                          },
                          ...prev,
                        ]);
                      }}
                      className="h-12 rounded-2xl bg-zinc-100 text-zinc-900 transition hover:bg-zinc-200"
                    >
                      기록 저장
                    </button>
                    <button className="flex h-12 items-center justify-center rounded-2xl bg-zinc-950 text-white transition hover:opacity-95">
                      공유하기
                      <Share2 className="ml-2 h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5 rounded-3xl border border-zinc-100 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-zinc-500">기록은 선택 기능</div>
                        <div className="mt-1 text-sm font-medium">마음에 들면 저장하고, 아니면 바로 넘겨도 됩니다</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">저장 수</div>
                        <div className="mt-1 text-sm font-semibold">{savedRecords.length}개</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBox>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
