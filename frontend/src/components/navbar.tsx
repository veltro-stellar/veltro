"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./notifications";

export function Navbar({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void } = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 justify-between transition-all duration-300 ${
        scrolled
          ? "bg-[#070c18] border-b border-accent/20 shadow-lg shadow-black/20"
          : "bg-[#070c18]/80 border-b border-white/5"
      }`}
    >
      {/* Left — live indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Live Network
        </span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        {onMobileMenuOpen && (
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            onClick={onMobileMenuOpen}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
