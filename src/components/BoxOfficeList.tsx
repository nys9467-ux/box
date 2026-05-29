/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DailyBoxOfficeItem } from "../types";
import { Film, Users, Calendar, TrendingUp, TrendingDown, Minus, ArrowUpRight, Sparkles } from "lucide-react";

export interface GroupedBoxOffice {
  date: string;
  items: DailyBoxOfficeItem[];
}

interface BoxOfficeListProps {
  groupedItems: GroupedBoxOffice[];
  onSelectMovie: (movieCd: string) => void;
}

// Format numbers with commas (e.g., 1234567 -> 1,234,567)
export function formatNumber(numStr: string): string {
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;
  return num.toLocaleString();
}

// Convert "YYYY-MM-DD" to Korean readable format
export function formatKoreanDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  } catch (e) {
    return dateStr;
  }
}

export default function BoxOfficeList({ groupedItems, onSelectMovie }: BoxOfficeListProps) {
  const hasData = groupedItems.some((group) => group.items.length > 0);

  if (!hasData) {
    return (
      <div 
        id="empty-state" 
        className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-3"
      >
        <Film className="w-12 h-12 text-gray-400 dark:text-gray-600 animate-bounce" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">데이터가 없습니다</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          조회 가능한 박스오피스 정보가 존재하지 않습니다. 다른 날짜를 선택해보세요.
        </p>
      </div>
    );
  }

  return (
    <div id="box-office-list-wrapper" className="space-y-8">
      {groupedItems.map((group) => {
        if (group.items.length === 0) return null;

        return (
          <div key={group.date} className="space-y-3">
            {/* Group Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60 dark:border-gray-800/80">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm md:text-md font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                {formatKoreanDate(group.date)} 박스오피스 순위
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-150 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
                {group.items.length}개 영화
              </span>
            </div>

            {/* Table Headers for Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              <div className="col-span-1 text-center">순위</div>
              <div className="col-span-5">영화 정보</div>
              <div className="col-span-2 text-right">당일 관객수</div>
              <div className="col-span-2 text-right">누적 관객수</div>
              <div className="col-span-2 text-center">매출 점유율</div>
            </div>

            {/* Box Office Item Rows */}
            <div className="space-y-2.5">
              {group.items.map((movie) => {
                const isNew = movie.rankOldAndNew === "NEW";
                const rankChange = parseInt(movie.rankInten, 10);
                
                return (
                  <div
                    id={`movie-item-${movie.movieCd}`}
                    key={`${group.date}-${movie.movieCd}`}
                    onClick={() => onSelectMovie(movie.movieCd)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 md:px-6 md:py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-2xl shadow-xs hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md cursor-pointer transition-all duration-300 group hover:-translate-y-[1px]"
                  >
                    {/* Rank column */}
                    <div className="col-span-1 flex items-center md:justify-center gap-3">
                      <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-850/80">
                        <span className={`text-base md:text-lg font-black tracking-tight ${
                          movie.rank === "1" 
                            ? "text-yellow-500 dark:text-yellow-400" 
                            : movie.rank === "2"
                            ? "text-slate-400 dark:text-slate-300"
                            : movie.rank === "3"
                            ? "text-amber-600 dark:text-amber-500"
                            : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {movie.rank}
                        </span>
                        
                        {/* Crown/Sticker for Top 3 */}
                        {parseInt(movie.rank, 10) <= 3 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-[9px] text-white px-1 py-0.5 rounded-full font-bold scale-90">
                            TOP
                          </span>
                        )}
                      </div>

                      {/* Rank Change display inside Rank column for mobile */}
                      <div className="md:hidden flex items-center font-bold">
                        {isNew ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/35">
                            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                            NEW
                          </span>
                        ) : rankChange > 0 ? (
                          <span className="inline-flex items-center text-xs font-semibold text-rose-500 gap-0.5 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-md">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {rankChange}
                          </span>
                        ) : rankChange < 0 ? (
                          <span className="inline-flex items-center text-xs font-semibold text-blue-500 gap-0.5 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded-md">
                            <TrendingDown className="w-3.5 h-3.5" />
                            {Math.abs(rankChange)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-gray-400 gap-0.5 bg-gray-50 dark:bg-gray-800/40 px-1.5 py-0.5 rounded-md">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Movie Info column */}
                    <div className="col-span-1 md:col-span-5 flex flex-col min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base md:text-md font-bold text-gray-850 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-150 truncate leading-snug">
                          {movie.movieNm}
                        </h4>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 flex-shrink-0" />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-400 dark:text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          {movie.openDt ? `${movie.openDt} 개봉` : "개봉정보 없음"}
                        </span>
                        
                        <span className="hidden md:inline text-gray-200 dark:text-gray-800">•</span>
                        
                        <span className="font-mono text-[11px] bg-slate-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800/80 px-1.5 py-0.5 rounded-md text-gray-500 dark:text-gray-400">
                          CD: {movie.movieCd}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Rank Change indicator */}
                    <div className="hidden md:flex col-span-1 items-center justify-center">
                      {isNew ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          NEW
                        </span>
                      ) : rankChange > 0 ? (
                        <span className="inline-flex items-center text-xs font-semibold text-rose-500 gap-0.5 bg-rose-50/80 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-950/40 px-2 py-1 rounded-lg shadow-xs">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {rankChange}
                        </span>
                      ) : rankChange < 0 ? (
                        <span className="inline-flex items-center text-xs font-semibold text-blue-500 gap-0.5 bg-blue-50/80 dark:bg-blue-950/25 border border-blue-100/50 dark:border-blue-950/40 px-2 py-1 rounded-lg shadow-xs">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {Math.abs(rankChange)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-gray-400 gap-0.5 bg-gray-50 dark:bg-gray-800/40 border border-gray-100/40 dark:border-gray-800/40 px-2 py-1 rounded-lg shadow-xs">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Day Audience column */}
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center text-sm">
                      <span className="md:hidden text-xs text-gray-400 dark:text-gray-500">당일 관객</span>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-gray-755 dark:text-gray-200">
                          {formatNumber(movie.audiCnt)}명
                        </span>
                        <span className={`text-[10px] font-medium ${
                          parseInt(movie.audiInten, 10) >= 0 
                            ? "text-rose-500 dark:text-rose-400" 
                            : "text-blue-500 dark:text-blue-400"
                        }`}>
                          {parseInt(movie.audiInten, 10) >= 0 ? "+" : ""}
                          {formatNumber(movie.audiInten)}명
                        </span>
                      </div>
                    </div>

                    {/* Acc Audience column */}
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center text-sm">
                      <span className="md:hidden text-xs text-gray-400 dark:text-gray-500">누적 관객</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-200 bg-slate-50 dark:bg-gray-900 md:bg-transparent dark:md:bg-transparent px-2.5 py-1 md:p-0 rounded-lg border border-slate-100 dark:border-gray-800 md:border-none">
                        {formatNumber(movie.audiAcc)}명
                      </span>
                    </div>

                    {/* Sales Share column */}
                    <div className="col-span-1 md:col-span-2 flex flex-col md:items-center justify-center">
                      <div className="flex items-center justify-between md:justify-center w-full mb-1">
                        <span className="md:hidden text-xs text-gray-400 dark:text-gray-500">매출 점유율</span>
                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                          {movie.salesShare}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${parseFloat(movie.salesShare)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
