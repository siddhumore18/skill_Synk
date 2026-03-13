import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
    ActivityIndicator, Alert, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { authAPI } from '../services/api';
import { THEME } from '../theme';

const ROLES = [
    { value: 'entrepreneur', label: '🚀 Entrepreneur', color: THEME.roles.entrepreneur.primary },
    { value: 'investor', label: '💼 Investor', color: THEME.roles.investor.primary },
    { value: 'freelancer', label: '⚡ Freelancer', color: THEME.roles.freelancer.primary },
];

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async () => {
        if (!email) { Alert.alert('Error', 'Email is required'); return; }
        if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
        if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
        if (!role) { Alert.alert('Error', 'Please select a role'); return; }
        setIsLoading(true);
        try {
            const res = await authAPI.register(email.trim(), password, name || email.split('@')[0], role);
            Alert.alert(
                res.development ? `OTP (Dev): ${res.otp}` : 'OTP Sent',
                res.development ? `Your OTP: ${res.otp}` : 'Check your email for the OTP.'
            );
            navigation.navigate('OTP', { email: email.trim(), password, devOTP: res.otp || null });
        } catch (err) {
            Alert.alert('Registration failed', err.message || 'Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: THEME.backgroundMuted }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.logoRow}>
                    <Text style={styles.logoIcon}>◇</Text>
                    <Text style={styles.logoText}>SkillSync</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Create your account</Text>
                    <Text style={styles.subtitle}>Enter your details to get started</Text>

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor={THEME.textSecondary} value={name} onChangeText={setName} editable={!isLoading} />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput style={styles.input} placeholder="m@example.com" placeholderTextColor={THEME.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />

                    <Text style={styles.label}>Role *</Text>
                    <View style={styles.roleContainer}>
                        {ROLES.map((r) => {
                            const active = role === r.value;
                            return (
                                <TouchableOpacity
                                    key={r.value}
                                    style={[styles.roleChip, active && { backgroundColor: r.color, borderColor: r.color }]}
                                    onPress={() => setRole(r.value)}
                                >
                                    <Text style={[styles.roleChipText, active && styles.roleChipActiveText]}>{r.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.label}>Password *</Text>
                    <View style={styles.passwordRow}>
                        <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Min 6 characters" placeholderTextColor={THEME.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPass} editable={!isLoading} />
                        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                            <Text style={{ fontSize: 17 }}>{showPass ? '🙈' : '👁'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirm Password *</Text>
                    <TextInput style={styles.input} placeholder="Re-enter password" placeholderTextColor={THEME.textSecondary} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPass} editable={!isLoading} />

                    <TouchableOpacity style={[styles.primaryBtn, isLoading && styles.disabledBtn]} onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
                    </TouchableOpacity>

                    <View style={styles.linkRow}>
                        <Text style={styles.linkText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: THEME.backgroundMuted, padding: 24, paddingTop: 60 },
    back: { marginBottom: 20 },
    backText: { color: THEME.textMuted, fontSize: 15 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
    logoIcon: { fontSize: 22, color: THEME.primary },
    logoText: { fontSize: 19, fontWeight: '700', color: THEME.text },

    card: { backgroundColor: THEME.card, borderRadius: THEME.radiusLg, padding: 24, borderWidth: 1, borderColor: THEME.cardBorder, ...require('../theme').SHADOW.sm },
    title: { fontSize: 24, fontWeight: '800', color: THEME.text, marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 14, color: THEME.textMuted, marginBottom: 20, textAlign: 'center' },

    label: { fontSize: 13, fontWeight: '600', color: THEME.text, marginBottom: 6 },
    input: {
        backgroundColor: THEME.background, borderRadius: THEME.radius, borderWidth: 1, borderColor: THEME.inputBorder,
        color: THEME.text, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, marginBottom: 14,
    },
    roleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    roleChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: THEME.inputBorder, backgroundColor: THEME.background },
    roleChipText: { color: THEME.textMuted, fontWeight: '600', fontSize: 13 },
    roleChipActiveText: { color: '#fff' },
    passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
    eyeBtn: { padding: 8 },

    primaryBtn: { backgroundColor: THEME.primary, borderRadius: THEME.radius, paddingVertical: 13, alignItems: 'center', marginTop: 8, marginBottom: 18 },
    disabledBtn: { opacity: 0.6 },
    primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    linkRow: { flexDirection: 'row', justifyContent: 'center' },
    linkText: { color: THEME.textMuted, fontSize: 14 },
    link: { color: THEME.primary, fontSize: 14, fontWeight: '600' },
});
