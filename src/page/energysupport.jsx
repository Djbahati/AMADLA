import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Zap, User } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { cn } from '@/utils';

// ─── Amadla knowledge base ───────────────────────────────────────────────────
const AMADLA_KNOWLEDGE = [
  {
    keywords: ['login', 'sign in', 'log in', 'access'],
    answer:
      '**Logging in to Amadla**\n\n1. Go to `/login`\n2. Enter your email and password\n3. Click **Sign In**\n\nDefault accounts:\n- Admin: `admin@amadla.energy` / `Password123!`\n- Operator: `operator@amadla.energy` / `Password123!`\n- User: `customer@amadla.energy` / `Password123!`',
  },
  {
    keywords: ['register', 'sign up', 'create account', 'new account'],
    answer:
      '**Registering a new account**\n\n1. Go to `/register`\n2. Fill in your full name, email, and password\n3. Click **Create Account**\n\nAfter registration you will be logged in automatically and redirected to the dashboard.',
  },
  {
    keywords: ['logout', 'log out', 'sign out'],
    answer:
      '**Logging out**\n\nClick your profile avatar in the top-right navbar and select **Logout**. Your session token will be cleared immediately.',
  },
  {
    keywords: ['dashboard', 'overview', 'home page', 'stats', 'kpi'],
    answer:
      '**Dashboard (`/dashboard`)**\n\nThe dashboard shows:\n- **Stats Grid** — total energy produced, revenue, active users, and open alerts\n- **Energy Charts** — usage trends over time\n- **Team Chat** — real-time team messaging\n- **Notifications Panel** — latest system alerts\n\nAdmin users see full KPI data; Operators and Users see their own project data.',
  },
  {
    keywords: ['project', 'projects', 'create project', 'add project', 'assign'],
    answer:
      '**Managing Projects**\n\n- Navigate to the **Projects** section in the dashboard\n- **Create a project**: click **New Project**, fill in name and details, then save\n- **Assign users**: open a project and use the **Assign User** button\n- Only Admins and Operators can create or assign projects',
  },
  {
    keywords: ['usage', 'energy usage', 'record usage', 'consumption', 'monitor'],
    answer:
      '**Recording Energy Usage**\n\n1. Go to **Usage** in the dashboard\n2. Select the project\n3. Enter the kWh value and date\n4. Click **Save Usage**\n\nUsage data feeds into billing calculations and alert thresholds automatically.',
  },
  {
    keywords: ['billing', 'bill', 'invoice', 'generate bill', 'price'],
    answer:
      '**Billing**\n\n- Bills are generated automatically based on recorded usage × price-per-unit\n- Go to **Billing** in the dashboard to view all invoices\n- Admins can manually trigger bill generation for a project\n- Each bill shows total kWh, unit price, amount due, and payment status',
  },
  {
    keywords: ['payment', 'pay', 'partial payment', 'balance', 'outstanding'],
    answer:
      '**Making Payments**\n\n1. Open a bill in the **Billing** section\n2. Click **Make Payment**\n3. Enter the amount (partial or full)\n4. Confirm — the balance updates instantly\n\nPayment history is tracked per bill with timestamps.',
  },
  {
    keywords: ['alert', 'alerts', 'notification', 'overuse', 'low production', 'payment due'],
    answer:
      '**Alerts & Notifications**\n\nAmadla automatically raises alerts for:\n- 🔴 **Low production** — output drops below threshold\n- 🟡 **Overuse** — consumption exceeds expected limits\n- 🔵 **Payment due** — unpaid bills past due date\n\nView alerts in the **Notifications Panel** on the dashboard. Admins can dismiss or resolve alerts.',
  },
  {
    keywords: ['report', 'export', 'csv', 'pdf', 'download'],
    answer:
      '**Exporting Reports**\n\nAdmin users can export data via the API:\n- `GET /api/reports/csv` — download usage & billing as CSV\n- `GET /api/reports/pdf` — download a formatted PDF report\n\nReports cover energy usage, billing summaries, and payment history.',
  },
  {
    keywords: ['energy systems', 'solar', 'hydro', 'thermal', 'grid', 'visualization'],
    answer:
      '**Energy Systems (`/energy-systems`)**\n\nThis page shows a live visualization of the energy network:\n- **Solar**, **Hydroelectric**, and **Thermal** generation sources\n- Real-time grid voltage, supply vs demand, and grid load %\n- An interactive **Energy Flow Diagram** updates every 3 seconds',
  },
  {
    keywords: ['role', 'roles', 'admin', 'operator', 'user', 'permission', 'access control'],
    answer:
      '**Roles & Permissions**\n\n| Role | Capabilities |\n|---|---|\n| **Admin** | Full access — manage users, projects, billing, reports, alerts |\n| **Operator** | Create/manage projects, record usage, view billing |\n| **User** | View own projects, usage, and bills; make payments |',
  },
  {
    keywords: ['password', 'reset password', 'change password', 'forgot'],
    answer:
      '**Changing your password**\n\nCurrently password reset is done by an Admin. Contact your system administrator to reset your password. The default password for seeded accounts is `Password123!`.',
  },
  {
    keywords: ['setup', 'install', 'run', 'start', 'backend', 'frontend'],
    answer:
      '**Running Amadla locally**\n\n**Backend:**\n```bash\ncd backend\nnpm install\nnpm run prisma:migrate\nnpm run prisma:seed\nnpm run dev\n```\n\n**Frontend:**\n```bash\nnpm install\nnpm run dev\n```\n\nOr run both together: `npm run dev:all`\n\nBackend runs on port **3000**, frontend on **5173**.',
  },
];

const WELCOME = {
  role: 'assistant',
  content:
    "Hi! I'm the **Amadla Energy Assistant**. I can guide you through everything in the platform — login, projects, usage, billing, payments, alerts, reports, and more.\n\nWhat would you like help with?",
};

function getAnswer(query) {
  const q = query.toLowerCase();
  for (const entry of AMADLA_KNOWLEDGE) {
    if (entry.keywords.some((kw) => q.includes(kw))) {
      return entry.answer;
    }
  }
  return "I'm not sure about that specific topic. Here's what I can help with:\n\n- **Login / Register / Logout**\n- **Dashboard & KPIs**\n- **Projects** — create & assign\n- **Energy Usage** — recording & monitoring\n- **Billing** — invoices & generation\n- **Payments** — partial or full\n- **Alerts** — low production, overuse, payment due\n- **Reports** — CSV & PDF export\n- **Energy Systems** — live visualization\n- **Roles** — Admin, Operator, User\n- **Setup** — running the app locally\n\nTry asking about any of these!";
}

// ─── Simple markdown renderer ─────────────────────────────────────────────────
function SimpleMarkdown({ text }) {
  const lines = text.split('\n');
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
          return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('```')) return null;
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <p key={i} className="pl-3">
              • {renderInline(line.slice(2))}
            </p>
          );
        }
        if (/^\d+\./.test(line)) {
          return <p key={i} className="pl-3">{renderInline(line)}</p>;
        }
        if (line.startsWith('|')) {
          return <p key={i} className="font-mono text-xs">{line}</p>;
        }
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-secondary px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5 shrink-0">
          <Bot className="h-4 w-4 text-accent" />
        </div>
      )}
      <div className={cn('max-w-[85%]', isUser && 'flex flex-col items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          isUser ? 'bg-accent text-accent-foreground' : 'bg-secondary border border-border/50'
        )}>
          {isUser
            ? <p className="text-sm leading-relaxed">{message.content}</p>
            : <SimpleMarkdown text={message.content} />
          }
        </div>
      </div>
      {isUser && (
        <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center mt-0.5 shrink-0">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EnergySupport() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: getAnswer(text) }]);
      setThinking(false);
    }, 600);
  };

  const quickActions = [
    'How do I log in?',
    'How does billing work?',
    'What are the user roles?',
    'How do I record energy usage?',
  ];

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
          <p className="text-muted-foreground mt-1">Ask anything about Amadla — actions, features, and how-tos</p>
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
            {messages.map((msg, i) => <Bubble key={i} message={msg} />)}
            {thinking && (
              <div className="flex gap-3 justify-start">
                <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5 shrink-0">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-secondary border border-border/50 rounded-2xl px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickActions.map((q) => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-secondary border border-border/50 hover:border-accent/50 hover:text-accent transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about login, billing, projects, alerts..."
                className="rounded-xl bg-secondary border-0"
                disabled={thinking}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || thinking}
                className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                {thinking
                  ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
