import type { Config } from "tailwindcss";
import {
  borderRadius,
  colors,
  hexToRgbChannels,
  shadows,
  spacing,
  typography,
} from "./tokens";

function rgbVar(name: string) {
  return `rgb(var(--ds-${name}) / <alpha-value>)`;
}

function fontSizeWithVars(
  sizeVar: string,
  lineHeightVar: string,
  letterSpacingVar?: string
) {
  const config: [string, { lineHeight: string; letterSpacing?: string }] = [
    `var(--ds-font-size-${sizeVar})`,
    { lineHeight: `var(--ds-line-height-${lineHeightVar})` },
  ];
  if (letterSpacingVar) {
    config[1].letterSpacing = `var(--ds-letter-spacing-${letterSpacingVar})`;
  }
  return config;
}

export const designSystemTheme: NonNullable<Config["theme"]>["extend"] = {
  colors: {
    background: rgbVar("color-surface"),
    foreground: rgbVar("color-foreground"),
    primary: {
      DEFAULT: rgbVar("color-primary"),
      dark: rgbVar("color-primary-dark"),
      light: rgbVar("color-primary-light"),
      foreground: rgbVar("color-primary-foreground"),
    },
    surface: {
      DEFAULT: rgbVar("color-surface"),
      paper: rgbVar("color-surface-paper"),
      muted: rgbVar("color-surface-muted"),
      hover: rgbVar("color-surface-hover"),
    },
    muted: {
      DEFAULT: rgbVar("color-foreground-muted"),
      foreground: rgbVar("color-foreground-muted"),
      subtle: rgbVar("color-foreground-subtle"),
    },
    border: {
      DEFAULT: rgbVar("color-border"),
      strong: rgbVar("color-border-strong"),
    },
    status: {
      success: rgbVar("color-status-success"),
      "success-muted": rgbVar("color-status-success-muted"),
      warning: rgbVar("color-status-warning"),
      error: rgbVar("color-status-error"),
      info: rgbVar("color-status-info"),
      accent: rgbVar("color-status-accent"),
    },
    brand: {
      navy: rgbVar("color-brand-navy"),
      blue: rgbVar("color-brand-blue"),
      indigo: rgbVar("color-brand-indigo"),
      "blue-light": rgbVar("color-brand-blue-light"),
    },
  },
  fontFamily: {
    sans: ["var(--ds-font-family-sans)"],
    mono: ["var(--ds-font-family-mono)"],
  },
  fontWeight: {
    regular: typography.fontWeight.regular,
    medium: typography.fontWeight.medium,
    semibold: typography.fontWeight.semibold,
    bold: typography.fontWeight.bold,
  },
  fontSize: {
    display: fontSizeWithVars("display", "display", "tight"),
    h1: fontSizeWithVars("h1", "heading", "tight"),
    h2: fontSizeWithVars("h2", "heading", "tight"),
    h3: fontSizeWithVars("h3", "heading"),
    h4: fontSizeWithVars("h4", "heading"),
    "body-lg": fontSizeWithVars("body-lg", "body"),
    body: fontSizeWithVars("body", "body"),
    "body-sm": fontSizeWithVars("body-sm", "body"),
    caption: fontSizeWithVars("caption", "caption"),
    overline: fontSizeWithVars("overline", "overline", "widest"),
  },
  letterSpacing: {
    tight: typography.letterSpacing.tight,
    normal: typography.letterSpacing.normal,
    wide: typography.letterSpacing.wide,
    wider: typography.letterSpacing.wider,
    widest: typography.letterSpacing.widest,
  },
  borderRadius: {
    none: borderRadius.none,
    sm: borderRadius.sm,
    md: borderRadius.md,
    lg: borderRadius.lg,
    full: borderRadius.full,
  },
  boxShadow: {
    "ds-sm": shadows.sm,
    "ds-md": shadows.md,
    "ds-lg": shadows.lg,
  },
  spacing: {
    header: spacing.header,
    section: spacing.section,
    card: spacing.card,
  },
  height: {
    header: spacing.header,
  },
  minHeight: {
    header: spacing.header,
  },
};

/** CSS custom property declarations for :root — keep in sync with tokens.ts */
export function getCssVariableDeclarations(): Record<string, string> {
  return {
    "--ds-color-primary": hexToRgbChannels(colors.primary.DEFAULT),
    "--ds-color-primary-dark": hexToRgbChannels(colors.primary.dark),
    "--ds-color-primary-light": hexToRgbChannels(colors.primary.light),
    "--ds-color-primary-foreground": hexToRgbChannels(colors.primary.foreground),
    "--ds-color-surface": hexToRgbChannels(colors.surface.DEFAULT),
    "--ds-color-surface-paper": hexToRgbChannels(colors.surface.paper),
    "--ds-color-surface-muted": hexToRgbChannels(colors.surface.muted),
    "--ds-color-surface-hover": hexToRgbChannels(colors.surface.hover),
    "--ds-color-foreground": hexToRgbChannels(colors.foreground.DEFAULT),
    "--ds-color-foreground-muted": hexToRgbChannels(colors.foreground.muted),
    "--ds-color-foreground-subtle": hexToRgbChannels(colors.foreground.subtle),
    "--ds-color-foreground-inverse": hexToRgbChannels(colors.foreground.inverse),
    "--ds-color-border": hexToRgbChannels(colors.border.DEFAULT),
    "--ds-color-border-strong": hexToRgbChannels(colors.border.strong),
    "--ds-color-status-success": hexToRgbChannels(colors.status.success),
    "--ds-color-status-success-muted": hexToRgbChannels(colors.status["success-muted"]),
    "--ds-color-status-warning": hexToRgbChannels(colors.status.warning),
    "--ds-color-status-error": hexToRgbChannels(colors.status.error),
    "--ds-color-status-info": hexToRgbChannels(colors.status.info),
    "--ds-color-status-accent": hexToRgbChannels(colors.status.accent),
    "--ds-color-brand-navy": hexToRgbChannels(colors.brand.navy),
    "--ds-color-brand-blue": hexToRgbChannels(colors.brand.blue),
    "--ds-color-brand-indigo": hexToRgbChannels(colors.brand.indigo),
    "--ds-color-brand-blue-light": hexToRgbChannels(colors.brand["blue-light"]),
    "--ds-font-family-sans": typography.fontFamily.sans,
    "--ds-font-family-mono": typography.fontFamily.mono,
    "--ds-font-size-display": typography.fontSize.display,
    "--ds-font-size-h1": typography.fontSize.h1,
    "--ds-font-size-h2": typography.fontSize.h2,
    "--ds-font-size-h3": typography.fontSize.h3,
    "--ds-font-size-h4": typography.fontSize.h4,
    "--ds-font-size-body-lg": typography.fontSize["body-lg"],
    "--ds-font-size-body": typography.fontSize.body,
    "--ds-font-size-body-sm": typography.fontSize["body-sm"],
    "--ds-font-size-caption": typography.fontSize.caption,
    "--ds-font-size-overline": typography.fontSize.overline,
    "--ds-line-height-display": typography.lineHeight.display,
    "--ds-line-height-heading": typography.lineHeight.heading,
    "--ds-line-height-body": typography.lineHeight.body,
    "--ds-line-height-caption": typography.lineHeight.caption,
    "--ds-line-height-overline": typography.lineHeight.overline,
    "--ds-letter-spacing-tight": typography.letterSpacing.tight,
    "--ds-letter-spacing-normal": typography.letterSpacing.normal,
    "--ds-letter-spacing-wide": typography.letterSpacing.wide,
    "--ds-letter-spacing-wider": typography.letterSpacing.wider,
    "--ds-letter-spacing-widest": typography.letterSpacing.widest,
    "--ds-radius-sm": borderRadius.sm,
    "--ds-radius-md": borderRadius.md,
    "--ds-radius-lg": borderRadius.lg,
    "--ds-shadow-sm": shadows.sm,
    "--ds-shadow-md": shadows.md,
    "--ds-shadow-lg": shadows.lg,
  };
}
