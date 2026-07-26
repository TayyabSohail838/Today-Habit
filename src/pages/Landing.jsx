import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ParallaxHero } from "../components/features/landing/ParallaxHero";
import { AssistantWidget } from "../components/features/assistant/AssistantWidget";

const testimonials = [
  {
    name: "Amara Okafor",
    role: "Product Designer",
    quote: "The daily check-ins finally made habit tracking feel effortless instead of like homework.",
  },
  {
    name: "Daniyar Suleimenov",
    role: "Software Engineer",
    quote: "Seeing my streaks and the weekend-pattern insight actually changed how I plan my week.",
  },
  {
    name: "Priya Nair",
    role: "Grad Student",
    quote: "Simple, fast, and it doesn't try to do a hundred things. Exactly what I needed.",
  },
];

const faqs = [
  {
    q: "Is my data stored anywhere else?",
    a: "Your habits and logs are stored securely in Supabase (a hosted Postgres database). They sync across all your devices and are tied to your account — not just one browser.",
  },
  {
    q: "Do the AI insights use a real AI model?",
    a: "Yes — the chat assistant is powered by Google Gemini and has access to your real streak data, completion rates, and today's progress. Ask it anything about your habits.",
  },
  {
    q: "Can I track more than one habit at a time?",
    a: "Yes — there's no limit. Use the + button to add as many as you like, and archive the ones you're not actively working on.",
  },
  {
    q: "Is there a mobile app?",
    a: "Not yet — this is a responsive web app, so it works well in a mobile browser, but there's no native app right now.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
      >
        <span className="font-medium text-foreground">{item.q}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <p className="text-muted-foreground text-sm mt-3">{item.a}</p>}
    </div>
  );
}

export function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Inline SVG logo — works regardless of vite base path */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-9 w-9 rounded-xl shadow-lg" aria-label="Habit Tracker logo">
            <defs>
              <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="logoAccent" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f9fafb" />
                <stop offset="100%" stopColor="#d1fae5" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#logoBg)" />
            <rect x="13" y="14" width="38" height="36" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <path d="M22 22h20" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 30h16" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 38h12" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="38" r="9" fill="url(#logoAccent)" opacity="0.95" />
            <path d="M40 38l3 3 6-7" fill="none" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-semibold text-lg text-white">Habit Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login"><Button variant="ghost" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Log in</Button></Link>
          <Link to="/register"><Button>Get started</Button></Link>
        </div>
      </header>

      {/* Merged Parallax Hero with integrated 3 Feature Cards & smooth multi-stop dissolve gradient */}
      <ParallaxHero />

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-transparent py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">What people are saying</h2>
            <p className="text-muted-foreground mt-3">A few early users on how it's worked for them.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                whileHover={{ scale: 1.04, y: -5 }}
                className="bg-card/85 backdrop-blur-sm border border-border rounded-2xl shadow-sm hover:shadow-xl p-6 flex flex-col transition-all duration-300 cursor-pointer"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground flex-1">"{t.quote}"</p>
                <div className="mt-4">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight text-center mb-10">
          Frequently asked questions
        </h2>
        <div>
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          whileHover={{ scale: 1.02, y: -3 }}
          className="rounded-2xl border border-border bg-card/85 backdrop-blur-sm p-10 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Ready to build better habits?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Create your first habit in under a minute — it's free.
          </p>
          <Link to="/register">
            <Button className="mt-6 px-6 py-3 text-base">Start free</Button>
          </Link>
        </motion.div>
      </section>

      <footer className="text-center text-muted-foreground text-sm py-8 border-t border-border">
        © {new Date().getFullYear()} Habit Tracker
      </footer>

      {/* Floating AI Chat Assistant Widget on Landing Page */}
      <AssistantWidget bottomClass="bottom-6 right-6" />
    </div>
  );
}
