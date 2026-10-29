import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddCountdownButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.box} onPress={onPress}>
      <Ionicons name="add" size={22} color="#8a8a8a" />
      <Text style={styles.text}>Add a countdown</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  text: {
    fontSize: 14,
    color: '#8a8a8a',
    fontWeight: '500',
  },
});