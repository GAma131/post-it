"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-3 px-7 border-b border-gray-100 shadow-sm bg-white z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/crear"
          className="text-xl font-medium text-gray-800 hover:text-gray-600 transition"
        >
          post-it
        </Link>
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-800 transition"
        >
          posts
        </Link>
      </div>
    </nav>
  );
}
