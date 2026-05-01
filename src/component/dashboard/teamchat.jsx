import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { useAuth } from '@/context/AuthContext';

const SEED_MESSAGES = [
  { id: 1, sender: 'System', content: 'Welcome to the Amadla team chat!', time: '09:00' },
  { id: 2, sender: 'Admin', content: 'Grid efficiency is at 97.2% today.', time: '09:15' },
  { id: 3, sender: 'Operator', content: 'Solar output looking strong this morning.', time: '09:22' },
];

export default function TeamChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: user?.fullName || user?.email || 'You',
      content: text,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
    }]);
    setInput('');
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 h-[400px] flex flex-col">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-accent" />
        <h2 className="font-heading font-semibold text-lg">Team Chat</h2>
        <span className="ml-auto flex items-center gap-1 text-xs text-energy-green">
          <span className="w-1.5 h-1.5 rounded-full bg-energy-green inline-block" />
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender === (user?.fullName || user?.email || 'You');
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5 text-accent" />
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMe && <span className="text-xs text-muted-foreground mb-1">{msg.sender}</span>}
                <div className={`rounded-2xl px-3 py-2 text-sm ${
                  isMe ? 'bg-accent text-accent-foreground' : 'bg-secondary border border-border/50'
                }`}>
                  {msg.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-border/50">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="rounded-xl bg-secondary border-0 text-sm"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}
            className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
