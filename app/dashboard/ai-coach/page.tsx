"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "../../components/ai-coach/ChatHeader";
import ConversationSidebar from "../../components/ai-coach/ConversationSidebar";
import MessageBubble from "../../components/ai-coach/MessageBubble";
import MessageInput from "../../components/ai-coach/MessageInput";
import PortfolioSnapshot from "../../components/ai-coach/PortfolioSnapshot";
import SuggestedPrompts from "../../components/ai-coach/SuggestedPrompts";
import TypingIndicator from "../../components/ai-coach/TypingIndicator";
import WealthBriefingCard from "../../components/ai-coach/WealthBriefingCard";
import type { ChatMessage, Conversation } from "../../components/ai-coach/types";
import { generateWealthBriefing, type CoachHistoryTurn, type CoachInsight, type WealthBriefing } from "../../lib/ai/coachService";
import { getPortfolioContext } from "../../lib/mock/portfolioContext";

const portfolioContext = getPortfolioContext();

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

const titleFromMessage = (text: string) =>
  text.length > 42 ? `${text.slice(0, 42).trimEnd()}…` : text;

/** Decouples the AI service's history format from the UI's ChatMessage shape. */
const toHistory = (messages: ChatMessage[]): CoachHistoryTurn[] =>
  messages.map((message) =>
    message.role === "user"
      ? { role: "user", text: message.text }
      : { role: "assistant", text: message.insight.report.directAnswer, topic: message.insight.topic }
  );

/** The client never talks to the AI engine directly — it always goes through
 * this HTTP boundary, exactly the shape a real model-backed engine would
 * need too (context stays server-side, never sent from the browser). */
async function fetchCoachInsight(message: string, history: CoachHistoryTurn[]): Promise<CoachInsight> {
  const response = await fetch("/api/ai-coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!response.ok) {
    throw new Error(`AI Coach request failed (${response.status})`);
  }
  return response.json();
}

export default function AICoachPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [briefing, setBriefing] = useState<WealthBriefing | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateWealthBriefing(portfolioContext).then(setBriefing);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    // `messages` is a fresh array reference every render (derived from
    // `conversations.find(...)`), so depend on its length instead — it only
    // ever grows here, so length is a reliable proxy for "new message(s)
    // arrived" without re-running the scroll on every unrelated re-render.
  }, [messages.length, isTyping]);

  const handleSend = async (text: string) => {
    // `handleSend` only ever runs from a user click/keypress (passed down as
    // onSend/onSelect props) — it never runs during render — so a fresh
    // timestamp here is safe. The `react-hooks/purity` rule doesn't yet
    // special-case async event handlers defined in component bodies.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const userMessage: ChatMessage = { id: nextId("msg"), role: "user", text, timestamp: now };

    // Computed once, before any setState call, so the functional updaters
    // below stay pure — React 18 Strict Mode double-invokes updaters in dev,
    // and calling nextId()/Date.now() from inside one would desync the id
    // used here from the one actually committed to state.
    const isNewConversation = !activeConversationId;
    const conversationId = activeConversationId ?? nextId("conv");
    const history = toHistory(messages);

    setConversations((prev) => {
      if (!isNewConversation) {
        return prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: now }
            : c
        );
      }
      const newConversation: Conversation = {
        id: conversationId,
        title: titleFromMessage(text),
        messages: [userMessage],
        createdAt: now,
        updatedAt: now,
      };
      return [newConversation, ...prev];
    });

    if (isNewConversation) {
      setActiveConversationId(conversationId);
    }

    setIsTyping(true);
    const insight = await fetchCoachInsight(text, history);
    const assistantMessage: ChatMessage = {
      id: nextId("msg"),
      role: "assistant",
      insight,
      // Same event-handler justification as the `now` above.
      // eslint-disable-next-line react-hooks/purity
      timestamp: Date.now(),
    };

    setIsTyping(false);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() }
          : c
      )
    );
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setIsTyping(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsTyping(false);
  };

  return (
    <div className="flex h-[calc(100vh-13rem)] min-w-0 gap-6 overflow-x-auto">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />

      <div className="flex min-w-[420px] flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] backdrop-blur-xl">
        <ChatHeader />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col justify-center gap-6">
              {briefing && <WealthBriefingCard briefing={briefing} />}

              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-900">
                  How can I help with your money today?
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Try one of these, or ask anything below.
                </p>
              </div>
              <SuggestedPrompts onSelect={handleSend} />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/ai-coach.svg" alt="" className="h-5 w-5" />
                  </span>
                  <TypingIndicator />
                </div>
              )}
            </div>
          )}
        </div>

        <MessageInput onSend={handleSend} disabled={isTyping} />
      </div>

      <PortfolioSnapshot context={portfolioContext} />
    </div>
  );
}
