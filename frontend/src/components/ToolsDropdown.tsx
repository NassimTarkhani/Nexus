"use client";

import { useState } from "react";
import { Workflow, Wrench, ChevronDown, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";

export interface Tool {
    id: string;
    type: "workflow" | "mcp";
    name: string;
    description: string;
    icon?: string;
}

interface ToolsDropdownProps {
    workflows: Tool[];
    mcpTools: Tool[];
    selectedTool?: Tool | null;
    onSelectTool: (tool: Tool | null) => void;
    className?: string;
}

export function ToolsDropdown({
    workflows,
    mcpTools,
    selectedTool,
    onSelectTool,
    className,
}: ToolsDropdownProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (tool: Tool) => {
        onSelectTool(tool);
        setOpen(false);
    };

    const handleClear = () => {
        onSelectTool(null);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700",
                        selectedTool && "border-emerald-600",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        {selectedTool ? (
                            <>
                                {selectedTool.type === "workflow" ? (
                                    <Workflow className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <Wrench className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                )}
                                <span className="truncate">{selectedTool.name}</span>
                            </>
                        ) : (
                            <>
                                <Wrench className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                                <span className="text-zinc-500">No tools</span>
                            </>
                        )}
                    </div>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0 text-zinc-400" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 bg-zinc-900 border-zinc-800" align="start" sideOffset={8}>
                <div className="max-h-[400px] overflow-y-auto">
                    {/* None option */}
                    <div className="p-2 border-b border-zinc-800">
                        <button
                            onClick={handleClear}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left",
                                !selectedTool && "bg-zinc-800"
                            )}
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                <Wrench className="w-4 h-4 text-zinc-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-zinc-300">No tools</div>
                                <div className="text-xs text-zinc-500">Regular chat without tools</div>
                            </div>
                            {!selectedTool && <Check className="w-4 h-4 text-emerald-500" />}
                        </button>
                    </div>

                    {/* Workflows section */}
                    {workflows.length > 0 && (
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">
                                Workflows
                            </div>
                            {workflows.map((workflow) => (
                                <button
                                    key={workflow.id}
                                    onClick={() => handleSelect(workflow)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left group",
                                        selectedTool?.id === workflow.id && "bg-zinc-800"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                                        <Workflow className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-zinc-200">{workflow.name}</div>
                                        <div className="text-xs text-zinc-500 truncate">
                                            {workflow.description}
                                        </div>
                                    </div>
                                    {selectedTool?.id === workflow.id && (
                                        <Check className="w-4 h-4 text-emerald-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* MCP Tools section */}
                    {mcpTools.length > 0 && (
                        <div className="p-2 border-t border-zinc-800">
                            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">
                                MCP Tools
                            </div>
                            {mcpTools.map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleSelect(tool)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left group",
                                        selectedTool?.id === tool.id && "bg-zinc-800"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                                        <Wrench className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-zinc-200">{tool.name}</div>
                                        <div className="text-xs text-zinc-500 truncate">
                                            {tool.description}
                                        </div>
                                    </div>
                                    {selectedTool?.id === tool.id && (
                                        <Check className="w-4 h-4 text-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {workflows.length === 0 && mcpTools.length === 0 && (
                        <div className="p-8 text-center text-zinc-500">
                            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No workflows or tools available</p>
                            <p className="text-xs mt-1">Create workflows in the workflow editor</p>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
