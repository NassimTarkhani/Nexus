"use client";

import { useState, useEffect } from "react";
import { verifyDatabaseSetup, getSetupInstructions, type SetupStatus } from "@/src/lib/verifySetup";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Shield, Zap } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function SetupCheckPage() {
    const [status, setStatus] = useState<SetupStatus | null>(null);
    const [checking, setChecking] = useState(false);
    const [instructions, setInstructions] = useState<string[]>([]);

    const runCheck = async () => {
        setChecking(true);
        const result = await verifyDatabaseSetup();
        setStatus(result);
        setInstructions(getSetupInstructions(result));
        setChecking(false);
    };

    useEffect(() => {
        runCheck();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
                        <Database className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-zinc-100">Database Setup Verification</h1>
                    <p className="text-zinc-400">Check if your Supabase database is properly configured</p>
                    <Button onClick={runCheck} disabled={checking} variant="outline" className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                        {checking ? 'Checking...' : 'Run Check Again'}
                    </Button>
                </div>

                {status && (
                    <>
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Connection */}
                            <div className={`bg-zinc-900 border rounded-2xl p-6 ${status.connected ? 'border-green-600/30' : 'border-red-600/30'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {status.connected ? (
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-400" />
                                    )}
                                    <h3 className="text-lg font-semibold text-zinc-100">Connection</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    {status.connected
                                        ? 'Successfully connected to Supabase'
                                        : 'Cannot connect to Supabase'}
                                </p>
                            </div>

                            {/* Tables */}
                            <div className={`bg-zinc-900 border rounded-2xl p-6 ${status.tablesExist ? 'border-green-600/30' : 'border-red-600/30'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {status.tablesExist ? (
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-400" />
                                    )}
                                    <h3 className="text-lg font-semibold text-zinc-100">Tables</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    {status.tablesExist
                                        ? 'All required tables exist'
                                        : 'Some tables are missing'}
                                </p>
                            </div>

                            {/* RLS Policies */}
                            <div className={`bg-zinc-900 border rounded-2xl p-6 ${status.rlsPoliciesExist ? 'border-green-600/30' : 'border-yellow-600/30'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {status.rlsPoliciesExist ? (
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                    )}
                                    <h3 className="text-lg font-semibold text-zinc-100">RLS Policies</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    {status.rlsPoliciesExist
                                        ? 'Row Level Security is enabled'
                                        : 'RLS configuration needs verification'}
                                </p>
                            </div>

                            {/* Triggers */}
                            <div className={`bg-zinc-900 border rounded-2xl p-6 ${status.triggerExists ? 'border-green-600/30' : 'border-yellow-600/30'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {status.triggerExists ? (
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                    )}
                                    <h3 className="text-lg font-semibold text-zinc-100">Triggers</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Trigger verification from client not available
                                </p>
                            </div>
                        </div>

                        {/* Errors */}
                        {status.errors.length > 0 && (
                            <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <XCircle className="w-6 h-6 text-red-400" />
                                    <h3 className="text-lg font-semibold text-red-400">Errors</h3>
                                </div>
                                <ul className="space-y-2">
                                    {status.errors.map((error, i) => (
                                        <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                                            <span className="text-red-500">•</span>
                                            <span>{error}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Warnings */}
                        {status.warnings.length > 0 && (
                            <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                    <h3 className="text-lg font-semibold text-yellow-400">Warnings</h3>
                                </div>
                                <ul className="space-y-2">
                                    {status.warnings.map((warning, i) => (
                                        <li key={i} className="text-sm text-yellow-300 flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>{warning}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Instructions */}
                        {instructions.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap className="w-6 h-6 text-indigo-400" />
                                    <h3 className="text-lg font-semibold text-zinc-100">Setup Instructions</h3>
                                </div>
                                <div className="space-y-2 font-mono text-sm">
                                    {instructions.map((instruction, i) => (
                                        <div key={i} className={`${instruction.startsWith('✅') ? 'text-green-400' :
                                                instruction.startsWith('❌') ? 'text-red-400' :
                                                    instruction.startsWith('⚠️') ? 'text-yellow-400' :
                                                        instruction.startsWith('🔧') ? 'text-blue-400' :
                                                            instruction.startsWith('📝') ? 'text-purple-400' :
                                                                'text-zinc-400'
                                            }`}>
                                            {instruction}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Environment Variables */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-6 h-6 text-purple-400" />
                                <h3 className="text-lg font-semibold text-zinc-100">Environment Variables</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-zinc-300">NEXT_PUBLIC_SUPABASE_URL</span>
                                        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <code className="text-xs text-zinc-500 break-all">
                                        {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
                                    </code>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-zinc-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                                        {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <code className="text-xs text-zinc-500 break-all">
                                        {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                                            ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                                            : 'Not set'}
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Quick Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/project/default/editor`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors"
                                >
                                    SQL Editor
                                </a>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/project/default/editor`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors"
                                >
                                    Table Editor
                                </a>
                                <a
                                    href="/auth/signup"
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors"
                                >
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </>
                )}

                {/* Loading State */}
                {!status && checking && (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
