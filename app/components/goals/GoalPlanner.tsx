"use client";

import { useEffect, useState, type FormEvent } from "react";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import type { Goal } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

const PRIORITY_TONE: Record<Goal["priority"], string> = {
  High: "bg-rose-500/10 text-rose-400",
  Medium: "bg-amber-500/10 text-amber-400",
  Low: "bg-black/10 text-zinc-500",
};

type DraftGoal = {
  name: string;
  targetAmount: string;
  currentAmount: string;
  monthlyContribution: string;
  targetDate: string;
  priority: Goal["priority"];
};

const EMPTY_DRAFT: DraftGoal = {
  name: "",
  targetAmount: "",
  currentAmount: "0",
  monthlyContribution: "",
  targetDate: "",
  priority: "Medium",
};

function goalToDraft(goal: Goal): DraftGoal {
  return {
    name: goal.name,
    targetAmount: String(goal.targetAmount),
    currentAmount: String(goal.currentAmount),
    monthlyContribution: String(goal.monthlyContribution),
    targetDate: goal.targetDate,
    priority: goal.priority,
  };
}

function GoalFormModal({
  draft,
  isEditing,
  onSubmit,
  onClose,
}: {
  draft: DraftGoal;
  isEditing: boolean;
  onSubmit: (draft: DraftGoal) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(draft);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="glass-edge-card glass-edge-hero relative w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55),inset_4px_4px_10px_rgba(255,255,255,0.14),inset_-3px_-3px_8px_var(--accent-soft)] backdrop-blur-[32px]"
      >
        <div className="flex items-start justify-between">
          <p className="text-sm font-semibold text-zinc-900">{isEditing ? "Edit Goal" : "Create New Goal"}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-500 hover:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Goal Name</span>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Home Renovation"
              className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-600 focus:border-[var(--accent-border-strong)]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500">Target Amount (£)</span>
              <input
                required
                type="number"
                min="1"
                value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500">Saved So Far (£)</span>
              <input
                required
                type="number"
                min="0"
                value={form.currentAmount}
                onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
                className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500">Monthly Contribution (£)</span>
              <input
                required
                type="number"
                min="0"
                value={form.monthlyContribution}
                onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })}
                className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500">Deadline</span>
              <input
                required
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)] [color-scheme:light]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500">Priority</span>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Goal["priority"] })}
              className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent transition-transform duration-300 ease-out hover:-translate-y-[1px]"
        >
          {isEditing ? "Save Changes" : "Create Goal"}
        </button>
      </form>
    </div>
  );
}

export default function GoalPlanner({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  const editingGoal = goals.find((g) => g.id === editingId) ?? null;

  const handleCreate = (draft: DraftGoal) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      name: draft.name,
      targetAmount: Number(draft.targetAmount),
      currentAmount: Number(draft.currentAmount),
      monthlyContribution: Number(draft.monthlyContribution),
      targetDate: draft.targetDate,
      priority: draft.priority,
      keywords: [],
    };
    setGoals((prev) => [...prev, newGoal]);
    setIsCreating(false);
  };

  const handleUpdate = (draft: DraftGoal) => {
    if (!editingId) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === editingId
          ? {
              ...g,
              name: draft.name,
              targetAmount: Number(draft.targetAmount),
              currentAmount: Number(draft.currentAmount),
              monthlyContribution: Number(draft.monthlyContribution),
              targetDate: draft.targetDate,
              priority: draft.priority,
            }
          : g
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8"
    >
      <EdgeGlow />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Goal Planner</h2>
          <p className="mt-1 text-sm text-zinc-600">Create, edit and manage your savings goals</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent transition-transform duration-300 ease-out hover:-translate-y-[1px]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create New Goal
        </button>
      </div>

      <div className="relative mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-zinc-600">
              <th className="pb-3 pr-2 font-medium">Goal</th>
              <th className="pb-3 pr-2 text-right font-medium">Target</th>
              <th className="pb-3 pr-2 text-right font-medium">Monthly</th>
              <th className="pb-3 pr-2 font-medium">Deadline</th>
              <th className="pb-3 pr-2 font-medium">Priority</th>
              <th className="pb-3 pl-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {goals.map((goal) => (
              <tr key={goal.id} className="transition-colors duration-300 ease-out hover:bg-black/5">
                <td className="py-3 pr-2 font-medium text-zinc-900">{goal.name}</td>
                <td className="py-3 pr-2 text-right text-zinc-600">
                  {formatGBP(goal.currentAmount)} / {formatGBP(goal.targetAmount)}
                </td>
                <td className="py-3 pr-2 text-right text-zinc-600">{formatGBP(goal.monthlyContribution)}</td>
                <td className="py-3 pr-2 text-zinc-500">
                  {new Date(goal.targetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </td>
                <td className="py-3 pr-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_TONE[goal.priority]}`}>
                    {goal.priority}
                  </span>
                </td>
                <td className="py-3 pl-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingId(goal.id)}
                      aria-label={`Edit ${goal.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors duration-300 ease-out hover:bg-black/10 hover:text-accent"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(goal.id)}
                      aria-label={`Delete ${goal.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors duration-300 ease-out hover:bg-red-500/10 hover:text-red-400"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {goals.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-zinc-600">
                  No goals yet — create your first one to start planning.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isCreating && (
        <GoalFormModal
          draft={EMPTY_DRAFT}
          isEditing={false}
          onSubmit={handleCreate}
          onClose={() => setIsCreating(false)}
        />
      )}

      {editingGoal && (
        <GoalFormModal
          draft={goalToDraft(editingGoal)}
          isEditing
          onSubmit={handleUpdate}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
