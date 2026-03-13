import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar
} from 'react-native';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../theme';

export default function OTPScreen({ navigation, route }) {
    const { email, password, devOTP } = route.params || {};
    const [otp, setOtp] = useState(devOTP || '');
    const [isLoading, setIsLoading] = useState(false);
    const { signupAndVerify } = useAuth();

    const handleVerify = async () => {
        if (!otp || otp.length < 4) { Alert.alert('Invalid OTP', 'Enter the OTP sent to your email.'); return; }
        setIsLoading(true);
        try {
            const res = await authAPI.verifyOTP(email, otp, password);
            if (res.success) { await signupAndVerify(res.user); }
            else { Alert.alert('Failed', 'Invalid or expired OTP.'); }
        } catch (err) {
            Alert.alert('Error', err.message || 'Verification failed');
        } finally { setIsLoading(false); }
    };

    const handleResend = async () => {
        try {
            const res = await authAPI.resendOTP(email);
            Alert.alert('OTP Resent', res.development ? `New OTP: ${res.otp}` : 'Check your email.');
        } catch (err) {
            Alert.alert('Error', err.message || 'Could not resend OTP');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.backgroundMuted} />
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.iconBadge}>
                <Text style={styles.iconText}>✉️</Text>
            </View>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
                We sent a 6-digit code to{'\n'}
                <Text style={styles.emailText}>{email}</Text>
            </Text>
            <TextInput
                style={styles.otpInput} placeholder="000000" placeholderTextColor={THEME.textSecondary}
                value={otp} onChangeText={setOtp} keyboardType="numeric" maxLength={6} textAlign="center" editable={!isLoading}
            />
            <TouchableOpacity style={[styles.primaryBtn, isLoading && styles.disabledBtn]} onPress={handleVerify} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify & Continue</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
                <Text style={styles.resendText}>Didn't receive it? </Text>
                <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.backgroundMuted, padding: 24, paddingTop: 60, alignItems: 'center' },
    back: { alignSelf: 'flex-start', marginBottom: 40 },
    backText: { color: THEME.textMuted, fontSize: 15 },
    iconBadge: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: THEME.card,
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        borderWidth: 1, borderColor: THEME.cardBorder, ...require('../theme').SHADOW.sm,
    },
    iconText: { fontSize: 32 },
    title: { fontSize: 26, fontWeight: '800', color: THEME.text, marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 15, color: THEME.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    emailText: { color: THEME.text, fontWeight: '600' },
    otpInput: {
        width: '100%', backgroundColor: THEME.card, borderRadius: THEME.radiusLg,
        borderWidth: 1, borderColor: THEME.inputBorder, color: THEME.text,
        paddingVertical: 16, fontSize: 28, fontWeight: '700', letterSpacing: 10, marginBottom: 20,
        ...require('../theme').SHADOW.sm,
    },
    primaryBtn: { width: '100%', backgroundColor: THEME.primary, borderRadius: THEME.radius, paddingVertical: 13, alignItems: 'center', marginBottom: 18 },
    disabledBtn: { opacity: 0.6 },
    primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    resendBtn: { flexDirection: 'row', alignItems: 'center' },
    resendText: { color: THEME.textMuted, fontSize: 14 },
    resendLink: { color: THEME.primary, fontSize: 14, fontWeight: '600' },
});
