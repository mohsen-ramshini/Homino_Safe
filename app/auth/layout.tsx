export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center overflow-hidden p-6 md:p-10">
      
      {/* اجسام انتزاعی */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-purple-300 rounded-full opacity-30 animate-pulse-slow blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-300 rounded-full opacity-20 animate-spin-slow blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-yellow-200 rounded-full opacity-25 animate-ping-slow blur-2xl"></div>

      {/* فرم اصلی */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col gap-6 transition-transform duration-500 ">
        {children}
      </div>
    </div>
  );
}
