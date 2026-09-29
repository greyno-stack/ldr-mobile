import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoteCard({ note, onDismiss }) {
  if (!note) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>A note from {note.sender?.username ?? 'your partner'}</Text>
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={18} color="#8a8a8a" />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{note.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  label: { fontSize: 13, color: '#8a8a8a', flex: 1 },
  text: { fontSize: 16, fontWeight: '500', color: '#241b33' },
});
