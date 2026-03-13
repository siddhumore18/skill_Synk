import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
    TextInput, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { THEME, SHADOW } from '../theme';
import { postsAPI } from '../services/api';
import { getItem } from '../services/storage';

const accent = THEME.roles.freelancer.primary;

const TASKS = [
    { title: 'Implement chat typing indicator', client: 'Slynk', status: 'Due Fri' },
    { title: 'Refactor dashboard cards', client: 'Acme', status: 'In review' },
    { title: 'Fix responsive issues on mobile', client: 'Flux', status: 'Next sprint' },
];
const REVIEWS = [
    { client: 'Acme', stars: 5, text: 'Great collaboration and quality!' },
    { client: 'Flux', stars: 5, text: 'Fast delivery and clear communication.' },
    { client: 'Slynk', stars: 4, text: 'Solid work, minor tweaks needed.' },
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

export default function FreelancerScreen() {
    const [activeTab, setActiveTab] = useState('tasks');
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
            Alert.alert('Success', 'Post shared!');
            setPostTitle(''); setPostDesc(''); setShowPostModal(false);
        } catch (err) { Alert.alert('Error', err.message || 'Could not post'); }
        finally { setPosting(false); }
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.backgroundMuted} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Freelancer Dashboard</Text>
                        <Text style={styles.pageSubtitle}>Manage contracts, track time, invoice clients.</Text>
                    </View>
                    <TouchableOpacity style={[styles.newBtn, { backgroundColor: accent }]} onPress={() => setShowPostModal(true)}>
                        <Text style={styles.newBtnText}>✏️ New Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.kpiRow}>
                    <KPICard icon="📋" label="Active Contracts" value="3" subtitle="2 fixed, 1 hourly" />
                    <KPICard icon="💵" label="This Month" value="$3,250" subtitle="$1,100 outstanding" />
                    <KPICard icon="⏱" label="Hours Tracked" value="46h" subtitle="76% of 60h goal" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Hour Tracking — This Month</Text>
                    <View style={styles.progressBar}><View style={[styles.progressFill, { width: '76%', backgroundColor: accent }]} /></View>
                    <Text style={styles.progressLabel}>46 / 60 hours (76%)</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Work</Text>
                    <View style={styles.tabs}>
                        {['tasks', 'invoices', 'reviews'].map((t) => (
                            <TouchableOpacity key={t} style={[styles.tabBtn, activeTab === t && { backgroundColor: accent }]} onPress={() => setActiveTab(t)}>
                                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {activeTab === 'tasks' && TASKS.map((task, i) => (
                        <View key={i} style={styles.taskItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.taskTitle}>{task.title}</Text>
                                <Text style={styles.taskClient}>Client: {task.client}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: accent + '18', borderColor: accent + '55' }]}>
                                <Text style={[styles.badgeText, { color: accent }]}>{task.status}</Text>
                            </View>
                        </View>
                    ))}
                    {activeTab === 'invoices' && (
                        <View>
                            <Text style={styles.invoiceLabel}>2 invoices pending payment</Text>
                            {[
                                { id: 'INV-1042', client: 'Acme', amount: '$650', due: '5 days' },
                                { id: 'INV-1043', client: 'Flux', amount: '$450', due: '9 days' },
                            ].map((inv, i) => (
                                <View key={i} style={styles.invoiceItem}>
                                    <Text style={styles.invoiceId}>{inv.id} · {inv.client}</Text>
                                    <Text style={styles.invoiceDue}>{inv.amount} · Due in {inv.due}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {activeTab === 'reviews' && REVIEWS.map((rev, i) => (
                        <View key={i} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewClient}>{rev.client}</Text>
                                <Text>{'⭐'.repeat(rev.stars)}</Text>
                            </View>
                            <Text style={styles.reviewText}>{rev.text}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Modal visible={showPostModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Create Post</Text>
                        <TextInput style={styles.modalInput} placeholder="Title" placeholderTextColor={THEME.textSecondary} value={postTitle} onChangeText={setPostTitle} />
                        <TextInput style={[styles.modalInput, { height: 110, textAlignVertical: 'top' }]} placeholder="Describe your service or update..." placeholderTextColor={THEME.textSecondary} value={postDesc} onChangeText={setPostDesc} multiline />
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
    progressBar: { width: '100%', height: 6, borderRadius: 3, backgroundColor: THEME.backgroundMuted, marginBottom: 6, borderWidth: 1, borderColor: THEME.cardBorder },
    progressFill: { height: '100%', borderRadius: 3 },
    progressLabel: { color: THEME.textMuted, fontSize: 12 },
    tabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    tabBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: THEME.backgroundMuted, borderWidth: 1, borderColor: THEME.cardBorder },
    tabText: { color: THEME.textMuted, fontWeight: '600', fontSize: 12 },
    tabTextActive: { color: '#fff' },
    taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    taskTitle: { color: THEME.text, fontWeight: '600', fontSize: 14 },
    taskClient: { color: THEME.textMuted, fontSize: 12, marginTop: 2 },
    badge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1 },
    badgeText: { fontSize: 11, fontWeight: '600' },
    invoiceLabel: { color: THEME.textMuted, fontSize: 13, marginBottom: 10 },
    invoiceItem: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: THEME.cardBorder },
    invoiceId: { color: THEME.text, fontWeight: '600', fontSize: 14 },
    invoiceDue: { color: THEME.textMuted, fontSize: 12, marginTop: 4 },
    reviewItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    reviewClient: { color: THEME.text, fontWeight: '700', fontSize: 14 },
    reviewText: { color: THEME.textMuted, fontSize: 13, lineHeight: 19 },
    modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
    modalCard: { backgroundColor: THEME.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
    modalTitle: { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 14 },
    modalInput: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, borderWidth: 1, borderColor: THEME.inputBorder, color: THEME.text, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 12, fontSize: 15 },
    modalBtn: { padding: 13, borderRadius: THEME.radius, alignItems: 'center' },
});
