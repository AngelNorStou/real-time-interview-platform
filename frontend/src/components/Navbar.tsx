import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  MessagesSquare,
  MessageSquareText,
} from "lucide-react";
import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <header className="relative bg-[#08162b]/60 backdrop-blur-xl">
      <nav className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 justify-self-start"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
            <MessagesSquare className="h-5 w-5 text-white" />
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
            Interview <span className="text-cyan-400">Platform</span>
          </span>
        </Link>

        {/* Center pill nav (signed in only) */}
        <div className="justify-self-center">
          <Show when="signed-in">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <NavLink href="/" icon={<Home className="h-4 w-4" />}>
                Home
              </NavLink>
              <NavLink
                href="/dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
              >
                Dashboard
              </NavLink>
              <NavLink
                href="/feedback"
                icon={<MessageSquareText className="h-4 w-4" />}
              >
                Feedback
              </NavLink>
            </div>
          </Show>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 justify-self-end">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-cyan-400/40",
                },
              }}
            />
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110"
            >
              Get started
            </Link>
          </Show>
        </div>
      </nav>
    </header>
  );
}