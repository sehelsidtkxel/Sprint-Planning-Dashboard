/**
 * Design system tokens — single source of truth for colors, typography, spacing, etc.
 * CSS variables in globals.css and tailwind.config.ts are derived from these values.
 */

export const colors = {
  primary: {
    DEFAULT: "#161616",
    dark: "#0d0d0d",
    light: "#2a2a2a",
    foreground: "#ffffff",
  },
  surface: {
    DEFAULT: "#f8fafc",
    paper: "#ffffff",
    muted: "#f1f5f9",
    hover: "#f8fafc",
  },
  foreground: {
    DEFAULT: "#0f172a",
    muted: "#64748b",
    subtle: "#94a3b8",
    inverse: "#ffffff",
  },
  border: {
    DEFAULT: "#e2e8f0",
    strong: "#cbd5e1",
  },
  status: {
    success: "#15803d",
    "success-muted": "#dcfce7",
    warning: "#f97316",
    error: "#dc2626",
    info: "#1d4ed8",
    accent: "#7e22ce",
  },
  brand: {
    navy: "#0f172a",
    blue: "#1e3a8a",
    indigo: "#3730a3",
    "blue-light": "#bfdbfe",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: "Arial, Helvetica, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  fontSize: {
    display: "3rem",
    h1: "2.25rem",
    h2: "1.875rem",
    h3: "1.5rem",
    h4: "1.25rem",
    "body-lg": "1.125rem",
    body: "1rem",
    "body-sm": "0.875rem",
    caption: "0.75rem",
    overline: "0.75rem",
  },
  lineHeight: {
    display: "1.1",
    heading: "1.25",
    body: "1.5",
    caption: "1.33",
    overline: "1.33",
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

export const spacing = {
  header: "4.5rem",
  section: "1.5rem",
  card: "1.25rem",
} as const;

export const borderRadius = {
  none: "0",
  control: "4px",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
  md: "0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.05)",
  lg: "0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.05)",
} as const;

/** Convert hex color to space-separated RGB for Tailwind opacity modifiers. */
export function hexToRgbChannels(hex: string): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
