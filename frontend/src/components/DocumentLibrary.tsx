"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
    Upload, File, FileText, FileCode, FileImage,
    Trash2, Check, X, Loader2, MessageSquare, Search,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";
import { documentsService } from "@/src/lib/services/documents";
import { DocumentChat } from "./DocumentChat";
import { toast } from "sonner";

interface Document {
    id: string;
    name: string;
    file_type: string;
    file_size: number;
    content: string | null;
    chunk_count: number;
    status: "uploading" | "processing" | "ready" | "error";
    error_message: string | null;
    created_at: string;
    updated_at: string;
}

export function DocumentLibrary() {
    const { user } = useAuthStore();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chatDocument, setChatDocument] = useState<Document | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDocuments = useCallback(() => {
        if (!user?.id) { setDocuments([]); setLoading(false); return; }
        setLoading(true);
        documentsService.getDocuments(user.id)
            .then((data) => setDocuments(data as Document[]))
            .catch((err) => console.error("Failed to load documents:", err))
            .finally(() => setLoading(false));
    }, [user?.id]);

    // Load on mount and when auth is ready
    useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

    // Re-fetch when tab regains focus
    useEffect(() => {
        window.addEventListener("focus", fetchDocuments);
        return () => window.removeEventListener("focus", fetchDocuments);
    }, [fetchDocuments]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(Array.from(e.dataTransfer.files));
    };

    const uploadFile = useCallback(async (file: File) => {
        if (!user?.id) { toast.error("Sign in to upload documents"); return; }

        const tempId = `uploading-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const placeholder: Document = {
            id: tempId, name: file.name, file_type: file.type || "application/octet-stream",
            file_size: file.size, content: null, chunk_count: 0, status: "uploading",
            error_message: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        setDocuments((prev) => [placeholder, ...prev]);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", user.id);

            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Upload failed (${res.status})`);
            }
            const data = await res.json();
            setDocuments((prev) => prev.map((d) => d.id === tempId ? (data.document as Document) : d));
            toast.success(`"${file.name}" uploaded`, { description: `${data.chunks} chunks indexed` });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Upload failed";
            toast.error(`Failed to upload "${file.name}"`, { description: msg });
            setDocuments((prev) => prev.map((d) =>
                d.id === tempId ? { ...d, status: "error" as const, error_message: msg } : d));
        }
    }, [user?.id]);

    const handleFiles = (files: File[]) => { for (const file of files) uploadFile(file); };

    const handleDelete = async (id: string) => {
        if (id.startsWith("uploading-")) { setDocuments((p) => p.filter((d) => d.id !== id)); return; }
        try {
            await documentsService.deleteDocument(id);
            setDocuments((p) => p.filter((d) => d.id !== id));
            toast.success("Document deleted");
        } catch { toast.error("Failed to delete document"); }
    };
    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="w-5 h-5" />;
        if (type.includes("word") || type.includes("document")) return <FileText className="w-5 h-5" />;
        if (type.includes("image")) return <FileImage className="w-5 h-5" />;
        if (type.includes("text") || type.includes("markdown")) return <FileCode className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    // If chatting with a document, show the chat view
    if (chatDocument) {
        return (
            <DocumentChat
                document={{
                    id: chatDocument.id,
                    name: chatDocument.name,
                    file_type: chatDocument.file_type,
                    chunk_count: chatDocument.chunk_count,
                }}
                onBack={() => setChatDocument(null)}
            />
        );
    }

    const filteredDocs = searchQuery
        ? documents.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : documents;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">Knowledge Base</h3>
                <p className="text-sm text-zinc-500">Upload documents to query them with RAG-powered AI chat</p>
            </div>

            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                    isDragging ? "border-indigo-500 bg-indigo-600/10" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
                )}
            >
                <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mx-auto flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-zinc-200 mb-2">Drop files here or click to upload</h4>
                        <p className="text-sm text-zinc-500 mb-4">Supports PDF, TXT, MD, CSV (max 10MB each)</p>
                        <input type="file" multiple accept=".pdf,.txt,.md,.csv"
                            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                            className="hidden" id="file-upload" />
                        <label htmlFor="file-upload">
                            <Button asChild><span><Upload className="w-4 h-4 mr-2" />Select Files</span></Button>
                        </label>
                    </div>
                    {!user && <p className="text-xs text-amber-500">Sign in to upload and persist documents</p>}
                </div>
            </div>

            {/* Search + Documents List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Documents ({documents.length})</h4>
                    {documents.length > 0 && (
                        <Badge variant="secondary" className="text-[10px]">
                            {documents.reduce((acc, doc) => acc + (doc.chunk_count || 0), 0)} chunks indexed
                        </Badge>
                    )}
                </div>

                {documents.length > 3 && (
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 outline-none" />
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <Card className="bg-zinc-900/30 border-zinc-800">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h4 className="text-lg font-bold text-zinc-300 mb-2">
                                {searchQuery ? "No matching documents" : "No documents yet"}
                            </h4>
                            <p className="text-sm text-zinc-500">
                                {searchQuery ? "Try a different search query" : "Upload your first document to enable RAG search"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {filteredDocs.map((doc) => (
                            <Card key={doc.id} className="group hover:border-indigo-500/30 transition-all">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                            doc.status === "ready" ? "bg-indigo-600/20 text-indigo-400" :
                                                doc.status === "error" ? "bg-red-600/20 text-red-400" : "bg-zinc-800 text-zinc-500"
                                        )}>
                                            {doc.status === "uploading" || doc.status === "processing" ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : doc.status === "error" ? (
                                                <X className="w-5 h-5" />
                                            ) : getFileIcon(doc.file_type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h5 className="text-sm font-semibold text-zinc-200 truncate">{doc.name}</h5>
                                                {doc.status === "ready" && (
                                                    <Badge variant="success" className="text-[10px] flex-shrink-0">
                                                        <Check className="w-3 h-3 mr-1" />Ready
                                                    </Badge>
                                                )}
                                                {doc.status === "uploading" && (
                                                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">Uploading...</Badge>
                                                )}
                                                {doc.status === "processing" && (
                                                    <Badge variant="default" className="text-[10px] flex-shrink-0">Processing...</Badge>
                                                )}
                                                {doc.status === "error" && (
                                                    <Badge variant="destructive" className="text-[10px] flex-shrink-0">Error</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <span>{formatSize(doc.file_size)}</span>
                                                <span>&middot;</span>
                                                <span>{formatDate(doc.created_at)}</span>
                                                {doc.chunk_count > 0 && (
                                                    <><span>&middot;</span><span>{doc.chunk_count} chunks</span></>
                                                )}
                                            </div>
                                            {doc.error_message && (
                                                <p className="text-xs text-red-400 mt-1 truncate">{doc.error_message}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {doc.status === "ready" && (
                                                <Button variant="ghost" size="sm" onClick={() => setChatDocument(doc)}
                                                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/10">
                                                    <MessageSquare className="w-4 h-4 mr-1" />Chat
                                                </Button>
                                            )}
                                            <button onClick={() => handleDelete(doc.id)}
                                                className="p-2 rounded-lg hover:bg-red-600/20 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
                <CardHeader>
                    <CardTitle className="text-base">How RAG Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-400 space-y-2">
                    <p>1. <strong>Upload</strong> &mdash; Your documents are chunked and stored</p>
                    <p>2. <strong>Index</strong> &mdash; Text chunks are prepared for retrieval</p>
                    <p>3. <strong>Chat</strong> &mdash; Click the Chat button to ask AI questions about any document with full context</p>
                </CardContent>
            </Card>
        </div>
    );
}
