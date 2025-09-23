// app/chat/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Chat } from '@/components/chat/chat';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { GetChatById } from '@/features/ai/api/useGetChatById';
import { notFound } from 'next/navigation';
import { UIMessage } from 'ai';
import { ChatTools, CustomUIDataTypes } from '@/lib/types';
import { LoaderIcon } from "@/components/chat/icons";


export default function ChatPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const { data, isLoading, error } = GetChatById(id);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="animate-spin w-10 h-10 text-blue-500 mb-4 flex items-center justify-center">
        <LoaderIcon size={40} />
      </div>
      <span className="text-lg text-muted-foreground">Loading chat...</span>
    </div>
  );
  if (error || !data) return notFound();
  
  const session = {
    user: {
      id: "bfc28a93-262d-4148-b0b9-560c3d61816f",
      name: "John Doe",
      email: "john@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-07-09T12:34:56.789Z"
  };

  // Ensure 'data' is the chat/session object with required properties
  const chatData = data;

  // Extract messages from chatData, default to empty array if not present
  const messages = Array.isArray(chatData?.messages) ? chatData.messages : [];

  return (
    <>
      <Chat
        id={chatData.session_id}
        initialMessages={chatData}
        initialChatModel={DEFAULT_CHAT_MODEL}
        session={session}
        autoResume={true}
      />
      <DataStreamHandler />
    </>
  );
}
