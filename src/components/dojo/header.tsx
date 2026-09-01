"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Search as SearchIcon,
  Code2,
  LogOut,
  User as UserIcon,
  Check,
  Sparkles,
  Dumbbell,
  GraduationCap,
  AlertOctagon,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeltBadge } from "@/components/dojo/belt";
import { getBrowserClient } from "@/lib/supabase/client";
import { useLanguage, SupportedLanguageId } from "@/contexts/language-context";
import { User } from "@supabase/supabase-js";
import { SearchResultItem } from "@/app/api/search/route";

import { useAuth } from "@/contexts/auth-context";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { activeLanguage, activeLanguageId, setActiveLanguage, languages } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&lang=${activeLanguageId}`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.warn("Search fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, activeLanguageId]);

  // Click outside to close search popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (langId: SupportedLanguageId) => {
    setActiveLanguage(langId);
    setIsLangOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const avatarUrl = profile?.avatarUrl;
  const displayName = profile?.displayName || "Warrior";
  const initial = profile?.initial || "W";

  return (
    <header className="h-18 border-b-2 border-[#1E293B] bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 select-none relative z-30">
      {/* Left Area: Mobile Menu + Global Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4 stroke-[2.5]" />
        </Button>

        {/* Global Search with Real-time Popover */}
        <div ref={searchContainerRef} className="relative hidden sm:block">
          <SearchIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] stroke-[2.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={`Search ${activeLanguage.shortName} workouts, concepts, traps...`}
            className="pl-9.5 pr-4 py-2 rounded-full border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-medium text-[#1E293B] placeholder-[#94A3B8] w-64 md:w-80 shadow-[2px_2px_0_#1E293B] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[4px_4px_0_#8B5CF6] transition-all"
          />

          {/* Search Dropdown Popover */}
          {isSearchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 mt-2 w-96 rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[6px_6px_0_#1E293B] space-y-1 z-50 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 border-b-2 border-[#1E293B]/10 flex items-center justify-between">
                <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#64748B]">
                  Search Results ({activeLanguage.shortName})
                </span>
                {isSearching && (
                  <div className="w-3 h-3 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin" />
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-1 py-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        router.push(item.href);
                      }}
                      className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-[#FFFDF5] border-2 border-transparent hover:border-[#1E293B] transition-all cursor-pointer group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#8B5CF6]">
                        {item.category === "workout" && <Dumbbell className="h-3 w-3 stroke-[2.5]" />}
                        {item.category === "curriculum" && <GraduationCap className="h-3 w-3 stroke-[2.5]" />}
                        {item.category === "concept" && <Layers className="h-3 w-3 stroke-[2.5]" />}
                        {item.category === "mistake" && <AlertOctagon className="h-3 w-3 stroke-[2.5]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-xs text-[#1E293B] truncate group-hover:text-[#8B5CF6]">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#64748B] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8] shrink-0 self-center group-hover:text-[#8B5CF6]" />
                    </button>
                  ))}
                </div>
              ) : !isSearching ? (
                <div className="p-4 text-center text-xs text-[#64748B]">
                  <p className="font-heading font-bold text-[#1E293B] mb-0.5">No results found</p>
                  <p className="text-[11px]">Try searching for &quot;loops&quot;, &quot;array&quot;, or &quot;variables&quot;</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Language Selector + User Identity */}
      <div className="flex items-center gap-3">
        {/* Language Selector Pill & Dropdown */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsLangOpen(!isLangOpen);
              setIsMenuOpen(false);
            }}
            className="gap-1.5 bg-[#FFFDF5] hover:bg-[#FBBF24] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
          >
            <Code2 className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
            <span className="font-heading font-bold">{activeLanguage.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
          </Button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[6px_6px_0_#1E293B] space-y-1 z-50">
              <div className="px-3 py-2 border-b-2 border-[#1E293B]/10 flex items-center justify-between">
                <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#64748B]">
                  Choose Programming Language
                </span>
                <Sparkles className="h-3 w-3 text-[#8B5CF6]" />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1">
                {languages.map((lang) => {
                  const isCurrent = activeLanguageId === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleSelectLanguage(lang.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all text-left cursor-pointer ${
                        isCurrent
                          ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
                          : "text-[#1E293B] hover:bg-[#FFFDF5] border-2 border-transparent hover:border-[#1E293B]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className={`h-3.5 w-3.5 ${isCurrent ? "text-white" : "text-[#8B5CF6]"}`} />
                        <div>
                          <p className="leading-tight">{lang.name}</p>
                          <p className={`text-[10px] ${isCurrent ? "text-white/80" : "text-[#64748B]"}`}>
                            {lang.version}
                          </p>
                        </div>
                      </div>
                      {isCurrent && <Check className="h-4 w-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t-2 border-[#1E293B]/10 bg-[#FFFDF5] rounded-xl text-[10px] text-[#64748B] font-medium leading-tight">
                OneCompiler sandbox &amp; Sensei AI dynamically execute all languages.
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-0.5 bg-[#1E293B]/20 hidden sm:block" />

        {/* User Identity Pill & Dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsLangOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 cursor-pointer"
          >
            <BeltBadge belt="yellow" size="sm" className="hidden md:inline-flex" />

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B] object-cover hover:rotate-6 transition-transform"
              />
            ) : (
              <div className="h-9 w-9 rounded-full border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] flex items-center justify-center font-heading font-black text-sm shadow-[2px_2px_0_#1E293B] hover:rotate-6 transition-transform">
                {initial}
              </div>
            )}
          </div>

          {/* Quick User Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[6px_6px_0_#1E293B] space-y-1 z-50">
              <div className="px-3 py-2 border-b-2 border-[#1E293B]/10">
                <p className="font-heading font-black text-xs text-[#1E293B] truncate">{displayName}</p>
                <p className="text-[10px] text-[#64748B] font-mono truncate">{user?.email || "Signed in"}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-heading font-bold text-[#1E293B] hover:bg-[#FFFDF5] rounded-xl"
              >
                <UserIcon className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-heading font-bold text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
