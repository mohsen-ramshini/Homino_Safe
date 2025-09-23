"use client";

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-zinc-900 transition-colors duration-300">
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
