"use client";

import { createTheme } from "@mui/material/styles";
import { borderRadius, colors, typography } from "../../lib/design-system/tokens";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary.DEFAULT,
      dark: colors.primary.dark,
      light: colors.primary.light,
      contrastText: colors.primary.foreground,
    },
    background: {
      default: colors.surface.DEFAULT,
      paper: colors.surface.paper,
    },
    text: {
      primary: colors.foreground.DEFAULT,
      secondary: colors.foreground.muted,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    info: {
      main: colors.status.info,
    },
  },
  shape: {
    borderRadius: parseInt(borderRadius.control, 10),
  },
  typography: {
    fontFamily: typography.fontFamily.sans,
    h1: {
      fontSize: typography.fontSize.h1,
      lineHeight: typography.lineHeight.heading,
      fontWeight: 700,
    },
    h2: {
      fontSize: typography.fontSize.h2,
      lineHeight: typography.lineHeight.heading,
      fontWeight: 700,
    },
    h3: {
      fontSize: typography.fontSize.h3,
      lineHeight: typography.lineHeight.heading,
      fontWeight: 700,
    },
    h4: {
      fontSize: typography.fontSize.h4,
      lineHeight: typography.lineHeight.heading,
      fontWeight: 600,
    },
    body1: {
      fontSize: typography.fontSize.body,
      lineHeight: typography.lineHeight.body,
    },
    body2: {
      fontSize: typography.fontSize["body-sm"],
      lineHeight: typography.lineHeight.body,
    },
    caption: {
      fontSize: typography.fontSize.caption,
      lineHeight: typography.lineHeight.caption,
    },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: colors.primary.DEFAULT,
            "&:hover": {
              backgroundColor: colors.primary.dark,
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.none,
        },
        rounded: {
          borderRadius: borderRadius.none,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        notchedOutline: {
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});
