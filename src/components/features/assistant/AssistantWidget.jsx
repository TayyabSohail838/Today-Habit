import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useHabits } from "../../../contexts/HabitsContext";
import { useAuth } from "../../../contexts/AuthContext";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function AssistantWidget({ bottomClass = "bottom-6 right-6" }) {
  const { habits = [], logs = [] } = useHabits() || {};
  const { user } = useAuth() || {};
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hey${user?.name ? " " + user.name.split(" ")[0] : ""}! 👋 I'm your habit coach powered by AI. Ask me anything about building habits, maintaining streaks, or productivity tips!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          habitContext: { habits, logs },
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = { error: "Failed to parse API response." };
      }

      if (!res.ok || data?.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.error || "Sorry, something went wrong. Please try again.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Connection error (${err.message}). Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        id="assistant-widget-toggle"
        aria-label={open ? "Close habit coach" : "Open habit coach"}
        onClick={() => setOpen((v) => !v)}
        className={`fixed ${bottomClass} z-50 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
          open
            ? "bg-destructive text-destructive-foreground rotate-90"
            : "bg-primary text-primary-foreground hover:scale-110 shadow-emerald-500/20"
        }`}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-38 right-6 z-50 w-80 sm:w-96 transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[28rem]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Habit Coach</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">Powered by Gemini</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Close Habit Coach"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-border shrink-0">
            <textarea
              ref={inputRef}
              id="assistant-input"
              rows={1}
              placeholder="Ask your habit coach…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              className="flex-1 resize-none bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-24 overflow-y-auto disabled:opacity-50"
            />
            <button
              id="assistant-send"
              aria-label="Send message"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
