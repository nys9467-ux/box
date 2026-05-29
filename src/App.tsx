/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DailyBoxOfficeItem, BoxOfficeAPIResponse } from "./types";
import ThemeToggle from "./components/ThemeToggle";
import SkeletonList from "./components/SkeletonList";
import BoxOfficeList, { formatNumber } from "./components/BoxOfficeList";
import MovieDetailsModal from "./components/MovieDetailsModal";
import { Film, Calendar, AlertTriangle, RefreshCw, Trophy, Users, Monitor, Sparkles, ChevronRight, Github } from "lucide-react";

// Get yesterday's date string as "YYYY-MM-DD"
function getYesterdayDateString(): string {
  const date = new Date("2026-05-29T02:08:48Z"); // Use reference date/time or current Date
  try {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch (e) {
    return "2026-05-28";
  }
}

export default function App() {
  const yesterdayStr = getYesterdayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(yesterdayStr);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [movies, setMovies] = useState<DailyBoxOfficeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);
  const [selectedMovieRank, setSelectedMovieRank] = useState<string>("1");
  const [selectedMovieNm, setSelectedMovieNm] = useState<string>("");

  // Sync state to classList on <html> for potential global styles/tailwind class variations
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const fetchBoxOffice = async (dateYmd: string) => {
    setLoading(true);
    setError(null);
    try {
      // Remove '-' from 'YYYY-MM-DD' to get 'YYYYMMDD'
      const formattedDate = dateYmd.replace(/-/g, "");
      const response = await fetch(`/api/boxoffice?date=${formattedDate}`);
      
      if (!response.ok) {
        throw new Error(`서버에 요쳥을 실패했습니다. 상태 코드: ${response.status}`);
      }

      const data: BoxOfficeAPIResponse = await response.json();
      
      if (data.boxOfficeResult?.dailyBoxOfficeList) {
        setMovies(data.boxOfficeResult.dailyBoxOfficeList);
      } else if (data.error) {
        setError(data.error);
        setMovies([]);
      } else {
        setError("영화 데이터를 찾을 수 없습니다.");
        setMovies([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "데이터 수신 도중 오류가 발생했습니다.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxOffice(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSelectMovie = (movieCd: string) => {
    const movie = movies.find((m) => m.movieCd === movieCd);
    if (movie) {
      setSelectedMovieCd(movieCd);
      setSelectedMovieRank(movie.rank);
      setSelectedMovieNm(movie.movieNm);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovieCd(null);
  };

  // Quick helper: total audience summing for top 10 movies listed
  const totalAudienceOfRanked = movies.reduce((acc, current) => acc + parseInt(current.audiCnt || "0", 10), 0);
  const topMovie = movies.find((m) => m.rank === "1");

  return (
    <div
      id="app-theme-root"
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
        color: isDark ? "#f8fafc" : "#0f172a",
      }}
    >
      {/* High Density Top Header Card Banner Grid */}
      <header
        className="sticky top-0 z-40 px-4 md:px-8 py-3.5 border-b backdrop-blur-md flex items-center justify-between"
        style={{
          borderBottomColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-md sm:text-lg font-black tracking-tighter uppercase leading-none">
              KOBIS <span className="text-yellow-500">Boxoffice</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
              Dashboard
            </span>
          </div>
        </div>

        {/* Desktop & Mobile inline controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black mb-0.5">
              조회 날짜 선택
            </span>
            <div className="relative">
              <input
                id="search-date-picker"
                type="date"
                value={selectedDate}
                max={yesterdayStr}
                onChange={handleDateChange}
                className="bg-slate-800/80 text-white dark:bg-slate-800/85 dark:text-white border border-slate-600 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer min-w-[125px] transition-all"
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.9)",
                  color: isDark ? "#ffffff" : "#0f172a",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(15, 23, 42, 0.15)",
                }}
              />
            </div>
          </div>

          {/* Theme switcher */}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      </header>

      {/* Main Container Dashboard UI */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        
        {/* Real-time Insights / Statistics Panel (Density Specific Element) */}
        {!loading && !error && movies.length > 0 && (
          <div
            id="summary-kpi-panel"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border"
            style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.25)" : "rgba(255, 255, 255, 0.5)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.05)",
            }}
          >
            {/* KPI 1: Top Listed Movie */}
            {topMovie && (
              <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-500/5 transition-all">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500">당일 박스오피스 주요작</span>
                  <span className="text-sm font-bold truncate pr-2">{topMovie.movieNm}</span>
                </div>
              </div>
            )}

            {/* KPI 2: Overall Ranked Attendance */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-500/5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center border border-blue-500/10">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500">TOP 10 총 관객수</span>
                <span className="text-sm font-bold font-mono">
                  {formatNumber(String(totalAudienceOfRanked))}명
                </span>
              </div>
            </div>

            {/* KPI 3: Search Metadata Date indicator */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-500/5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center border border-emerald-500/10">
                <Calendar className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500">조회 기준 날짜</span>
                <span className="text-sm font-bold font-mono">
                  {selectedDate.replace(/-/g, ".")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Data List Component container */}
        <section
          id="main-list-section"
          className="flex-1 rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col transition-all"
          style={{
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.4)" : "#ffffff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)",
          }}
        >
          {loading ? (
            <SkeletonList />
          ) : error ? (
            /* Error Fallback view */
            <div
              id="error-notification"
              className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-md font-bold text-red-500">조회에 실패했습니다</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {error}
                </p>
              </div>
              <button
                id="retry-fetch-btn"
                onClick={() => fetchBoxOffice(selectedDate)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer border border-white/5 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                다시 시도하기
              </button>
            </div>
          ) : (
            /* Box Office Lists representation */
            <BoxOfficeList items={movies} onSelectMovie={handleSelectMovie} />
          )}
        </section>
      </main>

      {/* Persistent Information Footer */}
      <footer
         className="mt-auto px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 uppercase tracking-widest gap-2"
         style={{
           borderTopColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
           backgroundColor: isDark ? "rgba(15, 23, 42, 0.5)" : "#f8fafc",
         }}
      >
        <div>KOBIS Open API Integration — 2026</div>
        <div className="flex items-center gap-1">
          <span>Data Refreshed:</span>
          <span className="font-mono text-slate-400 font-bold">
            {selectedDate}
          </span>
        </div>
      </footer>

      {/* Modal Popup overlay */}
      {selectedMovieCd && (
        <MovieDetailsModal
          movieCd={selectedMovieCd}
          movieNm={selectedMovieNm}
          rank={selectedMovieRank}
          onClose={handleCloseModal}
          isDark={isDark}
        />
      )}
    </div>
  );
}
