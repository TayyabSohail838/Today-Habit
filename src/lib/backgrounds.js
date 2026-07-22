// Central registry of themed background photos. Each habit can pick one
// manually (stored as habit.background, an id from this list). The
// Landing hero and the sitewide ambient background both default to
// "stadium" when nothing more specific applies.
//
// These are hotlinked Unsplash photos for prototyping — swap for
// licensed / self-hosted assets before shipping to production, and
// double check each URL actually resolves in your browser first.

export const BACKGROUNDS = [
  {
    id: "stadium",
    label: "Football Close-up (Stadium blurred)",
    category: "Fitness",
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "gym",
    label: "Dumbbells / Weight Plates",
    category: "Fitness",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "running",
    label: "Running Track",
    category: "Fitness",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "gaming",
    label: "Controller Close-up",
    category: "Gaming",
    url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "reading",
    label: "Books",
    category: "Reading",
    url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "coding",
    label: "Developer Desk",
    category: "Coding",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "meditation",
    label: "Mountains / Calm",
    category: "Meditation",
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "sleep",
    label: "Sleep / Rest",
    category: "Health",
    url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1600&q=75",
  },
  {
    id: "none",
    label: "No background",
    category: "General",
    url: null,
  },
];

export function getBackground(id) {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}
