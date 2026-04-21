import { useState, useEffect, useRef } from 'react';
import { client } from '@/api/Client';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { exp } from 'prelude-ls';

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
      const msgs = await client.entities.ChatMessage.list('-created_date', 50);
      setMessages(msgs.reverse());
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const unsub = client.entities.ChatMessage.subscribe((event) => {
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
    await client.entities.ChatMessage.create({
      sender_name: user.full_name || user.email,
      sender_email: user.email,
      content: newMessage.trim(),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <div className="font-semibold text-sm text-gray-700">{msg.sender_name}</div>
            <div className="text-gray-900">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}