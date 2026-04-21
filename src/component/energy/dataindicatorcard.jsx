import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TeamChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const msgs = await base44.entities.ChatMessage.list('-created_date', 50);
      setMessages(msgs.reverse());
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const unsub = base44.entities.ChatMessage.subscribe((event) => {
      if (event.type === 'create') {
        setMessages(prev => [...prev, event.data]);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setNewMessage('');
    await base44.entities.ChatMessage.create({
      sender_name: user.full_name || user.email,
      sender_email: user.email,
      content: newMessage.trim(),
      channel: 'general',
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 flex flex-col h-[400px]">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-accent" />
        <h3 className="font-heading font-semibold">Team Chat</h3>
        <span className="text-xs text-muted-foreground ml-auto">#general</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_email === user?.email;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${isMe ? 'order-2' : ''}`}>
                  {!isMe && (
                    <span className="text-xs text-muted-foreground mb-1 block">{msg.sender_name}</span>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm ${
                    isMe ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-border/50">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="rounded-xl bg-secondary border-0"
          />
          <Button type="submit" size="icon" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}