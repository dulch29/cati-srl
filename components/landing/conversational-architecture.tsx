"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  MoreHorizontal,
  Plus,
  Type,
  Smile,
  AtSign,
  Video,
  Mic,
  Paperclip,
  Send,
  CheckCircle2,
  XCircle,
  Brain,
  Bot,
  ShieldAlert,
} from "lucide-react";

export function ConversationalArchitecture() {
  const [activeThread, setActiveThread] = useState<"chatbot" | "cati">("cati");

  return (
    <section
      id="architecture"
      className="relative z-10 w-full py-24 px-6 border-t border-white/10 bg-transparent overflow-hidden"
    >
      <div className="mx-auto max-w-6xl text-left">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider">
            Pedagogical Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-2">
            Competing Paradigms in AI Learning
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Why traditional AI chatbots produce the illusion of competence, and how Cati&apos;s Zimmerman SRL framework enforces long-term retention.
          </p>

          {/* Satisfying Interactive Thread Switcher Bar */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl relative">
            <button
              onClick={() => setActiveThread("chatbot")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeThread === "chatbot"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10 scale-100"
                  : "text-slate-400 hover:text-slate-200 scale-95"
              }`}
            >
              <XCircle className="h-4 w-4 text-rose-400" />
              <span>Thread A: Passive AI Chatbot (Failure Mode)</span>
            </button>
            <button
              onClick={() => setActiveThread("cati")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeThread === "cati"
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/20 scale-100"
                  : "text-slate-400 hover:text-slate-200 scale-95"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <span>Thread B: Cati Metacognitive SRL (Calibrated)</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            LINEAR-STYLE DUAL CONVERSATION SHOWCASE (MIRRORS IMAGE 2)
           ======================================================== */}
        <div className="relative rounded-3xl border border-white/10 bg-[#0B0F17]/85 backdrop-blur-2xl p-4 sm:p-8 shadow-2xl overflow-hidden">
          {/* Background Linear Kanban Board Silhouette */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none p-6 grid grid-cols-3 gap-4 select-none font-mono text-[10px]">
            <div className="space-y-3">
              <div className="text-slate-400 border-b border-white/10 pb-1">TODO &bull; 71</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">ENG-926: Remove UI inconsistencies</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">ENG-2088: TypeError: Cannot read properties</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">ENG-924: Upgrade to Claude Opus 3.5</div>
            </div>
            <div className="space-y-3">
              <div className="text-blue-400 border-b border-white/10 pb-1">IN PROGRESS &bull; 3</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">ENG-1487: Inferred confidence calibration</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">MKT-1028: Launch SRL cognition paper</div>
            </div>
            <div className="space-y-3">
              <div className="text-emerald-400 border-b border-white/10 pb-1">DONE &bull; 148</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">ENG-2074: Clean up dead-end chat prompts</div>
              <div className="rounded-lg bg-white/10 p-2 text-white">ENG-1892: Spaced SRS interval calculator</div>
            </div>
          </div>

          {/* Floating Linear Thread Dialog Window (Image 2 Replica) */}
          <div className="relative mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#0C1019]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Thread Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#101622]/90">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="font-mono text-xs font-semibold text-slate-200">
                  Thread <span className="text-slate-400">#pedagogical-architecture</span>
                </span>
                <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                  {activeThread === "chatbot" ? "ILLUSION OF COMPETENCE" : "ZIMMERMAN SRL"}
                </span>
              </div>
              <button className="text-slate-500 hover:text-slate-300 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation Messages Stream: User Left, AI Right */}
            <div className="p-5 sm:p-6 space-y-6 text-left min-h-[400px]">
              {/* THREAD A: PASSIVE CHATBOT FAILURE */}
              {activeThread === "chatbot" && (
                <div
                  key="chatbot-thread"
                  className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {/* Turn 1: Student Prompt (LEFT SIDE) */}
                  <div className="flex justify-start items-start gap-3 max-w-[88%]">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0 shadow-sm">
                      AC
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Alex Chen</span>
                        <span className="text-[10px] font-mono text-slate-500">10:14 AM</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/90 p-3.5 text-xs text-slate-300 shadow-md leading-relaxed">
                        Hey I&apos;m trying to write factorial in Python with recursion, but my code keeps throwing <code className="bg-slate-950 text-rose-300 px-1 py-0.5 rounded border border-rose-500/20">RecursionError: maximum recursion depth exceeded</code>. Can you just fix it for me?
                      </div>
                    </div>
                  </div>

                  {/* Turn 2: Generic AI Instant Solution (RIGHT SIDE) */}
                  <div className="flex justify-end items-start gap-3 max-w-[88%] ml-auto">
                    <div className="space-y-1.5 flex-1 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          Instant Answer (No Cognitive Load)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">10:14 AM</span>
                        <span className="text-xs font-semibold text-rose-300">Generic AI Bot</span>
                      </div>
                      <div className="rounded-2xl rounded-tr-sm border border-rose-500/30 bg-rose-950/20 p-3.5 text-xs text-left text-slate-200 shadow-lg space-y-2">
                        <p>Sure! Here is the fixed code. You were missing a base case guard:</p>
                        <pre className="rounded-xl border border-white/10 bg-slate-950 p-2.5 font-mono text-[11px] text-blue-300 overflow-x-auto">
{`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`}
                        </pre>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-300 shrink-0 shadow-sm">
                      <Bot className="h-4 w-4 text-rose-400" />
                    </div>
                  </div>

                  {/* Turn 3: Student Passive Acceptance (LEFT SIDE) */}
                  <div className="flex justify-start items-start gap-3 max-w-[88%]">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0 shadow-sm">
                      AC
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Alex Chen</span>
                        <span className="text-[10px] font-mono text-slate-500">10:15 AM</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-300 shadow-md">
                        Awesome thanks! That was so easy, I totally get it now.
                      </div>
                    </div>
                  </div>

                  {/* Turn 4: The 48-Hour Exam Breakdown (FULL WIDTH) */}
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/25 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Exam Day &bull; 48 Hours Later</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Alex was tested on writing a recursive binary tree search helper from scratch. Because the chatbot eliminated productive struggle, Alex could not reconstruct call-stack termination conditions. Score: <strong className="text-rose-400">0 / 15 points (Forgetting Cliff)</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* THREAD B: CATI SRL CLOSED-LOOP CALIBRATION */}
              {activeThread === "cati" && (
                <div
                  key="cati-thread"
                  className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {/* Turn 1: Student Self-Reflection (LEFT SIDE) */}
                  <div className="flex justify-start items-start gap-3 max-w-[88%]">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0 shadow-sm">
                      AC
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Alex Chen</span>
                        <span className="text-[10px] font-mono text-slate-500">10:14 AM</span>
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Self-Reported: 4/5 Confidence
                        </span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/90 p-3.5 text-xs text-slate-300 font-mono shadow-md leading-relaxed">
                        &quot;Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error.&quot;
                      </div>
                    </div>
                  </div>

                  {/* Turn 2: Cati Metacognitive Diagnostic Intervention (RIGHT SIDE) */}
                  <div className="flex justify-end items-start gap-3 max-w-[88%] ml-auto">
                    <div className="space-y-1.5 flex-1 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                          Socratic Diagnosis &bull; &Delta; -2 Overconfident
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">10:14 AM</span>
                        <span className="text-xs font-semibold text-blue-300">Cati SRL Companion</span>
                      </div>
                      <div className="rounded-2xl rounded-tr-sm border border-blue-500/40 bg-blue-950/30 p-3.5 text-xs text-left text-slate-200 shadow-[0_0_25px_rgba(59,130,246,0.15)] space-y-2">
                        <p>
                          Notice your calibration gap: you reported <strong>4/5 confidence</strong>, but wrote you were <em>&quot;confused about where to put the base case&quot;</em>.
                        </p>
                        <p className="text-blue-200">
                          Let&apos;s inspect your mental model: when <code className="bg-slate-900 text-blue-300 px-1 py-0.5 rounded border border-blue-400/20">factorial(3)</code> calls <code className="bg-slate-900 text-blue-300 px-1 py-0.5 rounded border border-blue-400/20">factorial(2)</code>, what instruction stops Python from allocating new stack frames for <code className="bg-slate-900 text-blue-300 px-1 py-0.5 rounded border border-blue-400/20">factorial(-1)</code>?
                        </p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0 shadow-sm shadow-blue-500/20">
                      <Brain className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>

                  {/* Turn 3: Student Active Articulation (LEFT SIDE) */}
                  <div className="flex justify-start items-start gap-3 max-w-[88%]">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0 shadow-sm">
                      AC
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Alex Chen</span>
                        <span className="text-[10px] font-mono text-slate-500">10:16 AM</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-blue-500/30 bg-blue-950/40 p-3.5 text-xs text-blue-100 shadow-md leading-relaxed">
                        Wait... without an if guard right at the top, the function never returns a value, so the stack grows infinitely until memory overflows!
                      </div>
                    </div>
                  </div>

                  {/* Turn 4: Automated System SRL Updates (FULL WIDTH) */}
                  <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-2">
                    <div className="flex items-center justify-between text-blue-400 text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        Zimmerman SRL Feedback Loop Closed
                      </span>
                      <span className="font-mono text-[10px] text-blue-300">+75 XP Awarded</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-300">
                      <div>Knowledge Node: <strong className="text-white">Base Case Guards (Weak 20%)</strong></div>
                      <div>Assigned Action: <strong className="text-white">10-min Paper Call Stack Trace</strong></div>
                      <div>Spaced Repetition: <strong className="text-white">Adaptive Drill in 24h</strong></div>
                      <div>Long-Term Transfer: <strong className="text-blue-400">92% Calibrated Retention</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Linear-Style Bottom Input Box (Mirrors Image 2) */}
            <div className="p-3 bg-[#0A0D15] border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-400">
                <span className="text-blue-400 font-mono font-semibold">@Cati</span>
                <span className="text-slate-500">
                  {activeThread === "chatbot"
                    ? "simulate passive question..."
                    : "synthesize reflection for base cases..."}
                </span>
              </div>
              <div className="flex items-center justify-between px-1 text-slate-500">
                <div className="flex items-center gap-2">
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><Plus className="h-3.5 w-3.5" /></button>
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><Type className="h-3.5 w-3.5" /></button>
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><Smile className="h-3.5 w-3.5" /></button>
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><AtSign className="h-3.5 w-3.5" /></button>
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><Video className="h-3.5 w-3.5" /></button>
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><Mic className="h-3.5 w-3.5" /></button>
                  <button className="h-6 w-6 rounded hover:bg-white/5 flex items-center justify-center hover:text-slate-300 cursor-pointer"><Paperclip className="h-3.5 w-3.5" /></button>
                </div>
                <button className="h-7 w-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-600/30 cursor-pointer transition-colors">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
