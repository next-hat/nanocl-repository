"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

/**
 * Header with title and a search opener (Ctrl+K).
 * Focuses element with id="global-search-input" when invoked.
 */
export default function Header() {
  const [hint, setHint] = useState(false);
  const focusSearch = () => {
    const el = document.getElementById('global-search-input') as HTMLInputElement | null;
    el?.focus();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="sticky top-0 z-10 w-full h-[3.75rem] px-[16px] py-[8px] bg-background shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center py-2">
          <div className="mr-2 w-[32px]">
            <Image
              src="/public/logo3.png"
              className="rounded-full"
              priority
              alt="Next Hat Logo"
              width={32}
              height={32}
            />
          </div>
          <b className="flex-auto text-[14px]">Next Hat</b>
        </Link>
      </div>
    </header>
  );
}
