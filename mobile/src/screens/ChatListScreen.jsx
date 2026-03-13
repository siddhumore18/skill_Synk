import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, TextInput, StatusBar, RefreshControl,
} from 'react-native';
import { chatAPI } from '../services/api';
import { getItem } from '../services/storage';
import { THEME, SHADOW } from '../theme';


function formatTime(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString();
}

export default function ChatListScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [currentUid, setCurrentUid] = useState('');
    const [error, setError] = useState('');

    const loadConversations = async () => {
        setError('');
        try {
            const uid = await getItem('uid');
            setCurrentUid(uid || '');
            if (!uid) {
                setError('Not logged in. Please log out and log in again.');
                setConversations([]);
                return;
            }
            const data = await chatAPI.getConversations();
            setConversations(data); // Only shows THIS user's conversations — no fallback
        } catch (e) {
            const msg = e?.message || '';
            if (msg.includes('401') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('invalid')) {
                setError('Session expired. Tap refresh or log out & log in again.');
            } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
                setError(`Cannot reach server. Check your API URL in api.js (currently needs your LAN IP:3001).`);
            } else {
                setError(msg || 'Failed to load conversations.');
            }
            setConversations([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadConversations(); }, []);

    const onRefresh = () => { setRefreshing(true); loadConversations(); };

    const filtered = conversations.filter(c =>
        (c.otherUser?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
            <View style={styles.topBar}>
                <Text style={styles.title}>Messages</Text>
                {/* New Chat button — shows all users to start a fresh chat */}
                <TouchableOpacity
                    style={styles.newChatBtn}
                    onPress={() => navigation.navigate('NewChat', { currentUid })}
                >
                    <Text style={styles.newChatBtnText}>✏️ New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍  Search conversations..."
                    placeholderTextColor={THEME.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator color={THEME.primary} /></View>
            ) : error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorTitle}>Could not load conversations</Text>
                    <Text style={styles.errorMsg}>{error}</Text>
                    <TouchableOpacity style={[styles.retryBtn, { backgroundColor: THEME.primary }]} onPress={() => { setLoading(true); loadConversations(); }}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id || item.otherUserId || String(Math.random())}
                    contentContainerStyle={{ padding: 16 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />}
                    renderItem={({ item }) => {
                        const name = item.otherUser?.name || item.otherUserId?.slice(0, 8) || 'User';
                        const role = item.otherUser?.role || '';
                        const roleColors = THEME.roleBadgeColors[role] || { bg: THEME.backgroundMuted, text: THEME.textMuted };
                        const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        return (
                            <TouchableOpacity
                                style={styles.convoItem}
                                onPress={() => navigation.navigate('ChatMessage', {
                                    userId: item.otherUserId,
                                    userName: name,
                                    userRole: role,
                                    currentUid,
                                })}
                            >
                                <View style={[styles.avatar, { backgroundColor: roleColors.bg }]}>
                                    <Text style={[styles.avatarText, { color: roleColors.text }]}>{initials}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.convoTop}>
                                        <Text style={styles.convoName}>{name}</Text>
                                        <Text style={styles.convoTime}>{formatTime(item.lastMessageTime)}</Text>
                                    </View>
                                    <View style={styles.convoBottom}>
                                        {role ? (
                                            <View style={[styles.roleBadge, { backgroundColor: roleColors.bg }]}>
                                                <Text style={[styles.roleText, { color: roleColors.text }]}>{role}</Text>
                                            </View>
                                        ) : null}
                                        <Text style={styles.lastMsg} numberOfLines={1}>
                                            {item.lastMessage || 'Start chatting'}
                                        </Text>
                                    </View>
                                </View>
                                {item.unreadCount > 0 && (
                                    <View style={[styles.unreadBadge, { backgroundColor: THEME.primary }]}>
                                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyIcon}>💬</Text>
                            <Text style={styles.emptyTitle}>No conversations yet</Text>
                            <Text style={styles.emptySubtitle}>Start a new conversation by tapping ✏️ New above</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.backgroundMuted },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
        backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder,
    },
    title: { fontSize: 22, fontWeight: '800', color: THEME.text },
    newChatBtn: { backgroundColor: THEME.primary, borderRadius: THEME.radius, paddingHorizontal: 12, paddingVertical: 7 },
    newChatBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    searchRow: { padding: 12, backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder },
    searchInput: {
        backgroundColor: THEME.backgroundMuted, borderRadius: THEME.radius,
        paddingHorizontal: 14, paddingVertical: 10, color: THEME.text, fontSize: 15,
        borderWidth: 1, borderColor: THEME.inputBorder,
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    convoItem: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        padding: 14, backgroundColor: THEME.card, borderRadius: THEME.radiusLg,
        marginBottom: 10, borderWidth: 1, borderColor: THEME.cardBorder, ...SHADOW.sm,
    },
    avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    avatarText: { fontWeight: '700', fontSize: 17 },
    convoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    convoName: { color: THEME.text, fontWeight: '700', fontSize: 15, flex: 1 },
    convoTime: { color: THEME.textSecondary, fontSize: 12, marginLeft: 8 },
    convoBottom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    roleBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
    roleText: { fontSize: 10, fontWeight: '600' },
    lastMsg: { color: THEME.textMuted, fontSize: 13, flex: 1 },
    unreadBadge: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    unreadText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    emptyBox: { alignItems: 'center', paddingTop: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyTitle: { color: THEME.text, fontWeight: '700', fontSize: 18, marginBottom: 8 },
    emptySubtitle: { color: THEME.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },

    errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    errorIcon: { fontSize: 40, marginBottom: 12 },
    errorTitle: { color: THEME.text, fontWeight: '700', fontSize: 17, marginBottom: 8, textAlign: 'center' },
    errorMsg: { color: THEME.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
    retryBtn: { borderRadius: THEME.radius, paddingHorizontal: 24, paddingVertical: 12 },
    retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
