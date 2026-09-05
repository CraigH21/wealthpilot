"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { addGoalAction } from "../../lib/actions/addGoal";
import type { Goal } from "../../lib/mock/portfolioContext";

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

export default function SetGoalPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<DraftGoal>(EMPTY_DRAFT);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setMounted(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      onClose();
      setForm(EMPTY_DRAFT);
    }, 300);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    await addGoalAction({
      name: form.name,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      monthlyContribution: Number(form.monthlyContribution),
      targetDate: form.targetDate,
      priority: form.priority,
    });

    router.refresh();
    setSaving(false);
    handleClose();
  };

  // Portal to <body> — several ancestor cards use `backdrop-blur`, which
  // creates a new containing block for `fixed`-positioned descendants, so
  // without this the panel gets trapped inside the card's own box instead
  // of covering the viewport.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label="Set a goal"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--background)] shadow-[-20px_0_60px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-6 py-5">
          <p className="flex-1 text-sm font-semibold text-zinc-900">Set a Goal</p>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-500 hover:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500">Goal Name</span>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Home Renovation"
                className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-[var(--accent-border-strong)]"
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
        </div>

        <div className="border-t border-black/10 px-6 py-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-soft px-4 py-3 text-sm font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Goal"}
            {!saving && (
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
