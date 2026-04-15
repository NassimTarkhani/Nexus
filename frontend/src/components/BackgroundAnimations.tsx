"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/src/lib/hooks/useTheme";

export function BackgroundAnimations() {
    const { themeStyle } = useTheme();
    const theme = themeStyle;
    const containerRef = useRef<HTMLDivElement>(null);

    // Theme-specific color palettes
    const getColors = () => {
        switch (theme) {
            case "light":
                return {
                    blob1: "rgba(79, 70, 229, 0.15)", // indigo
                    blob2: "rgba(147, 51, 234, 0.15)", // purple
                    blob3: "rgba(236, 72, 153, 0.15)", // pink
                    blob4: "rgba(59, 130, 246, 0.15)", // blue
                };
            case "atmospheric":
                return {
                    blob1: "rgba(99, 102, 241, 0.2)", // indigo
                    blob2: "rgba(139, 92, 246, 0.2)", // violet
                    blob3: "rgba(168, 85, 247, 0.2)", // purple
                    blob4: "rgba(59, 130, 246, 0.2)", // blue
                };
            case "dark":
            default:
                return {
                    blob1: "rgba(79, 70, 229, 0.1)", // indigo
                    blob2: "rgba(147, 51, 234, 0.1)", // purple
                    blob3: "rgba(16, 185, 129, 0.1)", // emerald
                    blob4: "rgba(59, 130, 246, 0.1)", // blue
                };
        }
    };

    const colors = getColors();

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: -1 }}
        >
            {/* Blob 1 - Slow floating */}
            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    background: colors.blob1,
                    width: "40vw",
                    height: "40vw",
                    maxWidth: "600px",
                    maxHeight: "600px",
                }}
                animate={{
                    x: ["-10%", "10%", "-10%"],
                    y: ["-10%", "15%", "-10%"],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ x: "-10%", y: "-10%" }}
            />

            {/* Blob 2 - Medium speed */}
            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    background: colors.blob2,
                    width: "35vw",
                    height: "35vw",
                    maxWidth: "500px",
                    maxHeight: "500px",
                    right: 0,
                    top: 0,
                }}
                animate={{
                    x: ["10%", "-15%", "10%"],
                    y: ["10%", "-10%", "10%"],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ x: "10%", y: "10%" }}
            />

            {/* Blob 3 - Faster movement */}
            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    background: colors.blob3,
                    width: "30vw",
                    height: "30vw",
                    maxWidth: "450px",
                    maxHeight: "450px",
                    left: "50%",
                    bottom: 0,
                }}
                animate={{
                    x: ["-20%", "20%", "-20%"],
                    y: ["0%", "-20%", "0%"],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ x: "-20%", y: "0%" }}
            />

            {/* Blob 4 - Diagonal movement */}
            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    background: colors.blob4,
                    width: "25vw",
                    height: "25vw",
                    maxWidth: "400px",
                    maxHeight: "400px",
                    right: "20%",
                    bottom: "20%",
                }}
                animate={{
                    x: ["0%", "25%", "0%"],
                    y: ["0%", "25%", "0%"],
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                initial={{ x: "0%", y: "0%" }}
            />
        </div>
    );
}
