import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-gray-100">
        <div className="flex items-center gap-3">
          <svg
            className="w-7 h-7 text-cyan-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-lg font-semibold text-cyan-300">
            Interview Platform
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-cyan-200 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-cyan-200 hover:text-white transition-colors duration-200"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>

          <Show when="signed-out">
            <SignInButton>
              <button className="text-cyan-200 hover:text-white transition-colors duration-200">
                Sign In
              </button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  );
}