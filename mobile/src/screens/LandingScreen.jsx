import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar
} from 'react-native';
import { THEME } from '../theme';

const ROLES = [
    { title: 'Entrepreneurs', desc: 'Showcase ideas, assemble teams, and pitch to backers.', color: THEME.roles.entrepreneur.primary, bg: THEME.roles.entrepreneur.light, emoji: '🚀' },
    { title: 'Investors', desc: 'Discover vetted projects and track portfolio performance.', color: THEME.roles.investor.primary, bg: THEME.roles.investor.light, emoji: '💼' },
    { title: 'Freelancers', desc: 'Find meaningful work and build long-term relationships.', color: THEME.roles.freelancer.primary, bg: THEME.roles.freelancer.light, emoji: '⚡' },
];

export default function LandingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Text style={styles.logoIcon}>◇</Text>
                        <Text style={styles.logoText}>SkillSync</Text>
                        <View style={styles.betaBadge}><Text style={styles.betaText}>Beta</Text></View>
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginBtnText}>Log in</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.connectBadge}>
                        <Text style={styles.connectText}>✦ Connect. Collaborate. Grow.</Text>
                    </View>
                    <Text style={styles.heroTitle}>Build your next opportunity on SkillSync</Text>
                    <Text style={styles.heroSubtitle}>
                        A unified workspace for entrepreneurs, investors, and freelancers. Chat in real-time,
                        track analytics, and scale faster with the right connections.
                    </Text>
                    <TouchableOpacity style={styles.ctaPrimary} onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.ctaPrimaryText}>Get Started — It's Free</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ctaSecondary} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.ctaSecondaryText}>I already have an account →</Text>
                    </TouchableOpacity>
                    <Text style={styles.ctaNote}>No credit card required. Free to start.</Text>
                </View>

                {/* Role Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Who is SkillSync for?</Text>
                    {ROLES.map((r) => (
                        <View key={r.title} style={[styles.roleCard, { borderLeftColor: r.color }]}>
                            <View style={[styles.roleIconBg, { backgroundColor: r.bg }]}>
                                <Text style={styles.roleEmoji}>{r.emoji}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.roleTitle, { color: r.color }]}>{r.title}</Text>
                                <Text style={styles.roleDesc}>{r.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* About */}
                <View style={styles.about}>
                    <Text style={styles.aboutTitle}>About SkillSync</Text>
                    <Text style={styles.aboutText}>
                        SkillSync bridges the gap between entrepreneurs, freelancers, and investors — creating
                        a verified, transparent, and collaborative ecosystem. Whether you're pitching your next
                        big idea, funding promising startups, or offering your expertise, SkillSync provides a
                        seamless, secure, and data-driven platform to grow together.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerText}>© 2026 SkillSync. All rights reserved.</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    scroll: { paddingBottom: 40 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: THEME.cardBorder,
        backgroundColor: THEME.background,
    },
    logo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    logoIcon: { fontSize: 20, color: THEME.primary },
    logoText: { fontSize: 17, fontWeight: '700', color: THEME.text },
    betaBadge: { backgroundColor: THEME.backgroundMuted, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: THEME.cardBorder },
    betaText: { fontSize: 11, color: THEME.textMuted },
    loginBtn: { borderWidth: 1, borderColor: THEME.cardBorder, borderRadius: THEME.radius, paddingHorizontal: 14, paddingVertical: 7 },
    loginBtnText: { color: THEME.text, fontWeight: '600', fontSize: 14 },

    hero: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 40 },
    connectBadge: {
        backgroundColor: THEME.backgroundMuted, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
        alignSelf: 'flex-start', marginBottom: 16, borderWidth: 1, borderColor: THEME.cardBorder,
    },
    connectText: { color: THEME.textMuted, fontSize: 13, fontWeight: '600' },
    heroTitle: { fontSize: 30, fontWeight: '800', color: THEME.text, lineHeight: 38, marginBottom: 14 },
    heroSubtitle: { fontSize: 15, color: THEME.textMuted, lineHeight: 22, marginBottom: 28 },
    ctaPrimary: { backgroundColor: THEME.primary, borderRadius: THEME.radius, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
    ctaPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    ctaSecondary: { borderWidth: 1, borderColor: THEME.cardBorder, borderRadius: THEME.radius, paddingVertical: 14, alignItems: 'center', marginBottom: 14 },
    ctaSecondaryText: { color: THEME.text, fontWeight: '600', fontSize: 15 },
    ctaNote: { textAlign: 'center', color: THEME.textMuted, fontSize: 13 },

    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: THEME.text, marginBottom: 14 },
    roleCard: {
        backgroundColor: THEME.card, borderRadius: THEME.radius, padding: 16, marginBottom: 10,
        flexDirection: 'row', alignItems: 'center', gap: 14,
        borderLeftWidth: 3, borderWidth: 1, borderColor: THEME.cardBorder,
        ...require('../theme').SHADOW.sm,
    },
    roleIconBg: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    roleEmoji: { fontSize: 24 },
    roleTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
    roleDesc: { fontSize: 13, color: THEME.textMuted, lineHeight: 18 },

    about: { marginHorizontal: 20, backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radiusLg, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: THEME.cardBorder },
    aboutTitle: { fontSize: 18, fontWeight: '700', color: THEME.text, marginBottom: 10 },
    aboutText: { fontSize: 14, color: THEME.textMuted, lineHeight: 22 },

    footer: { paddingHorizontal: 20, paddingBottom: 20 },
    footerDivider: { height: 1, backgroundColor: THEME.cardBorder, marginBottom: 16 },
    footerText: { color: THEME.textSecondary, fontSize: 12, textAlign: 'center' },
});
