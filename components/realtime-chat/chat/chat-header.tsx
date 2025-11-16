"use client";

import { getOtherUserAndGroup } from "@/lib/realtime-chat/helper";
import type { ChatType } from "@/features/chat/types/chat.type";
import { ArrowLeft } from "lucide-react";
import AvatarWithBadge from "../avatar-with-badge";
import { useRouter } from "next/navigation";

interface Props {
  chat: ChatType;
  currentUserId: string | null;
}

const ChatHeader = ({ chat, currentUserId }: Props) => {
  const router = useRouter();

  const { name, subheading, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId
  );

  return (
    <div
      className="sticky top-0 flex items-center gap-5 border-b border-border bg-card px-2 z-50"
    >
      <div className="h-14 px-4 flex items-center">
        {/* دکمه بازگشت برای موبایل */}
        <ArrowLeft
          className="w-5 h-5 inline-block lg:hidden text-muted-foreground cursor-pointer mr-2"
          onClick={() => router.push("/chat")}
        />

        <AvatarWithBadge
          name={name}
          src={avatar}
          isGroup={isGroup}
          isOnline={isOnline}
        />

        <div className="ml-2">
          <h5 className="font-semibold">{name}</h5>
          <p
            className={`text-sm ${
              isOnline ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {subheading}
          </p>
        </div>
      </div>

      {/* برچسب Chat در بالای صفحه */}
      <div className="flex-1 text-center py-4 h-full border-b-2 border-primary font-medium text-primary">
        Chat
      </div>
    </div>
  );
};

export default ChatHeader;
