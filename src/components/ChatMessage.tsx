
import { FC } from 'react';
import { Message } from '../types/chat';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/card';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <Card className={cn(
      "p-4 mb-4",
      message.role === 'assistant' ? 'bg-secondary' : 'bg-primary/10'
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold mb-2">
            {message.role === 'assistant' ? 'AI' : 'You'}
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};