"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeStyle = "dark" | "light" | "atmospheric";

interface ThemeContextType {
    themeStyle: ThemeStyle;
    setThemeStyle: (style: ThemeStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeStyle, setThemeStyleState] = useState<ThemeStyle>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load saved theme from localStorage
        const saved = localStorage.getItem("nexus-theme");
        if (saved && (saved === "dark" || saved === "light" || saved === "atmospheric")) {
            setThemeStyleState(saved);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply theme to document
        document.documentElement.setAttribute("data-theme", themeStyle);

        // Save to localStorage
        localStorage.setItem("nexus-theme", themeStyle);
    }, [themeStyle, mounted]);

    const setThemeStyle = (style: ThemeStyle) => {
        setThemeStyleState(style);
    };

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeStyle, setThemeStyle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
