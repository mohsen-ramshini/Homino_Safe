'use client';

import { useEffect } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from '@/components/chat/data-stream-provider';

export interface UseAutoResumeParams {
  autoResume: boolean;
  initialMessages: ChatMessage[] | { messages: ChatMessage[]; [key: string]: any };
  reload: UseChatHelpers<ChatMessage>['reload'];
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
}

export function useAutoResume({
  autoResume,
  initialMessages,
  reload,
  setMessages,
}: UseAutoResumeParams) {
  // گرفتن داده‌ها فقط یک بار
  const { dataStream } = useDataStream();

  const messagesArray: ChatMessage[] = Array.isArray(initialMessages)
    ? initialMessages
    : initialMessages.messages ?? [];

  useEffect(() => {
    if (!autoResume) return;

    const mostRecentMessage = messagesArray.at(-1);

    if (mostRecentMessage?.role === 'user') {
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dataStream) return;
    if (dataStream.length === 0) return;

    const dataPart = dataStream[0];

    if (dataPart.type === 'data-appendMessage') {
      const message = JSON.parse(dataPart.data);
      setMessages([...messagesArray, message]);
    }
  }, [dataStream, messagesArray, setMessages]);
}
