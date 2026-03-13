import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, TextInput, StatusBar,
} from 'react-native';
import { chatAPI } from '../services/api';
import { getItem } from '../services/storage';
import { THEME, SHADOW } from '../theme';

const FALLBACK_USERS = [
    { uid: 'u1', name: 'Alice Johnson', role: 'Entrepreneur' },
    { uid: 'u2', name: 'Ben Kim', role: 'Investor' },
    { uid: 'u3', name: 'Neha Patel', role: 'Freelancer' },
    { uid: 'u4', name: 'Raj Mehta', role: 'Entrepreneur' },
];

export default function NewChatScreen({ navigation, route }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [myUid, setMyUid] = useState('');

    useEffect(() => {
        (async () => {
            const uid = await getItem('uid');
            setMyUid(uid || '');
            try {
                const data = await chatAPI.getUsers();
                setUsers((data.length ? data : FALLBACK_USERS).filter(u => u.uid !== uid));
            } catch {
                setUsers(FALLBACK_USERS.filter(u => u.uid !== uid));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = users.filter(u =>
        (u.name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>✕ Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Message</Text>
                <View style={{ width: 60 }} />
            </View>
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍  Search users..."
                    placeholderTextColor={THEME.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                    autoFocus
                />
            </View>
            {loading ? (
                <View style={styles.center}><ActivityIndicator color={THEME.primary} /></View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.uid || String(Math.random())}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => {
                        const roleColors = THEME.roleBadgeColors[item.role] || { bg: THEME.backgroundMuted, text: THEME.textMuted };
                        const initials = (item.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        return (
                            <TouchableOpacity
                                style={styles.userItem}
                                onPress={() => {
                                    navigation.replace('ChatMessage', {
                                        userId: item.uid,
                                        userName: item.name,
                                        userRole: item.role,
                                        currentUid: myUid,
                                    });
                                }}
                            >
                                <View style={[styles.avatar, { backgroundColor: roleColors.bg }]}>
                                    <Text style={[styles.avatarText, { color: roleColors.text }]}>{initials}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.userName}>{item.name}</Text>
                                    <Text style={styles.userRole}>{item.role || 'User'}</Text>
                                </View>
                                <Text style={styles.chevron}>›</Text>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.backgroundMuted },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 56, paddingBottom: 14, paddingHorizontal: 20,
        backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder,
    },
    backText: { color: THEME.primary, fontSize: 15, fontWeight: '600', width: 60 },
    title: { fontSize: 17, fontWeight: '700', color: THEME.text },
    searchRow: { padding: 12, backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    searchInput: { backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius, paddingHorizontal: 14, paddingVertical: 10, color: THEME.text, fontSize: 15, borderWidth: 1, borderColor: THEME.inputBorder },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    userItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: THEME.card, borderRadius: THEME.radiusLg, marginBottom: 10, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontWeight: '700', fontSize: 16 },
    userName: { color: THEME.text, fontWeight: '700', fontSize: 15 },
    userRole: { color: THEME.textMuted, fontSize: 13 },
    chevron: { color: THEME.textSecondary, fontSize: 22 },
    empty: { color: THEME.textSecondary, textAlign: 'center', marginTop: 40, fontSize: 15 },
});
