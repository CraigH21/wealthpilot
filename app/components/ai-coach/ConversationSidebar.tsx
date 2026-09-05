import type { Conversation } from "./types";

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Older"] as const;
type RecencyGroup = (typeof GROUP_ORDER)[number];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getRecencyGroup(timestamp: number): RecencyGroup {
  const dayMs = 86_400_000;
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(new Date(timestamp))) / dayMs);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "This Week";
  return "Older";
}

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}) {
  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: sorted.filter((conversation) => getRecencyGroup(conversation.updatedAt) === group),
  })).filter(({ items }) => items.length > 0);

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col">
      <h2 className="px-1 py-2 text-sm font-semibold text-zinc-900">AI Coach</h2>

      <button
        type="button"
        onClick={onNewConversation}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-accent-border bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent transition-all duration-300 ease-out hover:bg-accent-border"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        New Conversation
      </button>

      <nav className="mt-5 flex-1 overflow-y-auto">
        {grouped.length === 0 ? (
          <p className="px-2 text-xs text-zinc-600">
            No conversations yet — ask something to get started.
          </p>
        ) : (
          grouped.map(({ group, items }) => (
            <div key={group} className="mb-4">
              <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                {group}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const active = item.id === activeConversationId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectConversation(item.id)}
                      className={`truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-300 ease-out ${
                        active
                          ? "bg-accent-soft text-accent"
                          : "text-zinc-500 hover:bg-accent-soft hover:text-accent"
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
