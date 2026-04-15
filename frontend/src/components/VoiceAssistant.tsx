"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square, Volume2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type VoiceState = "idle" | "recording" | "processing" | "error";

interface VoiceAssistantProps {
    onTranscript?: (text: string) => void;
    language?: string;
    className?: string;
}

export function VoiceAssistant({ onTranscript, language, className }: VoiceAssistantProps) {
    const [voiceState, setVoiceState] = useState<VoiceState>("idle");
    const [duration, setDuration] = useState(0);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(12).fill(4));

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    useEffect(() => { return () => stopAll(); }, []);

    const stopAll = () => {
        mediaRecorderRef.current?.stop();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };

    const animateVisualizer = useCallback((analyser?: AnalyserNode) => {
        const draw = () => {
            if (analyser) {
                const data = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(data);
                setVisualizerBars(Array.from({ length: 12 }, (_, i) => {
                    const val = data[Math.floor((i / 12) * data.length)] ?? 0;
                    return Math.max(4, (val / 255) * 32);
                }));
            } else {
                setVisualizerBars((prev) => prev.map((b) => Math.max(4, Math.min(32, b + (Math.random() - 0.5) * 8))));
            }
            animFrameRef.current = requestAnimationFrame(draw);
        };
        animFrameRef.current = requestAnimationFrame(draw);
    }, []);

    const startRecording = async () => {
        setErrorMsg(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];
            try {
                const ctx = new AudioContext();
                const source = ctx.createMediaStreamSource(stream);
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 64;
                source.connect(analyser);
                analyserRef.current = analyser;
            } catch { analyserRef.current = null; }

            const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                ? "audio/webm;codecs=opus"
                : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";

            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            recorder.onstop = () => transcribe();
            mediaRecorderRef.current = recorder;
            recorder.start(250);

            setVoiceState("recording");
            setDuration(0);
            timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
            animateVisualizer(analyserRef.current ?? undefined);
        } catch (err) {
            if ((err as Error).name === "NotAllowedError") setPermissionDenied(true);
            setVoiceState("error");
            setErrorMsg("Microphone unavailable");
        }
    };

    const stopRecording = () => {
        if (!mediaRecorderRef.current) return;
        if (timerRef.current) clearInterval(timerRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setVisualizerBars(Array(12).fill(4));
        setVoiceState("processing");
        mediaRecorderRef.current.stop();
        streamRef.current?.getTracks().forEach((t) => t.stop());
    };

    const transcribe = async () => {
        if (chunksRef.current.length === 0) { setVoiceState("idle"); setErrorMsg("No audio recorded"); return; }
        const mimeType = chunksRef.current[0].type || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        const form = new FormData();
        form.append("audio", blob, "audio.webm");
        if (language) form.append("language", language);
        try {
            const res = await fetch("/api/voice/transcribe", { method: "POST", body: form });
            if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error || `Transcription failed (${res.status})`); }
            const { text } = await res.json();
            if (text?.trim()) { onTranscript?.(text.trim()); } else { setErrorMsg("No speech detected"); }
        } catch (e: unknown) {
            setErrorMsg(e instanceof Error ? e.message : "Transcription failed");
        } finally { setVoiceState("idle"); setDuration(0); }
    };

    const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            <div className="flex items-end gap-0.5 h-8">
                {visualizerBars.map((h, i) => (
                    <div key={i}
                        className={cn("w-1.5 rounded-full transition-all duration-75", voiceState === "recording" ? "bg-red-500" : "bg-zinc-700")}
                        style={{ height: voiceState === "recording" ? `${h}px` : "4px" }} />
                ))}
            </div>
            {voiceState === "recording" && <span className="text-xs font-mono text-red-400 animate-pulse">&#x25CF; {formatDuration(duration)}</span>}
            {voiceState === "processing" && <span className="text-xs text-zinc-500">Transcribing with Whisper&#8230;</span>}
            <button
                onClick={voiceState === "recording" ? stopRecording : startRecording}
                disabled={voiceState === "processing" || permissionDenied}
                className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-all border-2",
                    voiceState === "recording" ? "bg-red-600 border-red-500 shadow-lg shadow-red-500/40 scale-110"
                    : voiceState === "processing" ? "bg-zinc-800 border-zinc-700 cursor-wait"
                    : "bg-zinc-900 border-zinc-700 hover:border-indigo-500 hover:bg-indigo-600/10")}
            >
                {voiceState === "recording" ? <Square className="w-5 h-5 text-white fill-white" />
                 : voiceState === "processing" ? <Volume2 className="w-5 h-5 text-zinc-400 animate-pulse" />
                 : permissionDenied ? <MicOff className="w-5 h-5 text-red-400" />
                 : <Mic className="w-5 h-5 text-zinc-300" />}
            </button>
            {(errorMsg || permissionDenied) && (
                <p className="text-xs text-red-400 text-center max-w-[200px]">
                    {permissionDenied ? "Microphone access denied." : errorMsg}
                </p>
            )}
            <p className="text-[10px] text-zinc-600 text-center">
                {voiceState === "idle" ? "Click to record  powered by Whisper"
                 : voiceState === "recording" ? "Click to stop recording" : ""}
            </p>
        </div>
    );
}
