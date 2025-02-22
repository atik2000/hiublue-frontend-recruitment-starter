"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useMemo } from "react";

// system
import { customShadows } from "./custom-shadows";
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
// options
import componentsOverrides from "./overrides";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const baseTheme = createTheme({
  palette,
  typography,
  shadows: shadows(),
  customShadows: customShadows(),
} as any);

export default function ThemeProvider({ children }: Props) {
  const theme = useMemo(() => {
    const newTheme = createTheme(baseTheme);
    newTheme.components = componentsOverrides(newTheme) as any;
    return newTheme;
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}