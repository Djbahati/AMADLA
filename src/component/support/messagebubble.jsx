import ReactMarkdown from 'react-markdown';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isLoading = message.role === 'assistant' && !message.content;

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5 shrink-0">
          <div className="h-2 w-2 rounded-full bg-accent" />
        </div>
      )}
      <div className={cn('max-w-[85%]', isUser && 'flex flex-col items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          isUser ? 'bg-accent text-accent-foreground' : 'bg-secondary border border-border/50'
        )}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
