'use client';

import * as React from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ThemeProvider from "@/theme/index";
import { AuthProvider } from '@/context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <InitColorSchemeScript attribute="class"/>
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <ThemeProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SnackbarProvider>
                        <AuthProvider>
                            {props.children}
                        </AuthProvider>
                    </SnackbarProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
