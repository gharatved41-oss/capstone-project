import React, { useState, useRef, useEffect } from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Minimize2
} from "lucide-react";

export const SecurityChatbot = () => {
  const { chatMessages, sendChatMessage, vulnerabilities, isOrchestrating } = useSecurity();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText("");
  };

  const quickPrompts = [
    "Why was Spring4Shell marked false positive?",
    "Explain Log4Shell exploitability factors",
    "How does the Digital Twin ensure safety?",
    "What fix is proposed for Apache 2.4.49?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="chat-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Open AutoSecTwin AI Copilot"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg, rgba(14, 20, 36, 0.98), rgba(20, 29, 51, 0.98))",
              borderBottom: "1px solid var(--border-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #06b6d4, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Bot size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                  AutoSecTwin Copilot
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--cyan)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)" }} />
                  Context-Aware Security AI Active
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(0, 0, 0, 0.2)",
              borderBottom: "1px solid var(--border-subtle)",
              overflowX: "auto",
              display: "flex",
              gap: 6,
              whiteSpace: "nowrap"
            }}
          >
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  sendChatMessage(prompt);
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  color: "var(--text-secondary)",
                  fontSize: "0.68rem",
                  padding: "4px 10px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(6, 182, 212, 0.15)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
              >
                <Sparkles size={10} style={{ display: "inline", marginRight: 4 }} />
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "rgba(10, 15, 26, 0.7)"
            }}
          >
            {chatMessages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    alignSelf: isBot ? "flex-start" : "flex-end",
                    maxWidth: "88%"
                  }}
                >
                  {isBot && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(6, 182, 212, 0.15)",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Bot size={14} color="var(--cyan)" />
                    </div>
                  )}

                  <div
                    style={{
                      background: isBot ? "var(--bg-surface-elevated)" : "linear-gradient(135deg, #0284c7, #6366f1)",
                      border: isBot ? "1px solid var(--border-subtle)" : "none",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 14px",
                      fontSize: "0.82rem",
                      lineHeight: 1.5,
                      color: "#ffffff"
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: isBot ? "var(--text-muted)" : "rgba(255, 255, 255, 0.7)",
                        marginTop: 4,
                        textAlign: isBot ? "left" : "right"
                      }}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isBot && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(99, 102, 241, 0.2)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <User size={14} color="#a5b4fc" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "12px 14px",
              background: "rgba(14, 20, 36, 0.95)",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              gap: 8
            }}
          >
            <input
              type="text"
              placeholder="Ask Copilot about any CVE, twin test, or fix..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                color: "#ffffff",
                fontSize: "0.82rem",
                outline: "none"
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "8px 14px" }}
              disabled={!inputText.trim()}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
