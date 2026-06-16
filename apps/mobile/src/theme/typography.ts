import { Colors } from "./colors";

export const Typography = {
  display: {
    fontSize: 34,
    fontWeight: "900" as const,
    letterSpacing: -1.2,
    color: Colors.t1,
  },
  heading1: {
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
    color: Colors.t1,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
    color: Colors.t1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    color: Colors.t1,
  },
  body: {
    fontSize: 15,
    fontWeight: "500" as const,
    letterSpacing: -0.1,
    color: Colors.t2,
  },
  caption: {
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 0,
    color: Colors.t3,
  },
  label: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 0.08,
    textTransform: "uppercase" as const,
    color: Colors.t3,
  },
} as const;
