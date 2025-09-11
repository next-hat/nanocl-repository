"use client";
import React from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { FiPackage, FiFileText, FiEye } from "react-icons/fi";

export interface StatefileItem {
  slug: string;
  name: string;
  about: string;
  latestVersion: string;
  tags: string[];
}

export default function SearchableList({ items, version, placeholder = "Search by name, tag, or description" }: { items: StatefileItem[]; version: string; placeholder?: string; }) {
  const [q, setQ] = React.useState("");
  const query = q.trim().toLowerCase();
  const filtered = !query
    ? items
    : items.filter((s) => {
        const inName = s.name.toLowerCase().includes(query) || s.slug.toLowerCase().includes(query);
        const inAbout = (s.about || "").toLowerCase().includes(query);
        const inTags = (s.tags || []).some((t) => t.toLowerCase().includes(query));
        return inName || inAbout || inTags;
      });
  return (
    <div className="space-y-4">
      <div className="max-w-xl flex mx-auto">
        <SearchBar id="global-search-input" placeholder={placeholder} onChange={setQ} value={q} />
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <li key={s.slug} className="bg-background rounded-lg border p-4 hover:shadow h-full flex flex-col">
            <div className="flex items-center justify-between">
              <Link href={`/${version}/${s.slug}`} className="inline-flex items-center gap-2 text-lg font-medium hover:underline">
                <FiPackage className="text-muted-foreground" aria-hidden />
                {s.name}
              </Link>
              <span className="text-xs text-muted-foreground">{s.latestVersion}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.about}</p>

            {/* Footer pinned to bottom: tags + action */}
            <div className="mt-auto pt-3 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/tag/${t}`}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-orange-600 hover:bg-accent"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={`/${version}/${s.slug}`}
              aria-label={`View manual for ${s.name}`}
              className="text-center justify-center mt-2 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            >
              <FiEye aria-hidden />
              View manual
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No results. Try a different search.</p>
      )}
    </div>
  );
}
