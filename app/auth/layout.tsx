export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="
      relative min-h-screen
      bg-gradient-to-br
      from-[#f5f2e9]
      via-[#ded9c9]
      to-[#cfc7af]
      flex items-center justify-center
      overflow-hidden
      p-6 md:p-10
    ">
      {/* اجسام انتزاعی گرم */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#e8dcc0] rounded-full opacity-40 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#d6c6a5] rounded-full opacity-30 blur-2xl animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-[#f1e6c8] rounded-full opacity-25 blur-2xl animate-ping-slow" />

      {/* کانتینر فرم */}
      <div className="
        relative w-full max-w-5xl
        bg-white/80
        backdrop-blur-lg
        shadow-2xl
        rounded-3xl
        p-8 md:p-10
        flex flex-col gap-6
      ">
        {children}
      </div>
    </div>
  );
}
