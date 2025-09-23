'use client';

import { useEffect, useState } from 'react';
import  ChatHeader  from '@/components/chat/chat-header';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/chat/use-artifact';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChatVisibility } from '@/hooks/chat/use-chat-visibility';
import type { Attachment, ChatMessage } from '@/lib/types';
import { Message } from '@/features/ai/types/chat';
import { useAutoResume } from '@/hooks/chat/use-auto-resume';
import { useChatWebSocket } from '@/features/ai/api/useChatWebSocket';

export interface Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    role?: string;
  };
  expires: string;
}

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  session,
  autoResume,
}: {
  id: string;
  initialMessages: Message;
  initialChatModel: string;
  initialVisibilityType?: VisibilityType;
  isReadonly?: boolean;
  session: Session;
  autoResume: boolean;
}) {
  const router = useRouter();
  const sessionId = id; 
  const { messages, status, sendMessage } = useChatWebSocket(sessionId);
  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });


  const [input, setInput] = useState<string>('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(
    Array.isArray(initialMessages) ? initialMessages : []
  );

  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage(query);
      setHasAppendedQuery(true);
      // تغییر مسیر به مسیر دلخواه با استفاده از useRouter
      // router.replace(`/dashboard/ai/chat/${id}`);
      window.history.replaceState({}, '', `/dashboard/ai/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id, router]);

  // const { data: votes } = useSWR<Array<Vote>>(
  //   messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
  //   fetcher
  // );

  useAutoResume({
    autoResume,
    initialMessages: Array.isArray(initialMessages)
      ? (initialMessages as ChatMessage[])
      : [],
    reload: async () => null, // Provide a no-op async function returning null as needed
    setMessages: (messages) => {
      // If messages is a function, call it with the current localMessages
      if (typeof messages === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setLocalMessages((prev) => messages(prev) as ChatMessage[]);
      } else {
        // Map UIMessage<ChatMessage, UIDataTypes>[] to ChatMessage[]
        setLocalMessages(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          messages.map((msg: any) => ('data' in msg ? msg.data : msg) as ChatMessage)
        );
      }
    },
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          // @ts-expect-error ChatHeader expects props, not an intrinsic element
          chatId={id}
          selectedModelId={initialChatModel}
          selectedVisibilityType={initialVisibilityType}
          isReadonly={isReadonly ?? false}
          session={session}
        />
        <Messages
          chatId={id}
          status={status as 'submitted' | 'streaming' | 'ready' | 'error'}
          messages={localMessages.map((msg: any) =>
            'parts' in msg ? msg : { ...msg, parts: [] }
          )}
          setMessages={(msgs) =>
            setLocalMessages(
              (Array.isArray(msgs)
                ? msgs.map((msg: any) => ('data' in msg ? msg.data : msg))
                : []) as ChatMessage[]
            )
          }
          isReadonly={isReadonly ?? false}
          isArtifactVisible={isArtifactVisible}
          // votes={[]}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
        <MultimodalInput
          chatId={id}
          input={input}
          setInput={setInput}
          status={status as 'submitted' | 'streaming' | 'ready' | 'error'}
          stop={() => {}}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={localMessages.map((msg: any) =>
            'parts' in msg ? msg : { ...msg, parts: [] }
          )}
          setMessages={(msgs) =>
            setLocalMessages(
              (Array.isArray(msgs)
                ? msgs.map((msg: any) => ('data' in msg ? msg.data : msg))
                : []) as ChatMessage[]
            )
          }
          sendMessage={sendMessage}
          selectedVisibilityType={visibilityType}
        />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        status={status as 'submitted' | 'streaming' | 'ready' | 'error'}
        stop={() => {}}
        attachments={attachments}
        setAttachments={setAttachments}
        messages={localMessages}
        setMessages={(messages) => {
          if (typeof messages === 'function') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setLocalMessages((prev) => messages(prev) as ChatMessage[]);
          } else {
            setLocalMessages(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              messages.map((msg: any) => ('data' in msg ? msg.data : msg) as ChatMessage)
            );
          }
        }}
        regenerate={async () => null}
        append={async () => {}} // Provide a no-op or actual append function if needed
        isReadonly={isReadonly ?? false}
        selectedVisibilityType={visibilityType}
      />
    </>
  );
}
