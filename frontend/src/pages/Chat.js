import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Send, ArrowLeft, Compass, MapPin, Mountain, Sun, Trees, Globe } from "lucide-react";
import { Loader } from "@/components/ui/loader";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SUGGESTIONS = [
  { text: "Best time to visit Patagonia?", icon: Mountain },
  { text: "Plan a 10-day Chile adventure", icon: Compass },
  { text: "What to see in Atacama Desert?", icon: Sun },
  { text: "Family trip to the Lake District", icon: Trees },
  { text: "Easter Island — is it worth it?", icon: Globe },
  { text: "Wine regions near Santiago", icon: MapPin },
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const userMsg = text.trim();
    if (!userMsg || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    const assistantMsg = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setMessages([...newMessages, { role: "assistant", content: accumulated }]);
                scrollToBottom();
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "I'm sorry, I couldn't process that request. Please try again." },
        ]);
      }
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  return (
    <div data-testid="chat-page" className="flex flex-col h-screen bg-[#090A0C]">
      {/* Header */}
      <header className="shrink-0 backdrop-blur-md bg-[#090A0C]/90 border-b border-[#262B35] z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" data-testid="chat-back-link" className="text-[#9EA6B5] hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-tight text-white">Outdooroots</h1>
              <p className="font-mono text-[9px] tracking-[.12em] uppercase text-[#FF3B30]">Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-[#9EA6B5]">Online</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" data-testid="chat-messages-area">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]" data-testid="chat-empty-state">
              <div className="w-14 h-14 rounded-2xl bg-[#181B22] border border-[#262B35] flex items-center justify-center mb-6">
                <Compass className="h-7 w-7 text-[#FF3B30]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-2 text-center">
                Where shall we explore?
              </h2>
              <p className="text-sm text-[#9EA6B5] mb-10 text-center max-w-md">
                Ask me anything about traveling in Chile — from Patagonia's peaks to Atacama's stars.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    data-testid={`suggestion-${s.text.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                    className="flex items-center gap-2.5 h-auto py-3 px-4 rounded-xl border border-[#262B35] text-white hover:bg-[#181B22] hover:border-[#FF3B30]/40 transition-colors text-left text-sm"
                    onClick={() => sendMessage(s.text)}
                  >
                    <s.icon className="h-4 w-4 text-[#FF3B30] shrink-0" />
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  data-testid={`chat-message-${i}`}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-[#181B22] border border-[#262B35] flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-[#FF3B30]">O</span>
                    </div>
                  )}
                  <div
                    className={`text-sm leading-relaxed max-w-[80%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#FF3B30] text-white rounded-br-sm"
                        : "bg-[#181B22] text-[#9EA6B5] border border-[#262B35] rounded-bl-sm prose-headings:text-white prose-strong:text-white prose-a:text-[#FF3B30]"
                    }`}
                  >
                    {msg.content || (
                      <Loader variant="typing" size="sm" className="[&>div]:bg-[#FF3B30]" />
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-[#20252E] flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-white">Y</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content && (
                <div data-testid="chat-loading" className="flex gap-3 justify-start">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-[#181B22] border border-[#262B35] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#FF3B30]">O</span>
                  </div>
                  <div className="bg-[#181B22] border border-[#262B35] rounded-xl rounded-bl-sm px-5 py-4">
                    <Loader variant="typing" size="sm" className="[&>div]:bg-[#FF3B30]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[#262B35] bg-[#090A0C]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-end gap-3"
          >
            <textarea
              ref={inputRef}
              data-testid="chat-input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask about Chile travel..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-[#262B35] bg-[#181B22] px-4 py-3 text-sm text-white placeholder:text-[#9EA6B5]/50 focus:outline-none focus:border-[#FF3B30]/50 transition-colors"
            />
            <button
              data-testid="chat-send-button"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 rounded-xl bg-[#FF3B30] hover:bg-[#E02E24] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>
          <p className="text-[10px] text-center text-[#9EA6B5]/40 mt-2 font-mono">
            Prices are illustrative estimates · Not a reservation system
          </p>
        </div>
      </div>
    </div>
  );
}
