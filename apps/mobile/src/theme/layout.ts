export const Layout = {
  homeIndicator: {
    width: 134,
    height: 5,
    containerHeight: 34,
    color: "rgba(255,255,255,0.38)",
    borderRadius: 3,
  },
  tabBar: {
    blurIntensity: 85,
    backgroundColor: "rgba(17,17,39,0.55)",
    bottomOffset: 16,
    horizontalInset: 16,
    /** Space below content so it clears the floating tab bar. */
    reservedBottom: 120,
  },
  minTouchTarget: 44,
  iconButtonSize: 40,
  inputMinHeight: 52,
  buttonMinHeight: {
    sm: 40,
    md: 52,
    lg: 56,
  },
} as const;
