"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import API from '../utils/api';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const AIWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to SR4IPR Partners AI Legal Assistant. How can I help you protect your innovation today?',
      isDisclaimered: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    // User Message
    const userMsgId = Math.random().toString(36).substring(2, 9);
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await API.post('ai/assistant/', { message: text });
      const assistantMsgId = Math.random().toString(36).substring(2, 9);
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: 'assistant', content: res.data.response }
      ]);
    } catch (err) {
      const errorMsgId = Math.random().toString(36).substring(2, 9);
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          role: 'assistant',
          content: 'Sorry, I am experiencing temporary difficulty. Please email us at consult@sr4ipr.com or schedule a consultation directly.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How to register a trademark?",
    "Patent eligibility criteria?",
    "Copyright protection term?",
    "Book a Zoom strategy session"
  ];

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#7A5E4C] to-[#8B6B57] text-[#171717] rounded-full shadow-2xl hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white dark:bg-[#171717] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="bg-[#171717] p-4 flex justify-between items-center border-b border-[#7A5E4C]/40 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8B6B57] rounded-full flex items-center justify-center text-white font-serif font-bold text-sm">
                SR
              </div>
              <div>
                <h4 className="text-white font-serif font-semibold text-sm">IP Legal Assistant</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> Live Consultation System
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#1C1B1A]/20">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {m.role !== 'user' && (
                  <div className="w-7 h-7 bg-[#1C1B1A] border border-[#7A5E4C] rounded-full flex items-center justify-center text-[#8B6B57] text-xs shrink-0">
                    <Bot size={14} />
                  </div>
                )}
                <div>
                  <div
                    className={`p-3 rounded-lg text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#171717] text-white rounded-br-none'
                        : 'bg-white dark:bg-[#1C1B1A] border border-slate-200 dark:border-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {/* Render message with line breaks */}
                    {m.content.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 bg-[#1C1B1A] border border-[#7A5E4C] rounded-full flex items-center justify-center text-[#8B6B57] text-xs shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-3 bg-white dark:bg-[#1C1B1A] border border-slate-200 dark:border-slate-800 rounded-lg text-sm rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-[#8B6B57] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-[#8B6B57] rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-[#8B6B57] rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-[#1C1B1A]/40 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[11px] bg-white dark:bg-[#171717] border border-slate-300 dark:border-slate-700 hover:border-[#8B6B57] dark:hover:border-[#8B6B57] dark:text-slate-300 p-1.5 rounded transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#171717]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about trademarks, patent filing..."
                className="flex-1 bg-slate-100 dark:bg-[#1C1B1A] dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#8B6B57]"
                disabled={loading}
              />
              <button
                type="submit"
                className="p-2 bg-[#171717] dark:bg-[#8B6B57] text-white dark:text-navy-dark hover:opacity-90 rounded-md transition-all shrink-0 cursor-pointer"
                disabled={loading}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWidget;
