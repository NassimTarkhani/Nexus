"use client";

import { useTheme } from "@/src/lib/hooks/useTheme";
import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";

export function ThemeSwitcher() {
    const { themeStyle, setThemeStyle } = useTheme();

    const themes = [
        {
            value: "dark" as const,
            label: "Dark",
            icon: Moon,
            description: "Classic dark theme",
        },
        {
            value: "light" as const,
            label: "Light",
            icon: Sun,
            description: "Clean light theme",
        },
        {
            value: "atmospheric" as const,
            label: "Atmospheric",
            icon: Sparkles,
            description: "Immersive experience",
        },
    ];

    const currentTheme = themes.find((t) => t.value === themeStyle);
    const CurrentIcon = currentTheme?.icon || Moon;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 px-0 hover:bg-zinc-800"
                >
                    <CurrentIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1 bg-zinc-900 border-zinc-800">
                {themes.map((theme) => {
                    const Icon = theme.icon;
                    return (
                        <button
                            key={theme.value}
                            onClick={() => setThemeStyle(theme.value)}
                            className="w-full text-left cursor-pointer flex items-center rounded-md px-2 py-1.5 hover:bg-zinc-800"
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">{theme.label}</span>
                                <span className="text-xs text-zinc-500">{theme.description}</span>
                            </div>
                            {themeStyle === theme.value && (
                                <span className="ml-auto text-xs">✓</span>
                            )}
                        </button>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}
