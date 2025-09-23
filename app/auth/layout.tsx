  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-full h-full flex flex-col md:flex-row justify-center items-center bg-[#2574b7]">
        <div className="w-full md:w-1/2 h-full">
          {children}
        </div>
        <div className="hidden md:flex w-1/2 h-screen justify-center items-center">
          <div
            className="w-[95%] h-[95%] bg-cover bg-center rounded-lg shadow-2xl"
            style={{ backgroundImage: 'url("/assets/images/background.png")' }}
          >
          </div>
        </div>
      </div>
    );
  }
