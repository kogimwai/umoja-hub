import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const QUICK_PROMPTS = [
  { icon: '📝', label: 'Write my job brief', prompt: 'Help me write a professional job brief for a design project. Ask me the key questions first.' },
  { icon: '💼', label: 'Build my portfolio pitch', prompt: 'Help me write a compelling pitch for my creative portfolio. Ask me about my skills and experience.' },
  { icon: '💰', label: 'Set my pricing', prompt: 'Help me figure out the right pricing for my design services in the East African market.' },
  { icon: '🎨', label: 'Describe my artwork', prompt: 'Help me write a great description for my artwork to sell it on the marketplace.' },
  { icon: '📊', label: 'Proposal template', prompt: 'Help me create a professional proposal template for creative projects.' },
  { icon: '🤝', label: 'Contract basics', prompt: 'What should a basic freelance contract include for creative work? Give me a simple checklist.' },
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${isUser ? 'bg-umoja-gold text-umoja-dark' : 'bg-umoja-forest border border-umoja-gold/30 text-umoja-gold'}`}>
        {isUser ? 'U' : '🤖'}
      </div>
      <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'chat-bubble-user font-medium' : 'chat-bubble-ai text-umoja-cream/90'}`}>
        {msg.content}
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Habari! 👋 I'm your Umoja AI Assistant.\n\nI can help you:\n• Write job briefs and proposals\n• Set competitive pricing\n• Create portfolio pitches\n• Describe your artwork\n• Navigate the platform\n\nWhat would you like help with today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        messages: [...messages, userMsg].map(m => ({
          role: m.role,
          content: m.content
        }))
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an issue. Please try again in a moment.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => setMessages([{
    role: 'assistant',
    content: `Habari! 👋 I'm your Umoja AI Assistant.\n\nWhat would you like help with today?`
  }]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="font-display font-700 text-2xl sm:text-3xl flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-umoja-forest border border-umoja-gold/30 flex items-center justify-center text-sm">🤖</span>
            AI Assistant
          </h1>
          <p className="text-umoja-muted text-xs mt-1">Powered by Claude · Built for East African creatives</p>
        </div>
        <button onClick={clearChat} className="text-xs text-umoja-muted hover:text-umoja-cream transition-colors px-3 py-1.5 border border-umoja-gold/15 rounded-lg">
          Clear chat
        </button>
      </div>

      {/* Quick prompts — only show at start */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 flex-shrink-0">
          {QUICK_PROMPTS.map(qp => (
            <button key={qp.label} onClick={() => send(qp.prompt)}
              className="glass rounded-xl p-3 text-left hover:border-umoja-gold/30 transition-all hover:-translate-y-0.5 group">
              <span className="text-lg mb-1 block">{qp.icon}</span>
              <span className="text-xs font-medium text-umoja-cream group-hover:text-umoja-gold transition-colors">{qp.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2 min-h-0">
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}

        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-umoja-forest border border-umoja-gold/30 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-umoja-gold animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-umoja-gold animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-umoja-gold animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="flex-shrink-0 mt-4">
        <div className="glass rounded-2xl p-3 flex items-end gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything about jobs, pricing, proposals..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-umoja-cream placeholder-umoja-muted resize-none focus:outline-none leading-relaxed max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-umoja-gold text-umoja-dark flex items-center justify-center hover:bg-umoja-gold-light transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-umoja-muted mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </main>
  );
}
