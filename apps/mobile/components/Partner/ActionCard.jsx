import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActionCard({ icon, iconColor = '#3D2C5F', title, description, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      <Ionicons name="chevron-forward" size={20} color="#a8a2b8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(244,243,247,0.95)',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(61,44,95,0.1)',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#241b33',
  },
  description: {
    fontSize: 12.5,
    color: '#726c80',
  },
});
