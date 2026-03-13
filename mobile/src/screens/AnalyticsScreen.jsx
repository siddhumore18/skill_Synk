import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { THEME, SHADOW } from '../theme';

const ROLE_DATA = {
    entrepreneur: {
        kpi: [
            { label: 'Revenue', value: '$48k', sub: '+12% MoM', sparkVals: [30, 45, 35, 60, 52, 70, 65, 80] },
            { label: 'Burn Rate', value: '$12.4k', sub: '-8% vs last month', sparkVals: [80, 75, 70, 60, 55, 58, 50, 45] },
            { label: 'Runway', value: '8 months', sub: 'Safe zone', sparkVals: [8, 7.5, 7, 7.8, 8, 8.2, 8.5, 8] },
            { label: 'Active Users', value: '2,340', sub: '+340 this month', sparkVals: [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2340] },
        ],
        insights: ['Revenue up 12% month-over-month', 'Burn rate trending down — good sign', 'User growth accelerating to 2.3k MAU'],
    },
    freelancer: {
        kpi: [
            { label: 'Total Earnings', value: '$18.2k', sub: '+22% YTD', sparkVals: [2000, 3000, 2500, 3200, 3500, 4000, 3800, 4200] },
            { label: 'Active Contracts', value: '3', sub: '2 fixed, 1 hourly', sparkVals: [1, 2, 2, 3, 2, 3, 3, 3] },
            { label: 'Avg Rating', value: '4.8 ⭐', sub: '12 reviews', sparkVals: [4.2, 4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.8] },
            { label: 'Hours Billed', value: '180h', sub: '46h this month', sparkVals: [10, 20, 25, 30, 28, 35, 40, 46] },
        ],
        insights: ['Earnings up 22% year-to-date', '4.8 avg rating from 12 reviews', 'Consider raising rates — demand is high'],
    },
    investor: {
        kpi: [
            { label: 'Portfolio Size', value: '$2.4M', sub: '+3% this quarter', sparkVals: [1800, 1900, 2000, 2100, 2200, 2300, 2350, 2400] },
            { label: 'YTD IRR', value: '18.4%', sub: 'Above target', sparkVals: [10, 12, 14, 15, 16, 17, 18, 18.4] },
            { label: 'Active Startups', value: '9', sub: '2 exited', sparkVals: [5, 6, 7, 8, 8, 9, 9, 9] },
            { label: 'Follow-on $', value: '$1.2M', sub: 'Available', sparkVals: [1500, 1400, 1300, 1350, 1200, 1250, 1200, 1200] },
        ],
        insights: ['Portfolio IRR at 18.4% — above target', '2 portfolio companies hit Series A', 'Monitor churn in 2 early-stage bets'],
    },
};

const INSIGHT_ICONS = { 0: '✅', 1: '📈', 2: '⚠️' };

export default function AnalyticsScreen() {
    const { role } = useAuth();
    const data = ROLE_DATA[role] || ROLE_DATA.entrepreneur;
    const accent = THEME.roles[role]?.primary || THEME.primary;
    const title = role === 'freelancer' ? 'Freelancer Analytics' : role === 'investor' ? 'Investor Analytics' : 'Entrepreneur Analytics';

    const barVals = [30, 45, 42, 60, 55, 75];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.backgroundMuted} />
            <Text style={[styles.title, { color: accent }]}>{title}</Text>
            <Text style={styles.subtitle}>Performance overview at a glance</Text>

            {/* KPI Grid */}
            <View style={styles.kpiGrid}>
                {data.kpi.map((k, i) => (
                    <View key={i} style={[styles.kpiCard, { borderTopColor: accent }]}>
                        <Text style={styles.kpiLabel}>{k.label}</Text>
                        <Text style={[styles.kpiValue, { color: accent }]}>{k.value}</Text>
                        <Text style={styles.kpiSub}>{k.sub}</Text>
                        {/* Spark dots */}
                        <View style={styles.sparkRow}>
                            {k.sparkVals.map((v, j) => {
                                const max = Math.max(...k.sparkVals);
                                const min = Math.min(...k.sparkVals);
                                const h = Math.max(3, ((v - min) / (max - min + 0.001)) * 20);
                                return <View key={j} style={[styles.sparkBar, { height: h, backgroundColor: accent, opacity: 0.4 + (j / k.sparkVals.length) * 0.6 }]} />;
                            })}
                        </View>
                    </View>
                ))}
            </View>

            {/* Monthly Growth */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Monthly Growth</Text>
                {months.map((month, i) => (
                    <View key={month} style={styles.barRow}>
                        <Text style={styles.barLabel}>{month}</Text>
                        <View style={styles.barBg}>
                            <View style={[styles.barFill, { width: `${barVals[i]}%`, backgroundColor: accent }]} />
                        </View>
                        <Text style={styles.barPct}>{barVals[i]}%</Text>
                    </View>
                ))}
            </View>

            {/* Key Insights */}
            <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: accent }]}>
                <Text style={styles.cardTitle}>Key Insights</Text>
                {data.insights.map((ins, i) => (
                    <View key={i} style={styles.insightRow}>
                        <Text style={styles.insightIcon}>{INSIGHT_ICONS[i] || '📌'}</Text>
                        <Text style={styles.insightText}>{ins}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.backgroundMuted },
    content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
    title: { fontSize: 22, fontWeight: '800', marginBottom: 3 },
    subtitle: { color: THEME.textMuted, fontSize: 13, marginBottom: 20 },

    kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    kpiCard: { backgroundColor: THEME.card, borderRadius: THEME.radius, padding: 14, borderTopWidth: 2, borderWidth: 1, borderColor: THEME.cardBorder, width: '47%', ...SHADOW.sm },
    kpiLabel: { color: THEME.textMuted, fontSize: 11, fontWeight: '600', marginBottom: 4 },
    kpiValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
    kpiSub: { color: THEME.textSecondary, fontSize: 10, marginBottom: 8 },
    sparkRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 },
    sparkBar: { flex: 1, borderRadius: 2 },

    card: { backgroundColor: THEME.card, borderRadius: THEME.radiusLg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm },
    cardTitle: { color: THEME.text, fontSize: 15, fontWeight: '700', marginBottom: 14 },

    barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
    barLabel: { color: THEME.textMuted, fontSize: 12, width: 28 },
    barBg: { flex: 1, height: 8, backgroundColor: THEME.backgroundMuted, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: THEME.cardBorder },
    barFill: { height: '100%', borderRadius: 4 },
    barPct: { color: THEME.textMuted, fontSize: 11, width: 32, textAlign: 'right' },

    insightRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
    insightIcon: { fontSize: 16 },
    insightText: { color: THEME.text, fontSize: 14, lineHeight: 20, flex: 1 },
});
