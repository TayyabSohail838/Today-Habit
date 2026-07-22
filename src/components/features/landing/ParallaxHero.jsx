import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { getBackground } from "../../../lib/backgrounds";

const STADIUM_IMG = getBackground("stadium").url;

export function ParallaxHero() {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const stadiumX = useTransform(springX, [-1, 1], [-12, 12]);
  const stadiumY = useTransform(springY, [-1, 1], [-8, 8]);
  const spotlightX = useTransform(springX, [-1, 1], ["30%", "70%"]);
  const spotlightY = useTransform(springY, [-1, 1], ["30%", "70%"]);

  const onMouseMove = (e) => {
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
      className="relative h-[90vh] min-h-[620px] w-full overflow-hidden bg-neutral-950"
    >
      {/* Football on grass, stadium/floodlights blurred behind — the "real" scene */}
      <motion.img
        src={STADIUM_IMG}
        alt="Football on grass with stadium floodlights blurred behind"
        style={{ x: stadiumX, y: stadiumY }}
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />

      {/* Floodlight glow accents */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/20 rounded-full blur-[100px]" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/15 rounded-full blur-[100px]" />

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([sx, sy]) => `radial-gradient(520px circle at ${sx} ${sy}, rgba(255,255,255,0.10), transparent 65%)`
          ),
        }}
      />

      {/* Scrim: gradient from clear (top, so stadium reads fully) to dark (bottom, for text) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/85" />

      {/* Fade the very bottom into the page background so the hero blends
          into the next section instead of cutting off abruptly */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white"
        >
          Build habits that actually stick.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/80 mt-4 text-lg max-w-xl"
        >
          AI-powered insights, streaks, and analytics to keep you consistent — every day, every habit.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/register">
            <Button className="mt-8 px-6 py-3 text-base">Start free</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
