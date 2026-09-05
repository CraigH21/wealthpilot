import Link from "next/link";
import type { ReactNode } from "react";
import EdgeGlow from "../EdgeGlow";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

type InsightIconKey = "interest" | "fees" | "safety";
type Insight = { icon: InsightIconKey; title: string; body: string; tone: "accent" | "sky" | "amber" };

const ICONS: Record<InsightIconKey, ReactNode> = {
  interest: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  fees: <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0zM12 8v4l3 2" />,
  safety: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
};

const TONE: Record<Insight["tone"], string> = {
  accent: "bg-accent-soft text-accent",
  sky: "bg-sky-500/10 text-sky-400",
  amber: "bg-amber-500/10 text-amber-400",
};

export default function AIBankingInsights({
  bestSavingsAER,
  topOpportunityAER,
  emergencyFundCurrent,
  emergencyFundTarget,
}: {
  bestSavingsAER: number;
  topOpportunityAER: number;
  emergencyFundCurrent: number;
  emergencyFundTarget: number;
}) {
  const emergencyPct = Math.round((emergencyFundCurrent / emergencyFundTarget) * 100);
  const rateDelta = Math.round((topOpportunityAER - bestSavingsAER) * 100) / 100;

  const insights: Insight[] = [
    {
      icon: "interest",
      title: "Earn More Interest",
      body:
        rateDelta > 0
          ? `Your best savings rate is ${bestSavingsAER}% AER. Accounts paying up to ${topOpportunityAER}% AER are available — worth a look.`
          : `Your savings are already earning a competitive ${bestSavingsAER}% AER.`,
      tone: "accent",
    },
    {
      icon: "fees",
      title: "Lower Your Fees",
      body: "None of your connected banks charge a monthly account fee right now — you're not leaving money on the table here.",
      tone: "sky",
    },
    {
      icon: "safety",
      title: "Build Your Safety Net",
      body: `Your emergency fund is ${emergencyPct}% of target (${formatGBP(emergencyFundCurrent)} of ${formatGBP(emergencyFundTarget)}). Keep going — you're on track.`,
      tone: "amber",
    },
  ];

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <EdgeGlow />
      <h2 className="relative text-base font-semibold text-zinc-900">AI Banking Insights</h2>

      <div className="relative mt-5 flex flex-col gap-3">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-2xl border border-black/10 bg-black/5 p-4">
            <div className="flex items-center gap-2.5">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${TONE[insight.tone]}`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[insight.icon]}
                </svg>
              </span>
              <p className="text-sm font-semibold text-zinc-900">{insight.title}</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{insight.body}</p>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/ai-coach"
        className="relative mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent transition-transform duration-300 ease-out hover:-translate-y-[1px]"
      >
        Chat with AI Coach
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
