import { View, Text, StyleSheet } from 'react-native';

const STATUS_CONFIG = {
  online: { color: '#3ecf72', label: 'Online' },
  away: { color: '#f5b942', label: 'Away' },
  offline: { color: '#8a80a0', label: 'Offline' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
