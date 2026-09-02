import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { processAICopilotQuery } from '../../services/aiService';
import { Bot, Send, Cpu, User, Bus, Activity, Wrench, Leaf, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const UrbanAICopilot: React.FC = () => {
  const { vehicles, environmental, workOrders, walletBalance, complaints } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "👋 Welcome to **SmartTransit AI Copilot**! I monitor real-time city transit telemetry, AI signal timings, IoT bridge sensors, and environmental metrics. Ask me anything about urban mobility or city infrastructure!",
      timestamp: '10:00 AM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseText = processAICopilotQuery(textToSend, {
        vehiclesCount: vehicles.length,
        aqi: environmental.aqi,
        co2Kg: environmental.co2OffsetTodayKg,
        activeWorkOrders: workOrders.filter((w) => w.status === 'in_progress').length,
        walletBalance,
        activeComplaints: complaints.length
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const samplePrompts = [
    { label: '🚦 Traffic Congestion Summary', query: 'Summary of current traffic congestion and signal efficiency' },
    { label: '🚌 Bus & Metro Fleet Status', query: 'Show live tracking status of bus and metro lines' },
    { label: '🏗️ IoT Maintenance Alerts', query: 'Any critical IoT bridge or drainage maintenance warnings?' },
    { label: '🌿 Environmental AQI & Carbon', query: 'How much CO2 did electric buses offset today?' }
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-slate-100">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Smart City AI Copilot (Urban Assistant)
            </h2>
            <p className="text-xs text-slate-400">Natural language command center for municipal data & citizen mobility queries.</p>
          </div>
        </div>

        <span className="text-xs uppercase font-extrabold text-cyan-400 bg-cyan-950 px-3 py-1.5 rounded-full border border-cyan-800 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Real-Time Urban AI Active
        </span>
      </div>

      {/* Chat Window Container */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 flex flex-col h-[520px]">
        
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 whitespace-nowrap transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-200'
                }`}
              >
                <div className="font-sans whitespace-pre-wrap">{m.text}</div>
                <div className={`text-[10px] text-right font-mono ${m.sender === 'user' ? 'text-slate-900' : 'text-slate-500'}`}>
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>SmartCity AI is analyzing city sensors and traffic logs...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about traffic, bus ETA, bridge maintenance, or air quality..."
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>

      </div>

    </div>
  );
};
