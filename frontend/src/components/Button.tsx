export default function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-sky-600 font-semibold text-white transition-colors hover:bg-sky-700 active:bg-sky-700 disabled:bg-slate-700 disabled:text-slate-400 ${className}`}
      {...props}
    />
  );
}