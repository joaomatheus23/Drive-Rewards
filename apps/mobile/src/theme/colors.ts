export const Colors = {
  bg: "#0D0D1A",
  surface: "#111127",
  surface2: "#13102A",
  surface3: "#0B1E16",
  purple: "#7C3AED",
  purpleMd: "#A855F7",
  purpleLt: "#C084FC",
  green: "#10B981",
  greenLt: "#34D399",
  amber: "#EAB308",
  amberLt: "#FDE047",
  red: "#EF4444",
  t1: "rgba(255,255,255,1.00)",
  t2: "rgba(255,255,255,0.60)",
  t3: "rgba(255,255,255,0.35)",
  t4: "rgba(255,255,255,0.18)",
  border: "rgba(255,255,255,0.08)",
  borderMd: "rgba(255,255,255,0.14)",
} as const;

export type ColorKey = keyof typeof Colors;
