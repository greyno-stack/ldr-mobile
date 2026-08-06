// app/(home)/partner.jsx
import { View, Text, StyleSheet } from 'react-native';

export default function Partner() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your pairing</Text>
        <Text style={styles.cardSubtitle}>Not paired yet</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24 },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: { fontSize: 14, color: '#8a8a8a', marginBottom: 4 },
  cardSubtitle: { fontSize: 16, fontWeight: '500' },
});