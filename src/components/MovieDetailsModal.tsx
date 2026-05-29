/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { MovieInfo, MovieInfoAPIResponse } from "../types";
import { X, Film, Clock, Globe, Award, ShieldAlert, Users, Building, HelpCircle } from "lucide-react";

interface MovieDetailsModalProps {
  movieCd: string;
  movieNm: string;
  rank: string;
  onClose: () => void;
  isDark: boolean;
}

export default function MovieDetailsModal({
  movieCd,
  movieNm,
  rank,
  onClose,
  isDark,
}: MovieDetailsModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [movieInfo, setMovieInfo] = useState<MovieInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    async function fetchDetails() {
      try {
        const res = await fetch(`/api/movie?movieCd=${movieCd}`);
        if (!res.ok) {
          throw new Error("영화 상세 정보를 가져올 수 없습니다.");
        }
        const data: MovieInfoAPIResponse = await res.json();
        if (active) {
          if (data.movieInfoResult?.movieInfo) {
            setMovieInfo(data.movieInfoResult.movieInfo);
          } else if (data.error) {
            setError(data.error);
          } else {
            setError("영화 상세 정보가 비어있습니다.");
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "서버 통신 오류가 발생했습니다.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      active = false;
      document.body.style.overflow = "";
    };
  }, [movieCd]);

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="movie-details-modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in transition-all duration-300"
    >
      <div
        id="movie-details-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-705 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 dark:bg-slate-900 dark:border-slate-700/60 light:bg-white light:border-slate-200 light:text-slate-900"
        style={{
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.12)",
          color: isDark ? "#f8fafc" : "#0f172a",
        }}
      >
        {/* Close Button Top Right */}
        <button
          id="close-modal-x-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-white transition-colors cursor-pointer border border-white/10 hover:scale-105"
          aria-label="상세 정보 닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          /* Loading Skeleton in Modal */
          <div className="p-8 flex flex-col items-center justify-center min-h-[350px] space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
              <Film className="w-5 h-5 text-yellow-500 absolute animate-pulse" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-yellow-500 animate-pulse uppercase">
              세부 정보 로딩 중...
            </p>
          </div>
        ) : error ? (
          /* Error State in Modal */
          <div className="p-8 flex flex-col items-center justify-center min-h-[350px] text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-red-500">정보를 불러올 수 없습니다</h4>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-sm">
                {error}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        ) : movieInfo ? (
          /* Successful Content rendering in High Density theme style */
          <>
            {/* Top Header Card Banner Grid */}
            <div
              className="relative p-6 md:p-8 flex flex-col justify-end min-h-[160px] md:min-h-[190px] border-b"
              style={{
                background: isDark
                  ? "linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.85) 75%, #0f172a), rgba(30, 41, 59, 0.85)"
                  : "linear-gradient(to bottom, rgba(248, 250, 252, 0.5), rgba(248, 250, 252, 0.9) 75%, #ffffff), rgba(241, 245, 249, 0.9)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.08)",
              }}
            >
              {/* Badge Row */}
              <div className="flex flex-wrap gap-2 mb-3 items-center">
                <span className="text-xs font-black bg-yellow-500 text-slate-950 px-2.5 py-0.5 rounded-md tracking-wider">
                  RANK {rank}
                </span>

                {movieInfo.typeNm && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.04)",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)",
                      color: isDark ? "#cbd5e1" : "#475569",
                    }}
                  >
                    {movieInfo.typeNm}
                  </span>
                )}

                {movieInfo.audits?.[0]?.watchGradeNm && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: movieInfo.audits[0].watchGradeNm.includes("청소년")
                        ? "rgba(239, 68, 68, 0.1)"
                        : movieInfo.audits[0].watchGradeNm.includes("15")
                        ? "rgba(249, 115, 22, 0.1)"
                        : "rgba(16, 185, 129, 0.1)",
                      borderColor: movieInfo.audits[0].watchGradeNm.includes("청소년")
                        ? "rgba(239, 68, 68, 0.2)"
                        : movieInfo.audits[0].watchGradeNm.includes("15")
                        ? "rgba(249, 115, 22, 0.2)"
                        : "rgba(16, 185, 129, 0.2)",
                      color: movieInfo.audits[0].watchGradeNm.includes("청소년")
                        ? "#ef4444"
                        : movieInfo.audits[0].watchGradeNm.includes("15")
                        ? "#f97316"
                        : "#10b981",
                    }}
                  >
                    {movieInfo.audits[0].watchGradeNm}
                  </span>
                )}
              </div>

              {/* Title & Eng Title */}
              <h2
                id="modal-movie-title"
                className="text-2xl md:text-3xl font-black tracking-tight leading-snug drop-shadow-xs"
                style={{ color: isDark ? "#ffffff" : "#0f172a" }}
              >
                {movieInfo.movieNm}
              </h2>
              {movieInfo.movieNmEn && (
                <p className="text-xs md:text-sm mt-0.5 italic truncate font-mono opacity-60">
                  {movieInfo.movieNmEn}
                  {movieInfo.movieNmOg ? ` (${movieInfo.movieNmOg})` : ""}
                </p>
              )}
            </div>

            {/* Middle Quick Stats Rows (Density specific) */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 border-b divide-x text-center text-xs"
              style={{
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
                divideColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
              }}
            >
              <div className="py-3 flex flex-col justify-center items-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">개봉일</span>
                <span className="font-semibold font-mono">{movieInfo.openDt || "-"}</span>
              </div>
              <div className="py-3 flex flex-col justify-center items-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">상영 시간</span>
                <span className="font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {movieInfo.showTm ? `${movieInfo.showTm}분` : "-"}
                </span>
              </div>
              <div className="py-3 flex flex-col justify-center items-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">국가</span>
                <span className="font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {movieInfo.nations?.[0]?.nationNm || "-"}
                </span>
              </div>
              <div className="py-3 flex flex-col justify-center items-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">장르</span>
                <span className="font-semibold text-ellipsis overflow-hidden max-w-full px-2 truncate">
                  {movieInfo.genres?.map((g) => g.genreNm).join(", ") || "-"}
                </span>
              </div>
            </div>

            {/* Long Info Columns Custom Scrollable area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6">
              {/* Core Credits (Directors & Actors) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-extrabold text-yellow-500 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 mb-3"
                    style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)" }}>
                    <Award className="w-3.5 h-3.5" />
                    감독 (Directors)
                  </h4>
                  {movieInfo.directors && movieInfo.directors.length > 0 ? (
                    <div className="space-y-2">
                      {movieInfo.directors.map((dir, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-sm font-bold">{dir.peopleNm}</span>
                          {dir.peopleNmEn && (
                            <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">
                              {dir.peopleNmEn}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">등록된 감독 정보가 없습니다.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-yellow-500 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 mb-3"
                    style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)" }}>
                    <Users className="w-3.5 h-3.5" />
                    출연 배우 ({movieInfo.actors?.length || 0})
                  </h4>
                  {movieInfo.actors && movieInfo.actors.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                      {movieInfo.actors.slice(0, 15).map((actor, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-slate-800 dark:border-slate-800/80 light:border-slate-100">
                          <div>
                            <span className="font-bold text-[13px]">{actor.peopleNm}</span>
                            {actor.peopleNmEn && (
                              <span className="hidden sm:inline ml-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
                                {actor.peopleNmEn}
                              </span>
                            )}
                          </div>
                          {actor.cast ? (
                            <span className="text-[11px] font-mono font-medium bg-slate-800 dark:bg-slate-800/80 light:bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-sm truncate max-w-[130px]"
                              style={{
                                color: isDark ? "#94a3b8" : "#475569",
                              }}>
                              {actor.cast} 역
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">조연/단역</span>
                          )}
                        </div>
                      ))}
                      {movieInfo.actors.length > 15 && (
                        <p className="text-[10px] text-slate-500 text-center italic pt-1">
                          등 {movieInfo.actors.length - 15}명의 배우가 더 있습니다.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">등록된 배우 정보가 없습니다.</p>
                  )}
                </div>
              </div>

              {/* Companies and Production details */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-yellow-500 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5"
                  style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)" }}>
                  <Building className="w-3.5 h-3.5" />
                  참여 영화사 (Companies)
                </h4>
                {movieInfo.companys && movieInfo.companys.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {movieInfo.companys.map((company, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col p-2 rounded-lg border"
                        style={{
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.02)",
                          borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)",
                        }}
                      >
                        <span className="font-bold text-slate-200 dark:text-slate-100 light:text-slate-805">
                          {company.companyNm}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          역할: {company.companyPartNm || "알 수 없음"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">등록된 제작사/배급사 정보가 없습니다.</p>
                )}
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div
              className="p-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between text-xs"
              style={{
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
                backgroundColor: isDark ? "#0b1220" : "#f8fafc",
              }}
            >
              <div className="flex gap-4 text-slate-500 font-mono text-[11px]">
                <span>CD: {movieCd}</span>
                {movieInfo.statusNm && <span>상태: {movieInfo.statusNm}</span>}
              </div>

              <button
                id="close-modal-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl transition-colors tracking-widest cursor-pointer shadow-lg hover:shadow-yellow-500/10 hover:scale-[1.02]"
              >
                상세 닫기 (CLOSE)
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            데이터 수신 중 오류가 생겼습니다.
          </div>
        )}
      </div>
    </div>
  );
}
