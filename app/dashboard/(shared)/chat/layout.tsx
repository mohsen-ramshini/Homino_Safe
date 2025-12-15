"use client";

import ChatList from "@/components/realtime-chat/chat/chat-list";
import useChatId from "@/hooks/realtime-chat/use-chat-id";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chatId = useChatId();

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-72 border-r border-border shrink-0 bg-red-600">
        <ChatList />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Chat content */}
            {children}
      </div>
    </div>
  );
}
