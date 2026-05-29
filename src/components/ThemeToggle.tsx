/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      onClick={onToggle}
      className="relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xs hover:shadow-md cursor-pointer group hover:scale-105"
      aria-label="화면 모드 변경"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <div
          className={`absolute transform transition-transform duration-500 ease-spring ${
            isDark ? "translate-y-8 rotate-45 opacity-0" : "translate-y-0 rotate-0 opacity-100"
          }`}
        >
          <Sun className="w-5 h-5 text-amber-500 fill-amber-100 dark:fill-none" />
        </div>

        {/* Moon Icon */}
        <div
          className={`absolute transform transition-transform duration-500 ease-spring ${
            isDark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-8 -rotate-45 opacity-0"
          }`}
        >
          <Moon className="w-5 h-5 text-indigo-400 fill-indigo-900/20" />
        </div>
      </div>
    </button>
  );
}
