import { useCallback, useEffect, useState } from 'react';

// You only need 'light' now
export type Appearance = 'light';

// Just a dummy cookie setter (optional for SSR)
const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

// Apply light theme only
const applyTheme = () => {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
    }
};

export function initializeTheme() {
    // Always apply light theme
    applyTheme();
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        // Always set to light
        setAppearance('light');
        localStorage.setItem('appearance', 'light');
        setCookie('appearance', 'light');
        applyTheme();
    }, []);

    useEffect(() => {
        updateAppearance('light');
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
