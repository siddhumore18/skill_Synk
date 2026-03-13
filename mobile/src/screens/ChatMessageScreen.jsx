import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
    ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { chatAPI } from '../services/api';
import { getItem } from '../services/storage';
import { THEME, SHADOW } from '../theme';

function formatTime(date) {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessageScreen({ route, navigation }) {
    const { userId, userName, userRole, currentUid: paramsUid } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [text, setText] = useState('');
    const [myUid, setMyUid] = useState(paramsUid || '');
    const flatListRef = useRef(null);
    const pollingRef = useRef(null);

    const roleColors = THEME.roleBadgeColors[userRole] || { bg: THEME.backgroundMuted, text: THEME.textMuted };
    const initials = (userName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const loadMessages = async (uid) => {
        try {
            const eid = uid || myUid || (await getItem('uid')) || '';
            if (!myUid && eid) setMyUid(eid);
            const data = await chatAPI.getMessages(userId);
            setMessages(data.map(m => ({ ...m, timestamp: m.timestamp ? new Date(m.timestamp) : new Date() })));
        } catch (e) {
            // keep existing messages
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const uid = paramsUid || (await getItem('uid')) || '';
            setMyUid(uid);
            await loadMessages(uid);
            // Poll every 5s for new messages
            pollingRef.current = setInterval(() => loadMessages(uid), 5000);
        })();
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, [userId]);

    const handleSend = async () => {
        const content = text.trim();
        if (!content) return;
        setText('');
        setSending(true);
        // Optimistic update
        const optimistic = {
            id: `temp-${Date.now()}`, senderId: myUid, receiverId: userId,
            content, timestamp: new Date(),
        };
        setMessages(prev => [...prev, optimistic]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        try {
            const res = await chatAPI.sendMessage(userId, content);
            if (res?.message) {
                const serverMsg = { ...res.message, timestamp: new Date(res.message.timestamp) };
                setMessages(prev => prev.map(m => m.id === optimistic.id ? serverMsg : m));
            }
        } catch {
            // Message stays optimistically but mark as failed
            setMessages(prev => prev.map(m => m.id === optimistic.id ? { ...m, failed: true } : m));
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === myUid;
        return (
            <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
                {!isMe && (
                    <View style={[styles.msgAvatar, { backgroundColor: roleColors.bg }]}>
                        <Text style={[styles.msgAvatarText, { color: roleColors.text }]}>{initials}</Text>
                    </View>
                )}
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem, item.failed && styles.bubbleFailed]}>
                    <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
                        {formatTime(item.timestamp)}{item.failed ? ' ✗' : ''}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={[styles.headerAvatar, { backgroundColor: roleColors.bg }]}>
                    <Text style={[styles.headerAvatarText, { color: roleColors.text }]}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerName}>{userName}</Text>
                    {userRole ? (
                        <View style={[styles.headerBadge, { backgroundColor: roleColors.bg }]}>
                            <Text style={[styles.headerBadgeText, { color: roleColors.text }]}>{userRole}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={[styles.onlineDot, { backgroundColor: '#22c55e' }]} />
            </View>

            {/* Messages */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.backgroundMuted }}>
                    <ActivityIndicator color={THEME.primary} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    style={{ flex: 1, backgroundColor: THEME.backgroundMuted }}
                    data={messages}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderMessage}
                    contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyIcon}>👋</Text>
                            <Text style={styles.emptyTitle}>Say hello to {userName}!</Text>
                            <Text style={styles.emptySubtitle}>This is the beginning of your conversation.</Text>
                        </View>
                    }
                />
            )}

            {/* Input */}
            <View style={styles.inputBar}>
                <TextInput
                    style={styles.input}
                    placeholder={`Message ${userName}...`}
                    placeholderTextColor={THEME.textSecondary}
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={2000}
                    onSubmitEditing={Platform.OS === 'ios' ? handleSend : undefined}
                />
                <TouchableOpacity
                    style={[styles.sendBtn, { backgroundColor: text.trim() ? THEME.primary : THEME.backgroundMuted }]}
                    onPress={handleSend}
                    disabled={!text.trim() || sending}
                >
                    {sending
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <Text style={[styles.sendIcon, { color: text.trim() ? '#fff' : THEME.textMuted }]}>↑</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingTop: 56, paddingBottom: 14, paddingHorizontal: 16,
        backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: THEME.cardBorder,
    },
    backBtn: { marginRight: 4 },
    backText: { color: THEME.primary, fontSize: 15, fontWeight: '600' },
    headerAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    headerAvatarText: { fontWeight: '700', fontSize: 14 },
    headerName: { color: THEME.text, fontWeight: '700', fontSize: 16 },
    headerBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2 },
    headerBadgeText: { fontSize: 10, fontWeight: '600' },
    onlineDot: { width: 10, height: 10, borderRadius: 5 },

    msgRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end', gap: 8 },
    msgRowMe: { justifyContent: 'flex-end' },
    msgRowThem: { justifyContent: 'flex-start' },
    msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    msgAvatarText: { fontWeight: '700', fontSize: 11 },

    bubble: { maxWidth: '76%', borderRadius: 18, padding: 12 },
    bubbleMe: { backgroundColor: THEME.primary, borderBottomRightRadius: 4 },
    bubbleThem: { backgroundColor: THEME.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: THEME.cardBorder },
    bubbleFailed: { opacity: 0.6 },
    bubbleText: { fontSize: 15, lineHeight: 21 },
    bubbleTextMe: { color: '#fff' },
    bubbleTextThem: { color: THEME.text },
    bubbleTime: { fontSize: 10, marginTop: 4 },
    bubbleTimeMe: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
    bubbleTimeThem: { color: THEME.textSecondary },

    inputBar: {
        flexDirection: 'row', gap: 10, alignItems: 'flex-end',
        padding: 12, paddingBottom: 20,
        backgroundColor: THEME.background, borderTopWidth: 1, borderTopColor: THEME.cardBorder,
    },
    input: {
        flex: 1, backgroundColor: THEME.backgroundMuted, borderRadius: 22,
        paddingHorizontal: 16, paddingVertical: 10, color: THEME.text, fontSize: 15,
        borderWidth: 1, borderColor: THEME.inputBorder, maxHeight: 120,
    },
    sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    sendIcon: { fontSize: 20, fontWeight: '700' },

    emptyBox: { alignItems: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 48, marginBottom: 14 },
    emptyTitle: { color: THEME.text, fontWeight: '700', fontSize: 18, marginBottom: 8 },
    emptySubtitle: { color: THEME.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
});
