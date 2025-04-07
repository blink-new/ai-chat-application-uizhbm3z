
import { useState } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatState } from './types/chat';
import { openai } from './lib/openai';
import { ScrollArea } from './components/ui/scroll-area';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const handleSubmit = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      let streamedContent = '';
      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [...state.messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        streamedContent += content;
        
        setState(prev => ({
          ...prev,
          messages: [
            ...prev.messages.slice(0, -1),
            userMessage,
            { role: 'assistant', content: streamedContent }
          ],
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to get response. Please try again.',
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <ScrollArea className="flex-1 pr-4">
        {state.messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {state.error && (
          <div className="text-red-500 mb-4">{state.error}</div>
        )}
      </ScrollArea>
      <div className="pt-4">
        <ChatInput
          onSubmit={handleSubmit}
          disabled={state.isLoading}
        />
      </div>
    </div>
  );
}

export default App;