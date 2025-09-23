'use client';

import { Chat } from '@/components/chat/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { useCreateSession } from '@/features/ai/api/useCreateSession';
import { useState, useEffect } from 'react';
import { GetSessions } from '@/features/ai/api/useGetSessions';
import { GetChatById } from '@/features/ai/api/useGetChatById';
import { LoaderIcon } from "@/components/chat/icons";

export default function Page() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const { mutate: createSession } = useCreateSession();
  const { data: Sessions, isLoading: sessionsLoading } = GetSessions();

  const sessionsArray = Sessions?.sessions || [];

  const sortedSessions = sessionsArray.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const lastSession = sortedSessions.at(-1);

  const { data: lastSessionChat, isLoading: chatLoading } = GetChatById(
    lastSession?.session_id || '',
  );

  useEffect(() => {
    if (sessionsLoading || chatLoading || checked) {
      return;
    }

    if (!lastSession) {
      createSession(undefined, {
        onSuccess: (data) => {
          if (data?.session_id) {
            setSessionId(data.session_id);
            setChecked(true);
          }
        },
        onError: () => {},
      });
    } else if (lastSessionChat?.messages?.length === 0) {
      setSessionId(lastSession.session_id);
      setChecked(true);
    } else {
      createSession(undefined, {
        onSuccess: (data) => {
          if (data?.session_id) {
            setSessionId(data.session_id);
            setChecked(true);
          }
        },
        onError: () => {},
      });
    }
  }, [
    sessionsLoading,
    chatLoading,
    lastSession,
    lastSessionChat,
    createSession,
    checked,
  ]);

  const session = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://example.com/avatar.png',
    },
    expires: '2025-07-09T12:34:56.789Z',
  };

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="animate-spin w-10 h-10 text-blue-500 mb-4 flex items-center justify-center">
          <LoaderIcon size={40} />
        </div>
        <span className="text-lg text-muted-foreground">Preparing chat screen...</span>
      </div>
    );
  }

  return (
    <>
    <Chat
      key={sessionId}
      id={sessionId}
      initialMessages={{
        messages: [],
        session_id: sessionId,
        map: function (arg0) { return []; }
      }} // Pass an object matching the Message type
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType="private"
      isReadonly={false}
      session={session}
      autoResume={false}
    />
      <DataStreamHandler />
    </>
  );
}
