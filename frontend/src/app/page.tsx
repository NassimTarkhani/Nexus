"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Workflow,
  Users,
  Archive,
  Plug,
  Plus,
  Settings,
  Moon,
  Globe,
  User,
  ChevronDown,
  Zap,
  Edit3,
  LogOut,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AuthProvider from "@/src/components/AuthProvider";
import { EnhancedChatWindow } from "@/src/components/EnhancedChatWindow";
import WorkflowEditor from "@/src/components/WorkflowEditor";
import { DocumentLibrary } from "@/src/components/DocumentLibrary";
import { MCPSettings } from "@/src/components/MCPSettings";
import { AgentManager } from "@/src/components/AgentManager";
import { ProviderSettings } from "@/src/components/ProviderSettings";
import { UserManagement } from "@/src/components/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/lib/store";
import { useAgentStore } from "@/src/lib/agentStore";
import { conversationsService } from "@/src/lib/services/conversations";

interface ConversationEntry {
  id: string;
  title: string;
  updated_at: string;
}

function DashboardContent() {
  const [activeView, setActiveView] = useState<"chat" | "mcp" | "workflow" | "archive" | "settings">("chat");
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatKey, setChatKey] = useState(0); // force remount for new chat
  const { user, signOut } = useAuthStore();
  const { agents } = useAgentStore();

  // Load conversations from DB when user is available
  useEffect(() => {
    if (!user?.id) return;
    conversationsService.getConversations(user.id)
      .then((data) => setConversations(data as ConversationEntry[]))
      .catch((err) => console.error("Failed to load conversations:", err));
  }, [user?.id]);

  // Called when a new conversation is created inside EnhancedChatWindow
  const handleConversationCreated = useCallback((id: string, title: string) => {
    setActiveConversationId(id);
    setConversations((prev) => [{ id, title, updated_at: new Date().toISOString() }, ...prev]);
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setChatKey((k) => k + 1); // remount EnhancedChatWindow
    setActiveView("chat");
  }, []);

  const handleLoadConversation = useCallback((convId: string) => {
    setActiveConversationId(convId);
    setChatKey((k) => k + 1); // remount to reset state
    setActiveView("chat");
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const userInitials = user?.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col relative z-20">
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-base tracking-tight">NEXUS</span>
          </div>
          <button
            onClick={() => setActiveView("settings")}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:bg-zinc-900 transition-all text-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span className="font-medium">New Chat</span>
          </button>

          {/* MCP Configuration */}
          <button
            onClick={() => setActiveView("mcp")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
              activeView === "mcp" ? "bg-zinc-900 text-zinc-200" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
            )}
          >
            <Plug className="w-4 h-4" />
            <span className="font-medium">MCP Configuration</span>
          </button>

          {/* Workflow */}
          <button
            onClick={() => setActiveView("workflow")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
              activeView === "workflow" ? "bg-zinc-900 text-zinc-200" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
            )}
          >
            <Workflow className="w-4 h-4" />
            <span className="font-medium">Workflow</span>
          </button>

          {/* Archive (Documents) */}
          <button
            onClick={() => setActiveView("archive")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
              activeView === "archive" ? "bg-zinc-900 text-zinc-200" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
            )}
          >
            <Archive className="w-4 h-4" />
            <span className="font-medium">Archive</span>
          </button>

          {/* Agents Section */}
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Agents</h3>
              <button
                onClick={() => setShowChatHistory(!showChatHistory)}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <ChevronDown className={cn("w-3 h-3 transition-transform", showChatHistory && "rotate-180")} />
              </button>
            </div>

            <button className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300 transition-all text-left group">
              <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-300">Create an agent →</div>
                <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">
                  Create your own specialized AI agent or select from shared agents in the Agents page
                </p>
              </div>
            </button>
          </div>

          {/* Recent Chats (under Agents) */}
          <AnimatePresence>
            {showChatHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 pt-2"
              >
                <div className="px-2 mb-2">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Recent Chats</h3>
                </div>
                {conversations.length > 0 ? (
                  conversations.slice(0, 20).map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleLoadConversation(conv.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm text-left",
                        activeConversationId === conv.id
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
                      )}
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-xs">{conv.title}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-zinc-600 px-3 py-2 text-center">No conversations yet</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Profile Bar */}
        <div className="p-3 border-t border-zinc-800 relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-900 rounded-lg transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-zinc-200 truncate">{user?.full_name}</div>
              <div className="text-xs text-zinc-500 truncate">{user?.email}</div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", showProfileMenu && "rotate-180")} />
          </button>

          {/* Profile Menu */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-3 right-3 mb-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-2 space-y-1">
                  {user?.role === 'admin' && (
                    <>
                      <div className="px-3 py-2 mb-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                          <Shield className="w-3 h-3" />
                          <span>ADMIN</span>
                        </div>
                      </div>
                      <div className="h-px bg-zinc-800 my-2" />
                    </>
                  )}
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-all text-sm text-zinc-300">
                    <Moon className="w-4 h-4" />
                    <span>Theme</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-all text-sm text-zinc-300">
                    <Globe className="w-4 h-4" />
                    <span>Language</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-all text-sm text-zinc-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Preferences</span>
                  </button>
                  <button
                    onClick={() => setActiveView("settings")}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-all text-sm text-zinc-300"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="h-px bg-zinc-800 my-2" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-all text-sm text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950">
        {activeView === "chat" && (
          <EnhancedChatWindow
            key={chatKey}
            loadConversationId={activeConversationId}
            onConversationCreated={handleConversationCreated}
          />
        )}
        {activeView === "mcp" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-12 max-w-5xl mx-auto w-full">
              <MCPSettings />
            </div>
          </div>
        )}
        {activeView === "workflow" && <WorkflowEditor />}
        {activeView === "archive" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-12 max-w-5xl mx-auto w-full">
              <DocumentLibrary />
            </div>
          </div>
        )}
        {activeView === "settings" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-12 max-w-6xl mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">Settings</h2>
                <p className="text-zinc-500">Configure NEXUS providers and integrations</p>
              </div>
              <Tabs defaultValue="providers" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="providers">LLM Providers</TabsTrigger>
                  <TabsTrigger value="mcp">MCP Servers</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                  {user?.role === 'admin' && (
                    <TabsTrigger value="users">User Management</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="providers">
                  <ProviderSettings />
                </TabsContent>
                <TabsContent value="mcp">
                  <MCPSettings />
                </TabsContent>
                <TabsContent value="agents">
                  <AgentManager />
                </TabsContent>
                {user?.role === 'admin' && (
                  <TabsContent value="users">
                    <UserManagement />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
