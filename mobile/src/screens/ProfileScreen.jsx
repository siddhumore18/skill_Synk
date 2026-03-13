import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../services/api';
import { getItem } from '../services/storage';
import { THEME, SHADOW } from '../theme';

const SKILLS_DEFAULT = ['Product Management', 'SaaS', 'React Native', 'FinTech', 'Agile'];

export default function ProfileScreen() {
    const { logout, role } = useAuth();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [skills, setSkills] = useState(SKILLS_DEFAULT);
    const [newSkill, setNewSkill] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    const accent = THEME.roles[role]?.primary || THEME.primary;

    useEffect(() => {
        (async () => {
            try {
                const cu = await getCurrentUser();
                if (cu) { setName(cu.name || ''); setEmail(cu.email || ''); }
            } catch { }
        })();
    }, []);

    const initials = (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
        ]);
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: THEME.background }]}>
                <View style={[styles.avatarLarge, { backgroundColor: accent }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.userName}>{name || 'User'}</Text>
                <Text style={styles.userEmail}>{email}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {['personal', 'verification', 'skills'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tabBtn, activeTab === t && { borderBottomColor: accent, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab(t)}
                    >
                        <Text style={[styles.tabText, activeTab === t && { color: accent, fontWeight: '700' }]}>
                            {t === 'personal' ? 'Personal' : t === 'verification' ? 'KYC' : 'Skills'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Personal Tab */}
            {activeTab === 'personal' && (
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <TouchableOpacity onPress={() => setEditing(!editing)}>
                            <Text style={[styles.editBtn, { color: accent }]}>{editing ? '✓ Save' : '✏️ Edit'}</Text>
                        </TouchableOpacity>
                    </View>
                    {[
                        { label: 'Full Name', value: name, setValue: setName, key: 'name' },
                        { label: 'Email', value: email, setValue: setEmail, key: 'email', keyboard: 'email-address' },
                        { label: 'Phone', value: phone, setValue: setPhone, key: 'phone', keyboard: 'phone-pad' },
                        { label: 'Location', value: location, setValue: setLocation, key: 'location' },
                    ].map((field) => (
                        <View key={field.key} style={styles.field}>
                            <Text style={styles.fieldLabel}>{field.label}</Text>
                            {editing ? (
                                <TextInput style={styles.fieldInput} value={field.value} onChangeText={field.setValue} keyboardType={field.keyboard || 'default'} placeholderTextColor={THEME.textSecondary} />
                            ) : (
                                <Text style={styles.fieldValue}>{field.value || '—'}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* KYC Tab */}
            {activeTab === 'verification' && (
                <View style={styles.card}>
                    <View style={[styles.verifiedBadge, { backgroundColor: THEME.roles.entrepreneur.light }]}>
                        <Text style={styles.verifiedIcon}>✅</Text>
                        <Text style={[styles.verifiedText, { color: THEME.roles.entrepreneur.badgeText }]}>PAN Verification: Verified</Text>
                    </View>
                    <Text style={styles.sectionTitle}>KYC & Business Documents</Text>
                    <View style={styles.uploadBox}>
                        <Text style={styles.uploadIcon}>📄</Text>
                        <Text style={styles.uploadTitle}>Upload Documents</Text>
                        <Text style={styles.uploadSubtitle}>PDF, JPG, PNG (Max 5MB)</Text>
                        <TouchableOpacity style={[styles.uploadBtn, { borderColor: accent }]}>
                            <Text style={[styles.uploadBtnText, { color: accent }]}>Choose File</Text>
                        </TouchableOpacity>
                    </View>
                    {['Certificate_of_Incorporation.pdf', 'Aadhaar_Card.pdf'].map((f) => (
                        <View key={f} style={styles.fileItem}>
                            <Text style={styles.fileName}>📎 {f}</Text>
                            <Text style={styles.fileDate}>Uploaded Jan 2024</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Skills & Focus</Text>
                    <View style={styles.skillsWrap}>
                        {skills.map((s, i) => (
                            <TouchableOpacity key={i} style={[styles.skillChip, { backgroundColor: accent + '15', borderColor: accent + '44' }]} onLongPress={() => setSkills(skills.filter(sk => sk !== s))}>
                                <Text style={[styles.skillText, { color: accent }]}>{s} ✕</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.addSkillRow}>
                        <TextInput style={styles.skillInput} placeholder="Add a skill..." placeholderTextColor={THEME.textSecondary} value={newSkill} onChangeText={setNewSkill} onSubmitEditing={addSkill} />
                        <TouchableOpacity style={[styles.addBtn, { backgroundColor: accent }]} onPress={addSkill}>
                            <Text style={styles.addBtnText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.hintText}>Long-press a skill to remove it</Text>
                </View>
            )}

            {/* Social Links */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Social & Portfolio</Text>
                {[
                    { icon: '🔗', label: 'LinkedIn', url: 'linkedin.com/in/user' },
                    { icon: '💻', label: 'GitHub', url: 'github.com/user' },
                    { icon: '🌐', label: 'Portfolio', url: 'portfolio.com' },
                ].map((s) => (
                    <View key={s.label} style={styles.socialItem}>
                        <Text style={styles.socialIcon}>{s.icon}</Text>
                        <View>
                            <Text style={styles.socialLabel}>{s.label}</Text>
                            <Text style={styles.socialUrl}>{s.url}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.backgroundMuted },
    content: { paddingBottom: 40 },
    header: { alignItems: 'center', paddingTop: 56, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder, marginBottom: 0 },
    avatarLarge: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { color: '#fff', fontSize: 30, fontWeight: '800' },
    userName: { color: THEME.text, fontSize: 19, fontWeight: '700', marginBottom: 3 },
    userEmail: { color: THEME.textMuted, fontSize: 14 },

    tabs: { flexDirection: 'row', backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder, marginBottom: 12 },
    tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabText: { color: THEME.textMuted, fontWeight: '600', fontSize: 14 },

    card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: THEME.card, borderRadius: THEME.radiusLg, padding: 18, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    sectionTitle: { color: THEME.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
    editBtn: { fontWeight: '600', fontSize: 14 },
    field: { marginBottom: 14 },
    fieldLabel: { color: THEME.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 4 },
    fieldValue: { color: THEME.text, fontSize: 15 },
    fieldInput: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, padding: 10, color: THEME.text, fontSize: 15, borderWidth: 1, borderColor: THEME.inputBorder },

    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: THEME.radius, padding: 10, marginBottom: 16 },
    verifiedIcon: { fontSize: 16 },
    verifiedText: { fontWeight: '600', fontSize: 13 },
    uploadBox: { borderWidth: 1, borderColor: THEME.inputBorder, borderStyle: 'dashed', borderRadius: THEME.radiusLg, padding: 24, alignItems: 'center', marginBottom: 14 },
    uploadIcon: { fontSize: 26, marginBottom: 6 },
    uploadTitle: { color: THEME.text, fontWeight: '600', marginBottom: 3 },
    uploadSubtitle: { color: THEME.textMuted, fontSize: 12, marginBottom: 12 },
    uploadBtn: { borderRadius: THEME.radius, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8 },
    uploadBtnText: { fontWeight: '600' },
    fileItem: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: THEME.cardBorder },
    fileName: { color: THEME.text, fontSize: 13 },
    fileDate: { color: THEME.textSecondary, fontSize: 11, marginTop: 4 },

    skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    skillChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
    skillText: { fontWeight: '600', fontSize: 13 },
    addSkillRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    skillInput: { flex: 1, backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, padding: 10, color: THEME.text, borderWidth: 1, borderColor: THEME.inputBorder },
    addBtn: { borderRadius: THEME.radius, paddingHorizontal: 14, justifyContent: 'center' },
    addBtnText: { color: '#fff', fontWeight: '700' },
    hintText: { color: THEME.textSecondary, fontSize: 12 },

    socialItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    socialIcon: { fontSize: 18 },
    socialLabel: { color: THEME.text, fontWeight: '600', fontSize: 14 },
    socialUrl: { color: THEME.textMuted, fontSize: 12 },

    logoutBtn: { marginHorizontal: 16, marginTop: 8, borderWidth: 1, borderColor: THEME.destructive, borderRadius: THEME.radiusLg, padding: 14, alignItems: 'center' },
    logoutBtnText: { color: THEME.destructive, fontWeight: '700', fontSize: 15 },
});
