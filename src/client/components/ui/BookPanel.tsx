'use client';

import { useEffect, useRef } from 'react';

import { BOOKS } from '@/client/data/bookInfo';
import { useSceneStore } from '@/client/store/sceneStore';

// BookPanel — bottom detail strip for books, mirroring MoviePanel layout.
// Text-only (no cover image), shows title + author + description.

export function BookPanel() {
  const { selectedBook, setSelectedBook, focused } = useSceneStore();
  const lastIdxRef = useRef(selectedBook);

  useEffect(() => {
    if (selectedBook !== null) lastIdxRef.current = selectedBook;
  }, [selectedBook]);

  useEffect(() => {
    if (focused === null) setSelectedBook(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const idx = selectedBook ?? lastIdxRef.current;
  const book = idx !== null ? BOOKS[idx] : null;
  const visible = selectedBook !== null && book !== null;

  return (
    <div
      className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-[640px] max-w-[calc(100vw-80px)] transition-opacity duration-500 ease-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {book && (
        <div className="relative flex gap-5 px-6 py-5 border-t border-b border-amber-400/15 backdrop-blur-md bg-deep/40">
          <button
            type="button"
            onClick={() => setSelectedBook(null)}
            className="absolute top-2 right-3 text-stardust/40 hover:text-stardust/85 text-xl leading-none transition-colors duration-300"
            aria-label="Close"
          >
            ×
          </button>

          {/* Miniature book cover matching Library card style */}
          <div className="flex-shrink-0 w-[78px] h-[110px] flex border border-amber-400/20 overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.08)]">
            <div
              className="w-[5px] flex-shrink-0"
              style={{ backgroundColor: book.kind === 'fiction' ? '#8b6914' : '#1e4660' }}
            />
            <div
              className="flex-1 flex flex-col justify-between p-2"
              style={{ backgroundColor: book.kind === 'fiction' ? '#1a1410' : '#0d1117' }}
            >
              <span className="text-stardust/20 text-[6px] tracking-cosmic uppercase">
                {book.kind === 'fiction' ? 'Fiction' : 'Non-Fiction'}
              </span>
              <div
                className="text-stardust/90 text-[9px] tracking-wider2 font-light leading-tight text-center line-clamp-3"
                style={{ textShadow: book.kind === 'fiction' ? '0 1px 3px rgba(251,191,36,0.15)' : '0 1px 3px rgba(56,189,248,0.12)' }}
              >
                {book.titleZh}
              </div>
              <span className="text-stardust/30 text-[7px] tabular-nums tracking-wider2 text-right">
                {book.year}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <a
              href={`https://search.douban.com/book/subject_search?search_text=${encodeURIComponent(
                book.titleZh
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-baseline gap-2 text-stardust/95 hover:text-stardust transition-colors duration-300"
              title="在豆瓣搜索"
            >
              <span className="text-2xl tracking-wider2 font-light leading-tight border-b border-transparent group-hover:border-stardust/40 transition-colors duration-300">
                {book.titleZh}
              </span>
              <span className="text-stardust/30 group-hover:text-stardust/75 text-sm transition-colors duration-300">
                ↗
              </span>
            </a>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-stardust/45">
              <span className="tracking-cosmic uppercase">{book.titleEn}</span>
              <span className="text-stardust/25">·</span>
              <span className="tabular-nums tracking-wider2">{book.year}</span>
              <span className="text-stardust/25">·</span>
              <span className="tracking-wider2">{book.author}</span>
            </div>

            <div className="mt-3 h-px w-full bg-stardust/15" />

            <p className="mt-3 text-stardust/75 text-[12px] leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
