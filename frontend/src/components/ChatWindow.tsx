"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Search, Code, Image as ImageIcon, BarChart3, StopCircle, Bot, Plus, ChevronDown, Wrench, Workflow } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore, useAuthStore } from "@/src/lib/store";
import { useProviderStore } from "@/src/lib/providers/store";
import { useAgentStore } from "@/src/lib/agentStore";
import { llmClient } from "@/src/lib/providers/client";
import { tools } from "@/src/lib/mocks";
import { ModelSelector } from "@/src/components/ModelSelector";
import { AVAILABLE_MODELS } from "@/src/lib/providers/types";
import { cn } from "@/src/lib/utils";

export default function ChatWindow() {
  const { messages, addMessage } = useAppStore();
  const { user } = useAuthStore();
  const { selectedProvider, selectedModel, setSelectedProvider, setSelectedModel, providers } = useProviderStore();
  const { agents } = useAgentStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showToolModeMenu, setShowToolModeMenu] = useState(false);
  const [toolMode, setToolMode] = useState<"auto" | "manual">("auto");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get current user name and greeting
  const userName = user?.full_name || "User";
  const firstName = userName.split(' ')[0];
  const greeting = `Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${firstName}!`;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !selectedProvider || !selectedModel) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setInput("");
    setIsTyping(true);

    let assistantMsgContent = "";
    const assistantId = (Date.now() + 1).toString();
    setStreamingMessageId(assistantId);

    // Initial empty message for streaming effect
    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      provider: selectedProvider,
      model: selectedModel,
    });

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      await llmClient.streamCompletion(
        messages.concat([userMsg]),
        selectedProvider,
        selectedModel,
        {
          onChunk: (chunk) => {
            assistantMsgContent += chunk;
            // Update the message in real-time
            useAppStore.setState((state) => ({
              messages: state.messages.map((m) =>
                m.id === assistantId ? { ...m, content: assistantMsgContent } : m
              ),
            }));
          },
          onComplete: (fullText) => {
            setIsTyping(false);
            setStreamingMessageId(null);
            abortControllerRef.current = null;
          },
          onError: (error) => {
            console.error('Streaming error:', error);
            useAppStore.setState((state) => ({
              messages: state.messages.map((m) =>
                m.id === assistantId
                  ? { ...m, content: `Error: ${error.message}. Please check your API key in Settings.` }
                  : m
              ),
            }));
            setIsTyping(false);
            setStreamingMessageId(null);
            abortControllerRef.current = null;
          },
          signal: abortControllerRef.current.signal,
        }
      );
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat error:', error);
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
      setStreamingMessageId(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    const lastWord = value.split(" ").pop() || "";
    if (lastWord.startsWith("@")) {
      setShowMentions(true);
      setMentionFilter(lastWord.slice(1));
    } else {
      setShowMentions(false);
    }
  };

  const selectMention = (toolName: string) => {
    const words = input.split(" ");
    words.pop();
    setInput([...words, `@${toolName} `].join(" "));
    setShowMentions(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          /* Empty State - Greeting */
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-zinc-200 mb-8">{greeting}</h1>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    N
                  </div>
                )}
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none"
                )}>
                  {msg.content || (msg.role === "assistant" && isTyping ? "..." : "")}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-300 font-bold text-sm">
                    U
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm animate-pulse">
                  N
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-zinc-500 italic">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-800/50 bg-zinc-950 p-4">
        <div className="max-w-4xl mx-auto relative">
          {/* Mentions Popover */}
          <AnimatePresence>
            {showMentions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-4 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-20"
              >
                <div className="p-2 border-b border-zinc-800 bg-zinc-900/50">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-2">Tools & Agents</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  {/* Agents Section */}
                  {agents.filter(a => a.name.toLowerCase().includes(mentionFilter.toLowerCase())).length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-zinc-600">Agents</div>
                      {agents
                        .filter(a => a.name.toLowerCase().includes(mentionFilter.toLowerCase()))
                        .map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => selectMention(agent.name)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-200">{agent.name}</p>
                              <p className="text-xs text-zinc-500 truncate">{agent.description}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Tools Section */}
                  {tools.filter(t => t.name.toLowerCase().includes(mentionFilter.toLowerCase())).length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-zinc-600">Tools</div>
                      {tools
                        .filter(t => t.name.toLowerCase().includes(mentionFilter.toLowerCase()))
                        .map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => selectMention(tool.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                              {tool.id === 'web-search' && <Search className="w-4 h-4" />}
                              {tool.id === 'js-executor' && <Code className="w-4 h-4" />}
                              {tool.id === 'image-gen' && <ImageIcon className="w-4 h-4" />}
                              {tool.id === 'data-viz' && <BarChart3 className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-200">{tool.name}</p>
                              <p className="text-xs text-zinc-500 truncate">{tool.description}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* No Results */}
                  {agents.filter(a => a.name.toLowerCase().includes(mentionFilter.toLowerCase())).length === 0 &&
                    tools.filter(t => t.name.toLowerCase().includes(mentionFilter.toLowerCase())).length === 0 && (
                      <div className="p-6 text-center text-sm text-zinc-500">
                        No tools or agents found
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
                if (e.key === "Escape") {
                  setShowMentions(false);
                  setShowToolsMenu(false);
                  setShowToolModeMenu(false);
                }
              }}
              placeholder="Ask anything or @mention"
              className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none max-h-32"
              rows={1}
            />

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800/50">
              {/* Left Side - Tool Mode + Add Button + Tools */}
              <div className="flex items-center gap-2">
                {/* Add Button */}
                <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>

                {/* Tool Mode Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowToolModeMenu(!showToolModeMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span className="capitalize">{toolMode}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {showToolModeMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full mb-2 left-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-30 min-w-[180px]"
                      >
                        <button
                          onClick={() => {
                            setToolMode("auto");
                            setShowToolModeMenu(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm transition-colors",
                            toolMode === "auto" ? "bg-zinc-800 text-zinc-200" : "text-zinc-400 hover:bg-zinc-800/50"
                          )}
                        >
                          <div className="font-medium">Auto</div>
                          <div className="text-xs text-zinc-500">Decides when to execute tools</div>
                        </button>
                        <button
                          onClick={() => {
                            setToolMode("manual");
                            setShowToolModeMenu(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm transition-colors",
                            toolMode === "manual" ? "bg-zinc-800 text-zinc-200" : "text-zinc-400 hover:bg-zinc-800/50"
                          )}
                        >
                          <div className="font-medium">Manual</div>
                          <div className="text-xs text-zinc-500">Asks for permission before launching</div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tools Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-200 transition-colors"
                  >
                    <span>Tools</span>
                    <span className="px-1.5 py-0.5 bg-zinc-700 rounded text-[10px] font-bold">{tools.length + 2}</span>
                  </button>

                  <AnimatePresence>
                    {showToolsMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full mb-2 left-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-30 w-72"
                      >
                        <div className="p-2 border-b border-zinc-800">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-2">Available Tools</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                          {/* Native Tools */}
                          <div>
                            <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-zinc-600">Native Tools</div>
                            {tools.map((tool) => (
                              <div
                                key={tool.id}
                                className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                              >
                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500">
                                  {tool.id === 'web-search' && <Search className="w-4 h-4" />}
                                  {tool.id === 'js-executor' && <Code className="w-4 h-4" />}
                                  {tool.id === 'image-gen' && <ImageIcon className="w-4 h-4" />}
                                  {tool.id === 'data-viz' && <BarChart3 className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-zinc-200">{tool.name}</p>
                                  <p className="text-[10px] text-zinc-500 truncate">{tool.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* MCPs */}
                          <div className="pt-2">
                            <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-zinc-600">MCP Tools</div>
                            <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-indigo-500">
                                <Workflow className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-200">execute_workflow</p>
                                <p className="text-[10px] text-zinc-500 truncate">Run automated workflows</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-purple-500">
                                <Search className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-200">search_knowledge_base</p>
                                <p className="text-[10px] text-zinc-500 truncate">Query RAG documents</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side - Model Selector + Send Button */}
              <div className="flex items-center gap-2">
                {/* Model Selector Dropdown */}
                <button
                  onClick={() => {
                    // Open model selector dialog
                    const event = new CustomEvent('openModelSelector');
                    window.dispatchEvent(event);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">
                    {selectedModel ? AVAILABLE_MODELS[selectedProvider!]?.find(m => m.id === selectedModel)?.name || selectedModel : "Select model"}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Send Button */}
                <button
                  onClick={isTyping ? handleStop : handleSend}
                  disabled={!input.trim() && !isTyping}
                  className={cn(
                    "p-2 transition-all rounded-lg",
                    isTyping
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white"
                  )}
                >
                  {isTyping ? <StopCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selector Dialog (hidden, triggered by event) */}
      <ModelSelector
        value={selectedModel ? { provider: "openrouter", model: selectedModel } : undefined}
        onChange={(model) => {
          setSelectedProvider("openrouter");
          setSelectedModel(model.model);
        }}
      />
    </div>
  );
}
