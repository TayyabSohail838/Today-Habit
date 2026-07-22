import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ParallaxHero } from "../components/features/landing/ParallaxHero";

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
    a: "Right now everything is stored locally in your browser — nothing is sent to a server. That means it's private, but it also means clearing your browser data will clear your habits.",
  },
  {
    q: "Do the AI insights use a real AI model?",
    a: "Today insights are generated from simple, transparent rules (streaks, completion rate, weekday vs weekend patterns). The service layer is built so a real LLM can be swapped in later without changing the UI.",
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
        className="w-full flex items-center justify-between text-left gap-4"
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
          <img src="/favicon.svg" alt="Habit Tracker logo" className="h-9 w-9 rounded-md shadow-sm" />
          <span className="font-semibold text-lg text-white">Habit Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login"><Button variant="ghost" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Log in</Button></Link>
          <Link to="/register"><Button>Get started</Button></Link>
        </div>
      </header>

      <ParallaxHero />

      <section id="features" className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6 pb-24">
        {["Daily Tracking", "Smart Analytics", "AI Recommendations"].map((f) => (
          <div key={f} className="bg-card/85 backdrop-blur-sm border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold">{f}</h3>
            <p className="text-muted-foreground text-sm mt-2">Coming to life as you build out this section.</p>
          </div>
        ))}
      </section>

      <section id="testimonials" className="border-t border-border bg-muted/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">What people are saying</h2>
            <p className="text-muted-foreground mt-3">A few early users on how it's worked for them.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card/85 backdrop-blur-sm border border-border rounded-xl shadow-sm p-6 flex flex-col">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
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

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-border bg-card/85 backdrop-blur-sm p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Ready to build better habits?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Create your first habit in under a minute — it's free.
          </p>
          <Link to="/register">
            <Button className="mt-6 px-6 py-3 text-base">Start free</Button>
          </Link>
        </div>
      </section>

      <footer className="text-center text-muted-foreground text-sm py-8 border-t border-border">
        © {new Date().getFullYear()} Habit Tracker
      </footer>
    </div>
  );
}
