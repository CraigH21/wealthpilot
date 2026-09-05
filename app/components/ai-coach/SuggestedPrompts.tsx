const SUGGESTED_PROMPTS = [
  "Can I afford a £1,500 holiday next month?",
  "Review my portfolio health.",
  "Where should I invest £500 this month?",
  "Explain my spending this month.",
  "Help me reach my Emergency Fund faster.",
  "What are my biggest portfolio risks?",
];

export default function SuggestedPrompts({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-2xl border border-black/10 bg-black/5 p-4 text-left text-sm text-zinc-600 transition-all duration-300 ease-out hover:border-accent-border hover:bg-accent-soft hover:text-zinc-900 hover:shadow-[0_0_16px_var(--accent-glow)]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
