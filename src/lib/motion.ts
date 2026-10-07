export const motionDurations = {
  micro: 0.18,
  component: 0.38,
  story: 0.7,
  ambient: 12,
} as const;

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const spring = {
  responsive: { stiffness: 210, damping: 24, mass: 0.55 },
  gentle: { stiffness: 90, damping: 20, mass: 0.8 },
} as const;

export const revealVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: motionDurations.story, ease: motionEase } },
};
