import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
    ActivityIndicator, Alert, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) { Alert.alert('Missing fields', 'Please enter your email and password.'); return; }
        setIsLoading(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            Alert.alert('Login failed', err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: THEME.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.subtitle}>please enter your details to continue</Text>

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input} placeholder="m@example.com" placeholderTextColor={THEME.textSecondary}
                        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!isLoading}
                    />

                    <View style={styles.pwLabelRow}>
                        <Text style={styles.label}>Password</Text>
                        <TouchableOpacity><Text style={styles.forgotText}>Forgot your password?</Text></TouchableOpacity>
                    </View>
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="••••••••" placeholderTextColor={THEME.textSecondary}
                            value={password} onChangeText={setPassword} secureTextEntry={!showPassword} editable={!isLoading}
                        />
                        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.primaryBtn, isLoading && styles.disabledBtn]} onPress={handleLogin} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Login</Text>}
                    </TouchableOpacity>

                    <View style={styles.linkRow}>
                        <Text style={styles.linkText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.link}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.terms}>
                    By clicking continue, you agree to our{' '}
                    <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
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

    card: { backgroundColor: THEME.card, borderRadius: THEME.radiusLg, padding: 24, borderWidth: 1, borderColor: THEME.cardBorder, marginBottom: 16, ...require('../theme').SHADOW.sm },
    title: { fontSize: 24, fontWeight: '800', color: THEME.text, marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 14, color: THEME.textMuted, marginBottom: 20, textAlign: 'center' },

    label: { fontSize: 13, fontWeight: '600', color: THEME.text, marginBottom: 6 },
    input: {
        backgroundColor: THEME.background, borderRadius: THEME.radius, borderWidth: 1, borderColor: THEME.inputBorder,
        color: THEME.text, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, marginBottom: 14,
    },
    pwLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    forgotText: { color: THEME.primary, fontSize: 13 },
    passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
    eyeBtn: { padding: 8 },
    eyeText: { fontSize: 17 },

    primaryBtn: { backgroundColor: THEME.primary, borderRadius: THEME.radius, paddingVertical: 13, alignItems: 'center', marginBottom: 18 },
    disabledBtn: { opacity: 0.6 },
    primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    linkRow: { flexDirection: 'row', justifyContent: 'center' },
    linkText: { color: THEME.textMuted, fontSize: 14 },
    link: { color: THEME.primary, fontSize: 14, fontWeight: '600' },
    terms: { color: THEME.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
