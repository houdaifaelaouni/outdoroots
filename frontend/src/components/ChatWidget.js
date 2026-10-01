import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Compass, ArrowUpRight } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const QUICK_QUESTIONS = [
  "Best time to visit Chile?",
  "Suggest a 7-day itinerary",
  "Tell me about Patagonia",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const userMsg = text.trim();
    if (!userMsg || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    setMessages([...newMessages, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
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
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom, isOpen]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[999]"
          >
            <button
              data-testid="chat-widget-toggle"
              onClick={() => { setIsOpen(true); setHasUnread(false); }}
              className="h-14 w-14 rounded-full bg-[#FF3B30] hover:bg-[#E02E24] shadow-lg shadow-[#FF3B30]/25 flex items-center justify-center relative transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-white" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white border-2 border-[#FF3B30]" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-testid="chat-widget-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-6 right-6 z-[999] w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-96px)] bg-[#121418] rounded-2xl shadow-2xl shadow-black/30 border border-[#262B35] flex flex-col overflow-hidden"
          >
            {/* Panel header */}
            <div className="shrink-0 px-4 py-3 border-b border-[#262B35] flex items-center justify-between bg-[#090A0C]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#FF3B30]/10 border border-[#FF3B30]/20 flex items-center justify-center">
                  <Compass className="h-4 w-4 text-[#FF3B30]" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight text-white leading-tight">Outdooroots</p>
                  <p className="font-mono text-[8px] tracking-[.1em] uppercase text-[#FF3B30]">Travel Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  data-testid="chat-widget-expand"
                  onClick={() => { setIsOpen(false); navigate("/chat"); }}
                  title="Open full chat"
                  className="h-7 w-7 flex items-center justify-center text-[#9EA6B5] hover:text-white hover:bg-[#20252E] rounded-lg transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  data-testid="chat-widget-close"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 flex items-center justify-center text-[#9EA6B5] hover:text-white hover:bg-[#20252E] rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4" data-testid="chat-widget-messages">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-11 h-11 rounded-xl bg-[#181B22] border border-[#262B35] flex items-center justify-center mb-4">
                    <Compass className="h-5 w-5 text-[#FF3B30]" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-tight text-white mb-1">Need travel advice?</p>
                  <p className="text-xs text-[#9EA6B5] mb-5">Ask me anything about Chile</p>
                  <div className="flex flex-col gap-1.5 w-full">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        data-testid={`widget-suggestion-${q.slice(0, 15).replace(/\s/g, "-").toLowerCase()}`}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-[#262B35] text-[#9EA6B5] hover:bg-[#181B22] hover:border-[#FF3B30]/30 hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} data-testid={`widget-message-${i}`} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="h-6 w-6 shrink-0 rounded-md bg-[#181B22] border border-[#262B35] flex items-center justify-center mt-0.5">
                          <span className="text-[9px] font-bold text-[#FF3B30]">O</span>
                        </div>
                      )}
                      <div className={`text-sm leading-relaxed max-w-[80%] rounded-xl px-3 py-2 ${
                        msg.role === "user"
                          ? "bg-[#FF3B30] text-white rounded-br-sm"
                          : "bg-[#181B22] border border-[#262B35] text-[#9EA6B5] rounded-bl-sm"
                      }`}>
                        {msg.content || <Loader variant="typing" size="sm" className="[&>div]:bg-[#FF3B30]" />}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-[#262B35] p-3 bg-[#090A0C]/80">
              <form
                data-testid="chat-widget-form"
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={inputRef}
                  data-testid="chat-widget-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
                  }}
                  placeholder="Ask about Chile..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-[#262B35] bg-[#181B22] px-3 py-2.5 text-sm text-white placeholder:text-[#9EA6B5]/40 focus:outline-none focus:border-[#FF3B30]/40 transition-colors"
                />
                <button
                  data-testid="chat-widget-send"
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-[#FF3B30] hover:bg-[#E02E24] disabled:opacity-30 flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
