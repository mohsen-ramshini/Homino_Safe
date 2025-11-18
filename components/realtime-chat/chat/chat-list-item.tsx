"use client";

import { cn } from "@/lib/utils";
import type { ChatType } from "@/features/chat/types/chat.type";
import AvatarWithBadge from "../avatar-with-badge";
import { usePathname } from "next/navigation";

// Helper کوچک برای Matrix rooms
const getMatrixRoomName = (chat: ChatType, currentUserId: string | null) => {
  if (chat.groupName) return chat.groupName;
  if (chat.participants?.length === 1) return chat.participants[0].name;
  return "Unnamed Room";
};

interface PropsType {
  chat: ChatType;
  currentUserId: string | null;
  onClick?: () => void;
}

const ChatListItem = ({ chat, currentUserId, onClick }: PropsType) => {
  const pathname = usePathname();
  const lastMessage = chat.lastMessage || null;
  const createdAt = chat.createdAt || new Date().toISOString();

  // اسم و وضعیت
  const name = getMatrixRoomName(chat, currentUserId);
  const isGroup = chat.participants && chat.participants.length > 1;
  const isOnline = chat.participants?.some(p => p._id !== currentUserId && p.isOnline) || false;

const getLastMessageText = () => {
  if (!lastMessage) {
    return isGroup ? "Group created" : "Send a message";
  }

  if (lastMessage.image) return "📷 Photo";

  // اگر lastMessage.content یک آبجکت باشه
  if (typeof lastMessage.content === "object") {
    // معمولاً text در فیلد "body" هست
    return lastMessage.content.body || "[Unsupported message]";
  }

  if (isGroup && lastMessage.sender) {
    const senderName = lastMessage.sender?._id === currentUserId ? "You" : lastMessage.sender?.name;
    const text = typeof lastMessage.content === "string" ? lastMessage.content : lastMessage.content.body || "[Unsupported message]";
    return `${senderName}: ${text}`;
  }

  return typeof lastMessage.content === "string" ? lastMessage.content : lastMessage.content.body || "[Unsupported message]";
};


  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 p-2 rounded-sm hover:bg-sidebar-accent transition-colors text-left",
        pathname?.includes(chat._id) && "!bg-sidebar-accent"
      )}
    >
      <AvatarWithBadge
        name={name}
        src={chat.avatar || ""}
        isGroup={isGroup}
        isOnline={isOnline}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h5 className="text-sm font-semibold truncate">{name}</h5>
          <span className="text-xs ml-2 shrink-0 text-muted-foreground">
            {new Date(lastMessage?.updatedAt || createdAt).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-xs truncate text-muted-foreground -mt-px">
          {getLastMessageText()}
        </p>
      </div>
    </button>
  );
};

export default ChatListItem;
