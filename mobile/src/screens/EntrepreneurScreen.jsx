import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
    TextInput, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { THEME, SHADOW } from '../theme';
import { postsAPI } from '../services/api';
import { getItem } from '../services/storage';

const accent = THEME.roles.entrepreneur.primary;

const MILESTONES = [
    { title: 'Beta launch', badge: 'Due in 2 weeks', color: accent },
    { title: 'Onboard 10 pilot customers', badge: 'In progress', color: '#f59e0b' },
    { title: 'Finalize pricing tiers', badge: 'Backlog', color: THEME.textMuted },
];
const TEAM = [
    { name: 'Alice Johnson', role: 'Frontend Engineer' },
    { name: 'Ben Kim', role: 'Product Designer' },
];
const ACTIVITY = [
    { title: 'Investor meeting scheduled', sub: 'Tomorrow, 10:00 AM' },
    { title: 'New pilot customer joined', sub: 'Acme Health' },
    { title: 'v0.7.0 release notes drafted', sub: 'Review pending' },
];

function KPICard({ icon, label, value, subtitle }) {
    return (
        <View style={[styles.kpiCard, { borderTopColor: accent }]}>
            <View style={styles.kpiTop}>
                <Text style={styles.kpiLabel}>{label}</Text>
                <Text style={styles.kpiIcon}>{icon}</Text>
            </View>
            <Text style={[styles.kpiValue, { color: accent }]}>{value}</Text>
            {subtitle ? <Text style={styles.kpiSub}>{subtitle}</Text> : null}
        </View>
    );
}

export default function EntrepreneurScreen() {
    const [activeTab, setActiveTab] = useState('milestones');
    const [showPostModal, setShowPostModal] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const [posting, setPosting] = useState(false);

    const handlePost = async () => {
        if (!postTitle.trim()) { Alert.alert('Error', 'Title is required'); return; }
        setPosting(true);
        try {
            const uid = await getItem('uid');
            await postsAPI.create({ title: postTitle, description: postDesc, authorId: uid });
            Alert.alert('Success', 'Update shared!');
            setPostTitle(''); setPostDesc(''); setShowPostModal(false);
        } catch (err) { Alert.alert('Error', err.message || 'Could not post'); }
        finally { setPosting(false); }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.backgroundMuted} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Entrepreneur Dashboard</Text>
                        <Text style={styles.pageSubtitle}>Track product, team, and fundraising progress.</Text>
                    </View>
                    <TouchableOpacity style={[styles.newBtn, { backgroundColor: accent }]} onPress={() => setShowPostModal(true)}>
                        <Text style={styles.newBtnText}>🚀 Post</Text>
                    </TouchableOpacity>
                </View>

                {/* KPI Row */}
                <View style={styles.kpiRow}>
                    <KPICard icon="📁" label="Active Projects" value="4" subtitle="+1 this week" />
                    <KPICard icon="💰" label="Monthly Burn" value="$12.4k" subtitle="-8% vs last month" />
                    <KPICard icon="📅" label="Runway" value="8 mo" subtitle="Safe zone ≥6" />
                </View>

                {/* Overview Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Overview</Text>
                    <View style={styles.tabs}>
                        {['milestones', 'team', 'fundraising'].map((t) => (
                            <TouchableOpacity key={t} style={[styles.tabBtn, activeTab === t && { backgroundColor: accent }]} onPress={() => setActiveTab(t)}>
                                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {activeTab === 'milestones' && MILESTONES.map((m, i) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={styles.listItemText}>{m.title}</Text>
                            <View style={[styles.badge, { backgroundColor: m.color + '18', borderColor: m.color + '55' }]}>
                                <Text style={[styles.badgeText, { color: m.color }]}>{m.badge}</Text>
                            </View>
                        </View>
                    ))}
                    {activeTab === 'team' && TEAM.map((member, i) => (
                        <View key={i} style={styles.teamItem}>
                            <View style={[styles.teamAvatar, { backgroundColor: accent + '22' }]}>
                                <Text style={[styles.teamAvatarText, { color: accent }]}>{member.name.split(' ').map(n => n[0]).join('')}</Text>
                            </View>
                            <View>
                                <Text style={styles.teamName}>{member.name}</Text>
                                <Text style={styles.teamRole}>{member.role}</Text>
                            </View>
                        </View>
                    ))}
                    {activeTab === 'fundraising' && (
                        <View style={{ marginTop: 8 }}>
                            <Text style={styles.listItemText}>Target: Seed extension $500k</Text>
                            <View style={styles.progressBar}><View style={[styles.progressFill, { width: '60%', backgroundColor: accent }]} /></View>
                            <Text style={styles.progressLabel}>$300k committed (60%)</Text>
                        </View>
                    )}
                </View>

                {/* Recent Activity */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recent Activity</Text>
                    {ACTIVITY.map((a, i) => (
                        <View key={i} style={styles.activityItem}>
                            <Text style={styles.activityTitle}>📌 {a.title}</Text>
                            <Text style={styles.activitySub}>{a.sub}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Quick Actions</Text>
                    <View style={styles.actionRow}>
                        {['👥 Invite teammate', '🚀 Plan launch', '💰 Update metrics'].map((a) => (
                            <TouchableOpacity key={a} style={styles.actionBtn}><Text style={styles.actionBtnText}>{a}</Text></TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Post Modal */}
            <Modal visible={showPostModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Share an Update</Text>
                        <TextInput style={styles.modalInput} placeholder="Title" placeholderTextColor={THEME.textSecondary} value={postTitle} onChangeText={setPostTitle} />
                        <TextInput style={[styles.modalInput, { height: 110, textAlignVertical: 'top' }]} placeholder="What's your update?" placeholderTextColor={THEME.textSecondary} value={postDesc} onChangeText={setPostDesc} multiline />
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: THEME.backgroundMuted, flex: 1 }]} onPress={() => setShowPostModal(false)}>
                                <Text style={{ color: THEME.text, fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: accent, flex: 1 }]} onPress={handlePost} disabled={posting}>
                                {posting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700' }}>Post</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: THEME.backgroundMuted },
    container: { flex: 1 },
    content: { padding: 16, paddingTop: 56, paddingBottom: 32 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    pageTitle: { fontSize: 20, fontWeight: '800', color: THEME.text, marginBottom: 2 },
    pageSubtitle: { fontSize: 13, color: THEME.textMuted },
    newBtn: { borderRadius: THEME.radius, paddingHorizontal: 12, paddingVertical: 7 },
    newBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

    kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    kpiCard: { backgroundColor: THEME.card, borderRadius: THEME.radius, padding: 12, flex: 1, borderTopWidth: 2, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm },
    kpiTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    kpiLabel: { fontSize: 11, color: THEME.textMuted, fontWeight: '600', flex: 1 },
    kpiIcon: { fontSize: 14 },
    kpiValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
    kpiSub: { fontSize: 10, color: THEME.textSecondary },

    card: { backgroundColor: THEME.card, borderRadius: THEME.radiusLg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm },
    cardTitle: { fontSize: 15, fontWeight: '700', color: THEME.text, marginBottom: 12 },

    tabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    tabBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: THEME.backgroundMuted, borderWidth: 1, borderColor: THEME.cardBorder },
    tabText: { color: THEME.textMuted, fontWeight: '600', fontSize: 12 },
    tabTextActive: { color: '#fff' },

    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    listItemText: { color: THEME.text, flex: 1, fontSize: 14 },
    badge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1 },
    badgeText: { fontSize: 11, fontWeight: '600' },

    teamItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    teamAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
    teamAvatarText: { fontWeight: '700', fontSize: 13 },
    teamName: { color: THEME.text, fontWeight: '600', fontSize: 14 },
    teamRole: { color: THEME.textMuted, fontSize: 12 },

    progressBar: { width: '100%', height: 6, borderRadius: 3, backgroundColor: THEME.backgroundMuted, marginVertical: 8, borderWidth: 1, borderColor: THEME.cardBorder },
    progressFill: { height: '100%', borderRadius: 3 },
    progressLabel: { color: THEME.textMuted, fontSize: 12 },

    activityItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    activityTitle: { color: THEME.text, fontSize: 14, fontWeight: '600' },
    activitySub: { color: THEME.textMuted, fontSize: 12, marginTop: 2 },

    actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    actionBtn: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: THEME.cardBorder },
    actionBtnText: { color: THEME.text, fontSize: 13, fontWeight: '600' },

    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalCard: { backgroundColor: THEME.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, borderTopWidth: 1, borderColor: THEME.cardBorder },
    modalTitle: { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 14 },
    modalInput: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, borderWidth: 1, borderColor: THEME.inputBorder, color: THEME.text, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 12, fontSize: 15 },
    modalBtn: { padding: 13, borderRadius: THEME.radius, alignItems: 'center' },
});
