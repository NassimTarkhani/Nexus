"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Upload, File, FileText, FileCode, FileImage, Trash2, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Document {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: number;
    status: 'uploading' | 'processing' | 'ready' | 'error';
    chunks?: number;
}

export function DocumentLibrary() {
    const [documents, setDocuments] = useState<Document[]>([

    ]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
        const newDocs = files.map((file) => ({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: Date.now(),
            status: 'uploading' as const,
        }));

        setDocuments(prev => [...prev, ...newDocs]);

        // Simulate upload and processing
        newDocs.forEach((doc) => {
            setTimeout(() => {
                setDocuments(prev => prev.map(d =>
                    d.id === doc.id ? { ...d, status: 'processing' } : d
                ));

                setTimeout(() => {
                    setDocuments(prev => prev.map(d =>
                        d.id === doc.id ? { ...d, status: 'ready', chunks: Math.floor(Math.random() * 50) + 10 } : d
                    ));
                }, 2000);
            }, 1000);
        });
    };

    const handleDelete = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
        if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5" />;
        if (type.includes('image')) return <FileImage className="w-5 h-5" />;
        if (type.includes('text') || type.includes('markdown')) return <FileCode className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">Knowledge Base</h3>
                <p className="text-sm text-zinc-500">Upload documents to query them with RAG-powered AI chat</p>
            </div>

            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                    isDragging
                        ? "border-indigo-500 bg-indigo-600/10"
                        : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
                )}
            >
                <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mx-auto flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-zinc-200 mb-2">
                            Drop files here or click to upload
                        </h4>
                        <p className="text-sm text-zinc-500 mb-4">
                            Supports PDF, DOCX, TXT, MD, CSV (max 10MB each)
                        </p>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.docx,.txt,.md,.csv"
                            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload">
                            <Button asChild>
                                <span>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Select Files
                                </span>
                            </Button>
                        </label>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                        Documents ({documents.length})
                    </h4>
                    {documents.length > 0 && (
                        <Badge variant="secondary" className="text-[10px]">
                            {documents.reduce((acc, doc) => acc + (doc.chunks || 0), 0)} chunks indexed
                        </Badge>
                    )}
                </div>

                {documents.length === 0 ? (
                    <Card className="bg-zinc-900/30 border-zinc-800">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h4 className="text-lg font-bold text-zinc-300 mb-2">No documents yet</h4>
                            <p className="text-sm text-zinc-500">
                                Upload your first document to enable RAG search
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <Card
                                key={doc.id}
                                className="group hover:border-indigo-500/30 transition-all"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                            doc.status === 'ready' ? "bg-indigo-600/20 text-indigo-400" :
                                                doc.status === 'error' ? "bg-red-600/20 text-red-400" :
                                                    "bg-zinc-800 text-zinc-500"
                                        )}>
                                            {doc.status === 'uploading' || doc.status === 'processing' ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : doc.status === 'error' ? (
                                                <X className="w-5 h-5" />
                                            ) : (
                                                getFileIcon(doc.type)
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h5 className="text-sm font-semibold text-zinc-200 truncate">
                                                    {doc.name}
                                                </h5>
                                                {doc.status === 'ready' && (
                                                    <Badge variant="success" className="text-[10px] flex-shrink-0">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Ready
                                                    </Badge>
                                                )}
                                                {doc.status === 'uploading' && (
                                                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                                                        Uploading...
                                                    </Badge>
                                                )}
                                                {doc.status === 'processing' && (
                                                    <Badge variant="default" className="text-[10px] flex-shrink-0">
                                                        Processing...
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <span>{formatSize(doc.size)}</span>
                                                <span>•</span>
                                                <span>{formatDate(doc.uploadedAt)}</span>
                                                {doc.chunks && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{doc.chunks} chunks</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 rounded-lg hover:bg-red-600/20 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
                    <CardTitle className="text-base">💡 How RAG Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-400 space-y-2">
                    <p>
                        1. <strong>Upload</strong> - Your documents are chunked and embedded
                    </p>
                    <p>
                        2. <strong>Index</strong> - Chunks are stored in a vector database with metadata
                    </p>
                    <p>
                        3. <strong>Query</strong> - AI searches relevant chunks and cites sources in responses
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
