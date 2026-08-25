"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALL_HADITHS, HADITH_BOOKS, HADITH_TOPICS } from "@/lib/hadith-data";

export default function HadithSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filterBook, setFilterBook] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterAuth, setFilterAuth] = useState<string>("all");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_HADITHS.filter((h) => {
      const matchesQuery =
        h.translation.toLowerCase().includes(q) ||
        h.arabic.includes(query) ||
        h.narrator.toLowerCase().includes(q) ||
        h.chapter.toLowerCase().includes(q) ||
        h.bookName.toLowerCase().includes(q);
      const matchesBook = filterBook === "all" || h.book === filterBook;
      const matchesTopic = filterTopic === "all" || h.topics.includes(filterTopic);
      const matchesAuth = filterAuth === "all" || h.authenticity === filterAuth;
      return matchesQuery && matchesBook && matchesTopic && matchesAuth;
    });
  }, [query, filterBook, filterTopic, filterAuth]);

  const hasFilters = filterBook !== "all" || filterTopic !== "all" || filterAuth !== "all";

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/hadiths" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Search Hadiths</h1>
          <p className="text-gray-400 text-sm">Search across all hadith collections</p>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search hadiths by text, narrator, topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition text-lg"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <span className="text-xs text-gray-600 py-1.5 shrink-0">Book:</span>
        <button onClick={() => setFilterBook("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${filterBook === "all" ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}>All</button>
        {HADITH_BOOKS.map((book) => (
          <button key={book.id} onClick={() => setFilterBook(book.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${filterBook === book.id ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}>{book.name}</button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <span className="text-xs text-gray-600 py-1.5 shrink-0">Topic:</span>
        <button onClick={() => setFilterTopic("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${filterTopic === "all" ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}>All</button>
        {HADITH_TOPICS.map((topic) => (
          <button key={topic.id} onClick={() => setFilterTopic(topic.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${filterTopic === topic.id ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}>{topic.name}</button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-gray-600 py-1.5">Authenticity:</span>
        {["all", "Sahih", "Hasan", "Da'if"].map((a) => (
          <button key={a} onClick={() => setFilterAuth(a)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterAuth === a ? "bg-emerald-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"}`}>
            {a === "all" ? "All" : a}
          </button>
        ))}
        {hasFilters && (
          <button onClick={() => { setFilterBook("all"); setFilterTopic("all"); setFilterAuth("all"); }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
            Clear Filters
          </button>
        )}
      </div>

      {query && (
        <p className="text-gray-500 text-sm">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
      )}

      <div className="space-y-3">
        {results.map((hadith) => (
          <Link key={hadith.id} href={`/hadiths/hadith/${hadith.id}`} className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">{hadith.bookName} &middot; {hadith.chapter} &middot; #{hadith.hadithNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                hadith.authenticity === "Sahih" ? "bg-emerald-500/10 text-emerald-400" :
                hadith.authenticity === "Hasan" ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"
              }`}>{hadith.authenticity}</span>
            </div>
            <p className="text-right text-xl leading-relaxed text-emerald-400/60 mb-3 line-clamp-3" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}>
              {hadith.arabic}
            </p>
            <p className="text-sm text-gray-300 line-clamp-2 mb-2">{hadith.translation}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{hadith.narrator}</span>
              <div className="flex gap-1">
                {hadith.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{topic}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {query && results.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">No results found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">Search Hadith Collections</p>
          <p className="text-gray-500 text-sm">Search by Arabic text, translation, narrator, or topic</p>
        </div>
      )}
    </div>
  );
}
