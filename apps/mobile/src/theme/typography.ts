import { Colors } from "./colors";
import { FontFamily } from "./fonts";

export const Typography = {
  display: {
    fontFamily: FontFamily.black,
    fontSize: 34,
    fontWeight: "900" as const,
    letterSpacing: -1.2,
    color: Colors.t1,
  },
  heading1: {
    fontFamily: FontFamily.extraBold,
    fontSize: 28,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
    color: Colors.t1,
  },
  heading2: {
    fontFamily: FontFamily.extraBold,
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
    color: Colors.t1,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    color: Colors.t1,
  },
  body: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    fontWeight: "500" as const,
    letterSpacing: -0.1,
    color: Colors.t2,
  },
  caption: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 0,
    color: Colors.t3,
  },
  label: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 0.08,
    textTransform: "uppercase" as const,
    color: Colors.t3,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;
