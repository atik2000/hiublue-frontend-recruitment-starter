'use client';

import {useMemo} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider as MuiThemeProvider} from '@mui/material/styles';

// system
import {palette} from './palette';
import {shadows} from './shadows';
import {typography} from './typography';
import {customShadows} from './custom-shadows';
// options
import componentsOverrides from './overrides';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

const baseTheme = createTheme({
    palette,
    typography,
    shadows: shadows(),
    customShadows: customShadows(),
});

export default function ThemeProvider({children}: Props) {
    const theme = useMemo(() => {
        const newTheme = createTheme(baseTheme);
        newTheme.components = componentsOverrides(newTheme);
        return newTheme;
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </MuiThemeProvider>
    );
}
