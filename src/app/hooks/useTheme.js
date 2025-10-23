import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
        document.documentElement.style.setProperty('--color-background-primary', savedTheme === 'dark' ? '#0d111c' : '#ffffff');
        document.documentElement.style.setProperty('--color-background-secondary', savedTheme === 'dark' ? '#161b22' : '#f0f4f8');
        document.documentElement.style.setProperty('--color-background-tertiary', savedTheme === 'dark' ? '#21262d' : '#e0e4e8');
        document.documentElement.style.setProperty('--color-text-primary', savedTheme === 'dark' ? '#f0f6fc' : '#1c2128');
        document.documentElement.style.setProperty('--color-text-secondary', savedTheme === 'dark' ? '#8b949e' : '#57606a');
        document.documentElement.style.setProperty('--color-text-accent', savedTheme === 'dark' ? '#c9d1d9' : '#1c2128');
        document.documentElement.style.setProperty('--color-accent-primary', '#1e90ff');
        document.documentElement.style.setProperty('--color-green-text', '#3fb950');
        document.documentElement.style.setProperty('--color-red-text', '#f85149');
        document.documentElement.style.setProperty('--color-card-bg', savedTheme === 'dark' ? '#1f242b' : '#ffffff');
        document.documentElement.style.setProperty('--color-border', savedTheme === 'dark' ? '#30363d' : '#d0d7de');
        document.documentElement.style.setProperty('--color-subtle-bg', savedTheme === 'dark' ? '#2d333b' : '#f6f8fa');
        document.documentElement.style.setProperty('--color-hover-bg', savedTheme === 'dark' ? '#3e444b' : '#e8ebed');
        document.documentElement.style.setProperty('--color-input-border', savedTheme === 'dark' ? '#444c56' : '#c9d1d9');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return { theme, toggleTheme };
};