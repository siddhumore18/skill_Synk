import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
    TextInput, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { THEME, SHADOW } from '../theme';
import { postsAPI } from '../services/api';
import { getItem } from '../services/storage';

const accent = THEME.roles.investor.primary;

function KPICard({ icon, label, value }) {
    return (
        <View style={[styles.kpiCard, { borderTopColor: accent }]}>
            <View style={styles.kpiTop}>
                <Text style={styles.kpiLabel}>{label}</Text>
                <Text style={styles.kpiIcon}>{icon}</Text>
            </View>
            <Text style={[styles.kpiValue, { color: accent }]}>{value}</Text>
        </View>
    );
}

export default function InvestorScreen() {
    const [activeTab, setActiveTab] = useState('deals');
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
            Alert.alert('Success', 'Post uploaded!');
            setPostTitle(''); setPostDesc(''); setShowPostModal(false);
        } catch (err) { Alert.alert('Error', err.message || 'Could not post'); }
        finally { setPosting(false); }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.backgroundMuted} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Investor Dashboard</Text>
                        <Text style={styles.pageSubtitle}>Track portfolio performance and deals.</Text>
                    </View>
                    <TouchableOpacity style={[styles.newBtn, { backgroundColor: accent }]} onPress={() => setShowPostModal(true)}>
                        <Text style={styles.newBtnText}>📤 Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.kpiRow}>
                    <KPICard icon="🏢" label="Portfolio Startups" value="9" />
                    <KPICard icon="📈" label="YTD IRR" value="18.4%" />
                    <KPICard icon="💰" label="Follow-on $" value="$1.2M" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Insights</Text>
                    <View style={styles.tabs}>
                        {['deals', 'updates', 'risks'].map((t) => (
                            <TouchableOpacity key={t} style={[styles.tabBtn, activeTab === t && { backgroundColor: accent }]} onPress={() => setActiveTab(t)}>
                                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {activeTab === 'deals' && [
                        'AI Ops platform raising Seed',
                        'Fintech infra Series A opening next month',
                    ].map((d, i) => (
                        <View key={i} style={styles.dealItem}>
                            <View style={[styles.dealDot, { backgroundColor: accent }]} />
                            <Text style={styles.dealText}>{d}</Text>
                        </View>
                    ))}
                    {activeTab === 'updates' && <Text style={styles.insightText}>5 startups shared monthly updates this week.</Text>}
                    {activeTab === 'risks' && <Text style={styles.insightText}>Monitor churn in 2 early-stage portfolio companies.</Text>}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Portfolio Health</Text>
                    {[
                        { name: 'BlueLedger AI', stage: 'Seed', health: 'Healthy', color: THEME.roles.entrepreneur.primary },
                        { name: 'OrbitWorks', stage: 'Pre-Seed', health: 'Monitor', color: '#f59e0b' },
                        { name: 'NexaData', stage: 'Series A', health: 'Healthy', color: THEME.roles.entrepreneur.primary },
                    ].map((c, i) => (
                        <View key={i} style={styles.companyItem}>
                            <View>
                                <Text style={styles.companyName}>{c.name}</Text>
                                <Text style={styles.companyStage}>{c.stage}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: c.color + '18', borderColor: c.color + '55' }]}>
                                <Text style={[styles.badgeText, { color: c.color }]}>{c.health}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Modal visible={showPostModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Upload Post</Text>
                        <TextInput style={styles.modalInput} placeholder="Title" placeholderTextColor={THEME.textSecondary} value={postTitle} onChangeText={setPostTitle} />
                        <TextInput style={[styles.modalInput, { height: 110, textAlignVertical: 'top' }]} placeholder="Share market insights..." placeholderTextColor={THEME.textSecondary} value={postDesc} onChangeText={setPostDesc} multiline />
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
    kpiValue: { fontSize: 20, fontWeight: '800' },
    card: { backgroundColor: THEME.card, borderRadius: THEME.radiusLg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm },
    cardTitle: { fontSize: 15, fontWeight: '700', color: THEME.text, marginBottom: 12 },
    tabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    tabBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: THEME.backgroundMuted, borderWidth: 1, borderColor: THEME.cardBorder },
    tabText: { color: THEME.textMuted, fontWeight: '600', fontSize: 12 },
    tabTextActive: { color: '#fff' },
    dealItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    dealDot: { width: 8, height: 8, borderRadius: 4 },
    dealText: { color: THEME.text, fontSize: 14, flex: 1, lineHeight: 20 },
    insightText: { color: THEME.textMuted, fontSize: 14, lineHeight: 20 },
    companyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    companyName: { color: THEME.text, fontWeight: '600', fontSize: 14 },
    companyStage: { color: THEME.textMuted, fontSize: 12 },
    badge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1 },
    badgeText: { fontSize: 11, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalCard: { backgroundColor: THEME.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
    modalTitle: { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 14 },
    modalInput: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, borderWidth: 1, borderColor: THEME.inputBorder, color: THEME.text, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 12, fontSize: 15 },
    modalBtn: { padding: 13, borderRadius: THEME.radius, alignItems: 'center' },
});
