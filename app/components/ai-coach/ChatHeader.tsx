export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-black/10 px-6 py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/ai-coach.svg" alt="" className="h-8 w-8 shrink-0" />
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-zinc-900">
          WealthPilot AI Coach
        </h1>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
          Beta
        </span>
      </div>
    </div>
  );
}
