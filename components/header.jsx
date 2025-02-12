"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("dark") === "true";
    setIsDarkMode(darkMode);
    document.body.classList.toggle('dark', darkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("dark", isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex-1 flex">
          <h1>SKU GENERATOR</h1>
        </div>

        <div className="flex-1 flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 group" 
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            <SunIcon className={`group-hover:animate-spin transition-transform duration-300 ${isDarkMode ? 'block' : 'hidden'} h-4 w-4`} />
            <MoonIcon className={`group-hover:animate-pulse transition-transform duration-300 ${isDarkMode ? 'hidden' : 'block'} h-4 w-4`} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
} 