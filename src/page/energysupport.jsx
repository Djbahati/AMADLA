import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/API/Client';
import { motion } from 'framer-motion';
import { Send, Zap, Bot } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input'; // corrected incomplete import
import { ScrollArea } from '@/component/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/component/ui/avatar';
import MessageBubble from '@/component/support/messagebubble';

export default function EnergySupport() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function init() {
      const conv = await base44.agents.createConversation({
        agent_name: 'energy_support',
        metadata: { name: 'Energy Support Chat' },
      });
      setConversation(conv);
      setMessages(conv.messages || []);
    }
    init();
  }, []);

  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-accent" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-bold">Energy Support</h1>
          <p className="text-muted-foreground mt-1">Ask anything about our energy solutions and services</p>
        </motion.div>

        <div className="bg-card rounded-2xl border border-border/50 flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center">
              <Bot className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="font-heading font-semibold text-sm">Amadla Energy Assistant</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-energy-green inline-block" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !conversation && (
              <div className="flex items-center justify-center h-full">
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our energy solutions..."
                className="rounded-xl bg-secondary border-0"
                disabled={!conversation || sending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || !conversation || sending}
                className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

