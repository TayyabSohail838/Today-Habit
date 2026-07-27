import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { getBackground } from "../../../lib/backgrounds";

const STADIUM_IMG = getBackground("stadium").url;

const features = [
  {
    title: "Daily Tracking",
    desc: "Seamless check-ins and habit streaks to keep you consistent every day.",
  },
  {
    title: "Smart Analytics",
    desc: "Deep insights into your completion patterns and weekend trends.",
  },
  {
    title: "AI Recommendations",
    desc: "Personalised guidance powered by Google Gemini based on your actual data.",
  },
];

export function ParallaxHero() {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 25 });

  // Parallax offsets (Background moves opposite direction of cards for depth)
  const stadiumX = useTransform(springX, [-1, 1], [-20, 20]);
  const stadiumY = useTransform(springY, [-1, 1], [-14, 14]);
  const cardsX = useTransform(springX, [-1, 1], [10, -10]);
  const cardsY = useTransform(springY, [-1, 1], [8, -8]);

  const spotlightX = useTransform(springX, [-1, 1], ["25%", "75%"]);
  const spotlightY = useTransform(springY, [-1, 1], ["25%", "75%"]);

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 2);
    mouseY.set(y * 2);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="relative min-h-[92vh] w-full bg-transparent flex flex-col justify-between pt-28 pb-12"
    >
      {/* Stadium background — mask-image dissolves the sharp photo to fully
          transparent at the bottom so AppBackground blurs in with no hard line */}
      <motion.img
        src={STADIUM_IMG}
        alt="Stadium background"
        style={{
          x: stadiumX,
          y: stadiumY,
          maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
        className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
      />

      {/* Floodlight glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Interactive cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([sx, sy]) => `radial-gradient(650px circle at ${sx} ${sy}, rgba(255,255,255,0.12), transparent 70%)`
          ),
        }}
      />

      {/* Top scrim only: darkens top half for navbar + text legibility,
          fades to transparent so the mask dissolve is unobstructed */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* Hero Header Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-8 pb-4 flex-1 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md"
        >
          Build habits that actually stick.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/85 mt-5 text-lg sm:text-xl max-w-2xl font-normal drop-shadow"
        >
          AI-powered insights, streaks, and analytics to keep you consistent — every day, every habit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/register">
            <Button className="mt-8 px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-emerald-500/25">
              Start free
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 3 Feature Boxes — merged into hero scene with no circle logos */}
      <motion.div
        style={{ x: cardsX, y: cardsY }}
        className="relative z-20 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6 mt-12 w-full pb-8"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ default: { duration: 0.35, delay: i * 0.05, ease: "easeOut" } }}
            whileHover={{
              scale: 1.05,
              y: -8,
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            className="group bg-card/80 dark:bg-neutral-900/80 backdrop-blur-md border border-border dark:border-white/15 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 cursor-pointer"
          >
            <h3 className="font-bold text-lg text-foreground dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-150">
              {f.title}
            </h3>
            <p className="text-muted-foreground dark:text-white/70 text-sm mt-2 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

