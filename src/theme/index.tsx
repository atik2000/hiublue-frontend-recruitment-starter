'use client';

import {useMemo} from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeOptions, ThemeProvider as MuiThemeProvider} from '@mui/material/styles';


// system
import {palette} from './palette';
import {shadows} from './shadows';
import {typography} from './typography';
// options
import {componentsOverrides} from './overrides';
import {customShadows} from "@/theme/custom-shadows";

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

const theme = createTheme({
    palette: {
        primary: {
            main: '#2065D1',
            darker: '#103996',
            lighter: '#D1E9FC',
        },
        background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: '"Public Sans", sans-serif',
        h4: {
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '8px 22px',
                    height: '48px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
    },
});

export default function ThemeProvider({children}: Props) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </MuiThemeProvider>
    );
}
