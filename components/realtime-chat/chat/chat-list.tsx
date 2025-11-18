// "use client";

// import { useEffect, useState } from "react";
// import { useChat } from "@/hooks/realtime-chat/use-chat";
// import { Spinner } from "../ui/spinner";
// import ChatListItem from "./chat-list-item";
// import { useAuth } from "@/hooks/realtime-chat/use-auth";
// import ChatListHeader from "./chat-list-header";
// import { useSocket } from "@/hooks/realtime-chat/use-socket";
// import type { ChatType, MessageType } from "@/features/chat/types/chat.type";
// import { useRouter } from "next/navigation";

// const ChatList = () => {
//   const router = useRouter();
//   const { socket } = useSocket();
//   const {
//     fetchChats,
//     chats,
//     isChatsLoading,
//     addNewChat,
//     updateChatLastMessage,
//   } = useChat();
//   const { user } = useAuth();
//   const currentUserId = user?._id || null;

//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredChats =
//     chats?.filter(
//       (chat) =>
//         chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         chat.participants?.some(
//           (p: { _id: any; name: string; }) =>
//             p._id !== currentUserId &&
//             p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     ) || [];

//   // 📦 Fetch chats on mount
//   useEffect(() => {
//     fetchChats();
//   }, [fetchChats]);

//   // 🆕 Listen for new chats
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewChat = (newChat: ChatType) => {
//       console.log("Received new chat", newChat);
//       addNewChat(newChat);
//     };

//     socket.on("chat:new", handleNewChat);
//     return () => {
//       socket.off("chat:new", handleNewChat);
//     };
//   }, [addNewChat, socket]);

//   // 🔄 Listen for chat updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleChatUpdate = (data: {
//       chatId: string;
//       lastMessage: MessageType;
//     }) => {
//       console.log("Received update on chat", data.lastMessage);
//       updateChatLastMessage(data.chatId, data.lastMessage);
//     };

//     socket.on("chat:update", handleChatUpdate);
//     return () => {
//       socket.off("chat:update", handleChatUpdate);
//     };
//   }, [socket, updateChatLastMessage]);

//   const onRoute = (id: string) => {
//     router.push(`/chat/${id}`);
//   };

//   return (
//     <div
//       className=" pb-20 lg:pb-0 lg:max-w-[379px] lg:block border-r border-border bg-sidebar max-w-[calc(100%-40px)] w-full left-10 z-[98]"
//     >
//       <div className="flex-col">
//         <ChatListHeader onSearch={setSearchQuery} />

//         <div className="flex-1 h-[calc(100vh-100px)] overflow-y-auto">
//           <div className="px-2 pb-10 pt-1 space-y-1">
//             {isChatsLoading ? (
//               <div className="flex items-center justify-center">
//                 <Spinner className="w-7 h-7" />
//               </div>
//             ) : filteredChats?.length === 0 ? (
//               <div className="flex items-center justify-center">
//                 {searchQuery ? "No chat found" : "No chats created"}
//               </div>
//             ) : (
//               filteredChats?.map((chat) => (
//                 <ChatListItem
//                   key={chat._id}
//                   chat={chat}
//                   currentUserId={currentUserId}
//                   onClick={() => onRoute(chat._id)}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatList;

import { useEffect, useState } from "react";
import { useChat } from "@/hooks/realtime-chat/use-chat";
import { useMatrixRooms } from "@/features/chat/api/use-get-user-room";
import { Spinner } from "../ui/spinner";
import ChatListItem from "./chat-list-item";
import { useAuth } from "@/hooks/realtime-chat/use-auth";
import ChatListHeader from "./chat-list-header";
import { useSocket } from "@/hooks/realtime-chat/use-socket";
import { useRouter } from "next/navigation";

const ChatList = () => {
  const router = useRouter();
  const { socket } = useSocket();
  const { fetchChats, chats, isChatsLoading, addNewChat } = useChat();
  const { rooms, loading: isMatrixLoading, error: matrixError } = useMatrixRooms();
  const { user } = useAuth();
  const currentUserId = user?._id || null;

  const [searchQuery, setSearchQuery] = useState("");

  // ترکیب چت‌های داخلی و ماتریکس
  const combinedChats = [...chats];
  rooms.forEach((room) => {
    if (!combinedChats.find((c) => c._id === room.roomId)) {
      combinedChats.push({
        _id: room.roomId,
        groupName: room.name || "No name",
        participants: [], // یا اگر می‌خوای می‌تونی participant اضافه کنی
        lastMessage: room.lastEvent || null,
        isGroup: false,
        avatar:"",
        createdBy: "",
        createdAt: "",
        updatedAt: ""
      });
    }
  });

  const filteredChats = combinedChats.filter(
    (chat) =>
      chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const onRoute = (id: string) => {
    router.push(`/dashboard/chat/${id}`);
  };

  if (matrixError) console.error("Matrix rooms error:", matrixError);

  return (
    <div className="pb-20 lg:pb-0 lg:max-w-[379px] lg:block border-r border-border bg-sidebar max-w-[calc(100%-40px)] w-full left-10 z-[98]">
      <div className="flex-col">
        <ChatListHeader onSearch={setSearchQuery} />
        <div className="flex-1 h-[calc(100vh-100px)] overflow-y-auto">
          <div className="px-2 pb-10 pt-1 space-y-1">
            {isChatsLoading || isMatrixLoading ? (
              <div className="flex items-center justify-center">
                <Spinner className="w-7 h-7" />
              </div>
            ) : filteredChats?.length === 0 ? (
              <div className="flex items-center justify-center">
                {searchQuery ? "No chat found" : "No chats created"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  currentUserId={currentUserId}
                  onClick={() => onRoute(chat._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
