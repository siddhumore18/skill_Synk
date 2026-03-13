// Central theme matching the web platform exactly
// Web uses light mode: white bg, dark text, role-specific primaries

export const THEME = {
    // Background colors (web: white / near-white)
    background: '#ffffff',
    backgroundMuted: '#f8f9fa',   // muted bg for sections
    card: '#ffffff',
    cardBorder: '#e5e7eb',        // oklch(0.92 0.004 286.32) ≈ gray-200

    // Text colors (web: dark foreground)
    text: '#0f172a',              // oklch(0.141 0.005 285.823) dark slate
    textMuted: '#64748b',         // oklch(0.552 0.016 285.938) slate-500
    textSecondary: '#94a3b8',     // lighter muted

    // Input / secondary surface
    input: '#f1f5f9',             // near-white input bg
    inputBorder: '#e2e8f0',

    // Primary = default orange-red (web global primary)
    primary: '#e85d2f',           // oklch(0.637 0.237 25.331) ≈ red-orange
    primaryFg: '#fff',

    // Role-specific primary colors (exactly from web CSS)
    roles: {
        entrepreneur: {
            primary: '#22c55e',       // oklch(0.648 0.2 131.684) ≈ green-500
            primaryFg: '#ffffff',
            light: '#f0fdf4',         // green-50
            badge: '#dcfce7',         // green-100
            badgeText: '#15803d',     // green-700
        },
        freelancer: {
            primary: '#6366f1',       // oklch(0.488 0.243 264.376) ≈ indigo-500
            primaryFg: '#ffffff',
            light: '#eef2ff',         // indigo-50
            badge: '#e0e7ff',         // indigo-100
            badgeText: '#4338ca',     // indigo-700
        },
        investor: {
            primary: '#e85d2f',       // same as global primary (orange-red)
            primaryFg: '#ffffff',
            light: '#fff7ed',
            badge: '#fed7aa',
            badgeText: '#c2410c',
        },
    },

    // Badge colors for feed role labels (from Feed.jsx)
    roleBadgeColors: {
        Investor: { bg: '#e0e7ff', text: '#4338ca' },
        Entrepreneur: { bg: '#dcfce7', text: '#15803d' },
        Freelancer: { bg: '#fef3c7', text: '#92400e' },
    },

    // Border radius matching web (0.65rem ≈ 10px)
    radius: 10,
    radiusSm: 6,
    radiusLg: 14,

    // Sidebar bg (web uses white)
    sidebarBg: '#ffffff',

    // Destructive
    destructive: '#ef4444',
    destructiveFg: '#ffffff',
};

export const SHADOW = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
};
