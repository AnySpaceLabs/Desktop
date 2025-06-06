export const monochromePalette = {
  black: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
  white: "#ffffff",
};

// Shadcn theme configuration with strictly black and white colors
export const shadcnTheme = {
  light: {
    background: monochromePalette.white,
    foreground: monochromePalette.black[950],
    card: monochromePalette.white,
    cardForeground: monochromePalette.black[950],
    popover: monochromePalette.white,
    popoverForeground: monochromePalette.black[950],
    primary: monochromePalette.black[950],
    primaryForeground: monochromePalette.white,
    secondary: monochromePalette.black[100],
    secondaryForeground: monochromePalette.black[900],
    muted: monochromePalette.black[100],
    mutedForeground: monochromePalette.black[500],
    accent: monochromePalette.black[100],
    accentForeground: monochromePalette.black[900],
    destructive: monochromePalette.black[900],
    destructiveForeground: monochromePalette.white,
    border: monochromePalette.black[200],
    input: monochromePalette.black[200],
    ring: monochromePalette.black[950],
  },
  dark: {
    background: monochromePalette.black[950],
    foreground: monochromePalette.white,
    card: monochromePalette.black[900],
    cardForeground: monochromePalette.white,
    popover: monochromePalette.black[900],
    popoverForeground: monochromePalette.white,
    primary: monochromePalette.white,
    primaryForeground: monochromePalette.black[950],
    secondary: monochromePalette.black[800],
    secondaryForeground: monochromePalette.white,
    muted: monochromePalette.black[800],
    mutedForeground: monochromePalette.black[400],
    accent: monochromePalette.black[800],
    accentForeground: monochromePalette.white,
    destructive: monochromePalette.white,
    destructiveForeground: monochromePalette.black[950],
    border: monochromePalette.black[800],
    input: monochromePalette.black[800],
    ring: monochromePalette.white,
  },
}; 