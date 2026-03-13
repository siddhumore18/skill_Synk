import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function KPICard({ icon, label, value, subtitle, accentColor = '#8b5cf6' }) {
    return (
        <View style={[styles.card, { borderLeftColor: accentColor }]}>
            <View style={styles.top}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16,
        borderLeftWidth: 3, flex: 1, minWidth: 100,
    },
    top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 12, color: '#8888aa', fontWeight: '600', flex: 1 },
    icon: { fontSize: 18 },
    value: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 11, color: '#555570' },
});
