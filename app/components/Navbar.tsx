"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-3 px-7 border-b border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-md bg-white dark:bg-gray-800 transition-colors z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-medium text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          post-it
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/posts"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
          >
            posts
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
