import { PreviewMessage } from './message';
import TypingIndicator from '../TypingIndicator';
import { Greeting } from './greeting';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import type { UseChatHelpers } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/chat/use-messages';
import type { ChatMessages } from '@/lib/types';
import { useDataStream } from './data-stream-provider';

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers<ChatMessages>['status'];
  messages: ChatMessages[];
  setMessages: UseChatHelpers<ChatMessages>['setMessages'];
  isReadonly: boolean;
  isArtifactVisible: boolean;
}

function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  isReadonly,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({ chatId, status });

  useDataStream();

  const hasMessages = Array.isArray(messages) && messages.length > 0;

  const typingMessage = messages.find((msg) => msg.type === 'typing');
  const normalMessages = messages.filter((msg) => msg.type !== 'typing');

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
    >
      {!hasMessages && (
        <>
          {console.log('🧪 No messages to render:', messages)}
          <Greeting />
        </>
      )}

      {normalMessages.map((message, index) => {
        const key = message.id || `${message.role || 'msg'}-${index}`;
        return (
          <PreviewMessage
            key={key}
            chatId={chatId}
            message={message}
            isLoading={
              status === 'streaming' && normalMessages.length - 1 === index
            }
            setMessages={setMessages}
            isReadonly={isReadonly}
            requiresScrollPadding={
              hasSentMessage && index === normalMessages.length - 1
            }
          />
        );
      })}

      {/* ✅ Typing indicator بدون آیکون */}
      {typingMessage && (
        <motion.div
          key="typing-indicator"
          className="w-full mx-auto max-w-3xl px-4 group/message"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          data-role="assistant"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 text-muted-foreground bg-muted/40 rounded-xl px-4 py-3 max-w-fit">
              <TypingIndicator />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  return true;
});
