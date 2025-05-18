"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [currentIcon, setCurrentIcon] = React.useState<React.ReactNode>(<Sun className="h-[1.2rem] w-[1.2rem]" />);

  React.useEffect(() => {
    if (theme === "light") {
      setCurrentIcon(<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />);
    } else if (theme === "dark") {
      setCurrentIcon(<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />);
    } else if (theme === "system") {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentIcon(systemPrefersDark ? <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /> : <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {currentIcon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}