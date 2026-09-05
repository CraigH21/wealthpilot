import type { ChatMessage } from "./types";

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export default function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md border border-accent-border bg-accent-soft px-4 py-3 text-sm leading-relaxed text-zinc-900">
          {message.text}
        </div>
        <span className="mt-1 pr-1 text-[10px] text-zinc-600">
          {formatTime(message.timestamp)}
        </span>
      </div>
    );
  }

  const { report } = message.insight;
  const isRisk = report.riskOrOpportunity.type === "risk";

  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/ai-coach.svg" alt="" className="h-5 w-5" />
      </span>

      <div className="flex max-w-[85%] flex-1 flex-col items-start">
        <div className="w-full rounded-2xl rounded-tl-md border border-black/10 bg-black/5 px-4 py-4 backdrop-blur-xl">
          {/* 1. Direct Answer */}
          <p className="text-sm font-semibold leading-relaxed text-zinc-900">
            {report.directAnswer}
          </p>

          {/* 2. Why */}
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{report.why}</p>

          {/* 3. Financial Breakdown */}
          {report.breakdown.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                Financial Breakdown
              </p>
              <div className="mt-2 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 bg-black/5">
                {report.breakdown.map((row, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                  >
                    <span className="text-zinc-500">{row.label}</span>
                    <span className="font-medium text-zinc-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Recommendation */}
          <div className="mt-3 rounded-xl border border-black/10 bg-black/5 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
              Recommendation
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              {report.recommendation}
            </p>
          </div>

          {/* 5. Risk or Opportunity */}
          <div
            className={`mt-3 rounded-xl border p-3 ${
              isRisk ? "border-amber-500/20 bg-amber-500/5" : "border-accent-border bg-accent-soft"
            }`}
          >
            <p
              className={`text-[11px] font-semibold uppercase tracking-wide ${
                isRisk ? "text-amber-400" : "text-accent"
              }`}
            >
              {isRisk ? "What to Watch" : "Opportunity"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              {report.riskOrOpportunity.text}
            </p>
          </div>
        </div>
        <span className="mt-1 pl-1 text-[10px] text-zinc-600">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
