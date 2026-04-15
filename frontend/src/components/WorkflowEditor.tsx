"use client";

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Save, Play, Plus, Trash2, Settings2, Database, Zap, Cpu, Globe, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useWorkflows } from '@/src/lib/hooks/useDatabase';
import { serialize } from '@/src/lib/workflowSerializer';
import { useAuthStore } from '@/src/lib/store';
import { toast } from 'sonner';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Webhook Trigger' },
    position: { x: 250, y: 5 },
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' },
  },
  {
    id: '2',
    data: { label: 'LLM Processor' },
    position: { x: 100, y: 100 },
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' },
  },
  {
    id: '3',
    data: { label: 'Web Search Tool' },
    position: { x: 400, y: 100 },
    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4f46e5' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#4f46e5' } },
];

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { user } = useAuthStore();
  const { createWorkflow } = useWorkflows();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#4f46e5' } }, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handleSaveDraft = async () => {
    if (!user) { toast.error('You must be logged in to save'); return; }
    setIsSaving(true);
    try {
      const definition = serialize(nodes, edges, undefined, 'Untitled Workflow');
      await createWorkflow({
        name: 'Untitled Workflow',
        description: 'Created in visual editor',
        definition,
        is_published: false,
      });
      toast.success('Workflow saved as draft');
    } catch {
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) { toast.error('You must be logged in to publish'); return; }
    setIsPublishing(true);
    try {
      const definition = serialize(nodes, edges, undefined, 'Untitled Workflow');
      await createWorkflow({
        name: 'Untitled Workflow',
        description: 'Published from visual editor',
        definition,
        is_published: true,
      });
      toast.success('Workflow published as a chat tool');
    } catch {
      toast.error('Failed to publish workflow');
    } finally {
      setIsPublishing(false);
    }
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      data: { label: `New ${type}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Sidebar - Node Palette */}
      <div className="w-64 border-r border-zinc-800 p-4 space-y-6 bg-zinc-950/50">
        <div>
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Triggers</h3>
          <div className="space-y-2">
            <button onClick={() => addNode('Webhook')} className="w-full flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 transition-all group">
              <Zap className="w-4 h-4 text-amber-500" />
              Webhook
            </button>
            <button onClick={() => addNode('Cron')} className="w-full flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 transition-all">
              <Database className="w-4 h-4 text-blue-500" />
              Cron Job
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Actions</h3>
          <div className="space-y-2">
            <button onClick={() => addNode('LLM')} className="w-full flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 transition-all">
              <Cpu className="w-4 h-4 text-indigo-500" />
              LLM Node
            </button>
            <button onClick={() => addNode('Tool')} className="w-full flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300 transition-all">
              <Globe className="w-4 h-4 text-emerald-500" />
              Web Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="bg-zinc-950"
        >
          <Background color="#27272a" gap={20} />
          <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
          <MiniMap className="bg-zinc-900 border-zinc-800" nodeColor="#27272a" maskColor="rgba(0,0,0,0.5)" />

          <Panel position="top-right" className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {isSaving ? <Check className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isPublishing ? <Check className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
              {isPublishing ? 'Publishing…' : 'Publish Tool'}
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Properties Panel */}
      <div className={cn(
        "w-80 border-l border-zinc-800 p-6 bg-zinc-950/50 transition-all",
        selectedNode ? "translate-x-0" : "translate-x-full absolute right-0"
      )}>
        {selectedNode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Node Properties</h3>
              <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-zinc-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Node Name</label>
                <input
                  type="text"
                  value={selectedNode.data.label as string}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newLabel } } : n));
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Model Configuration</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none">
                  <option>GPT-4o (OpenAI)</option>
                  <option>Claude 3.5 Sonnet (Anthropic)</option>
                  <option>Gemini 1.5 Pro (Google)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">System Prompt</label>
                <textarea
                  rows={6}
                  placeholder="Enter instructions for this node..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <button className="w-full flex items-center justify-center gap-2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-300 transition-all">
                <Settings2 className="w-4 h-4" />
                Advanced Settings
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
              <Plus className="w-6 h-6 text-zinc-700" />
            </div>
            <p className="text-xs text-zinc-500">Select a node to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
