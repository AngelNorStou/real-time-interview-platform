import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Users,
  Video,
  Zap,
} from "lucide-react";

const features = [
  { icon: CalendarDays, title: "Easy Scheduling", text: "Book interviews in minutes" },
  { icon: Video, title: "Video Interviews", text: "Meet candidates securely" },
  { icon: BarChart3, title: "Actionable Feedback", text: "Make data-driven decisions" },
];

function GlassCard({
  icon: Icon,
  title,
  text,
  className = "",
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 pr-6 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="max-w-[170px] text-sm leading-snug text-white/70">{text}</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="relative -mx-3 -my-6 min-h-[calc(100vh-73px)] overflow-hidden bg-[#08162b] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-700/20 blur-3xl" />

{/* Photo (right side, desktop only) */}
<div className="absolute inset-y-0 right-0 hidden w-[60%] overflow-hidden lg:block">
  <Image
    src="/interview.jpg"
    alt="Two people in an interview"
    fill
    priority
    sizes="60vw"
    className="object-cover object-center"
  />
  {/* blue tint */}
  <div className="absolute inset-0 bg-[#0b3a6e]/50 mix-blend-multiply" />
  {/* fade into background on the left */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(to right, #08162b 0%, rgba(8,22,43,0.55) 18%, rgba(8,22,43,0) 45%)",
    }}
  />
  {/* fade into background at the bottom */}
  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08162b] to-transparent" />

        {/* Floating cards */}
        <GlassCard
          icon={Video}
          title="Live Interviews"
          text="High-quality, secure video conversations."
          className="left-[8%] top-[18%]"
        />
        <GlassCard
          icon={Users}
          title="Structured Feedback"
          text="Capture and compare feedback easily."
          className="right-[4%] top-[25%]"
        />
        <GlassCard
          icon={BarChart3}
          title="Hire with Confidence"
          text="Turn insights into better decisions."
          className="bottom-[12%] right-[10%]"
        />
      </div>

      {/* Left content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-[640px] py-20 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/90">
            <Zap className="h-4 w-4 fill-cyan-400 text-cyan-400" />
            Smarter Interviews. Better Hires.
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Turn conversations into{" "}
            <span className="text-cyan-400">opportunities.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
            Schedule interviews, meet candidates over video, and capture
            structured feedback — all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={userId ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110"
            >
              {userId ? "Go to dashboard" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {/* Feature row */}
          <ul id="features" className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/20">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-white/60">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}