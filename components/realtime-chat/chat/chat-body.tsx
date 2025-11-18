// import { useChat } from "@/hooks/realtime-chat/use-chat";
import { useSocket } from "@/hooks/realtime-chat/use-socket";
import type { MessageType } from "@/features/chat/types/chat.type";
import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/realtime-chat/use-chat";
import ChatBodyMessage from "./chat-body-message";

interface Props {
  chatId: string | null;
  messages: MessageType[];
  onReply: (message: MessageType) => void;
}

const ChatBody = ({ chatId, messages, onReply }: Props) => {
  const { socket } = useSocket();
  const { addNewMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId || !socket) return;

    const handleNewMessage = (msg: MessageType) => addNewMessage(chatId, msg);

    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, chatId, addNewMessage]);

  useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col px-3 py-2">
{messages.map((message, index) => (
  <ChatBodyMessage
    key={`${message._id || message.event_id}-${index}`}
    message={message}
    onReply={onReply}
  />
))}



      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBody;
