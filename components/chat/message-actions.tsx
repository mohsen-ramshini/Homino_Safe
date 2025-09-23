import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';

// import type { Vote } from '@/lib/db/schema';

import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from './icons';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/types';

export function PureMessageActions({
  chatId,
  message,
  // vote,
  isLoading,
}: {
  chatId: string;
  message: ChatMessage;
  // vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === 'user') return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                // Adjust this logic based on the actual structure of ChatMessage
                // For example, if ChatMessage has a 'content' property:
                const textToCopy = (message as any).parts
                  ? (message as any).parts
                      .filter((part: any) => part.type === 'text')
                      .map((part: any) => part.text)
                      .join('\n')
                      .trim()
                  : (message as any).content || '';

                if (!textToCopy) {
                  toast.error("There's no text to copy!");
                  return;
                }

                await copyToClipboard(textToCopy);
                toast.success('Copied to clipboard!');
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    // if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
