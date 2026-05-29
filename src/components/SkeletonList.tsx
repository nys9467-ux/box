/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export default function SkeletonList() {
  return (
    <div id="skeleton-list" className="space-y-4 animate-pulse">
      {/* Table Headers placeholder */}
      <div className="hidden md:flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28"></div>
      </div>

      {/* List items placeholder */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-xl space-y-3 md:space-y-0"
        >
          {/* Rank & Title indicator */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex-shrink-0 animate-pulse"></div>
            <div className="flex flex-col gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40 md:w-64"></div>
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
            </div>
          </div>

          {/* Quick stats placeholders */}
          <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
