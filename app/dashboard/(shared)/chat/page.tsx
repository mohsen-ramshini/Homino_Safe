"use client";

import { useState } from "react";
import ChatList from "@/components/realtime-chat/chat/chat-list";
import EmptyState from "@/components/realtime-chat/empty-state";
import useChatId from "@/hooks/realtime-chat/use-chat-id";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const chatId = useChatId();

  return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {!chatId ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState />
            </div>
          ) : (
            <div className="flex-1">
              {/* پیام‌ها یا محتوای چت واقعی اینجا */}
            </div>
          )}
        </div>
  );
}
