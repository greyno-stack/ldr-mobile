import { View, Text, StyleSheet } from 'react-native';

export default function CountdownCard({ countdown }) {
  const { targetDate, createdAt, title } = countdown;

  const target = new Date(targetDate).getTime();
  const created = new Date(createdAt).getTime();
  const now = Date.now();

  const daysRemaining = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

  const totalDuration = target - created;
  const elapsed = now - created;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <Text style={styles.days}>
        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 13,
    color: '#8a8a8a',
  },
  days: {
    fontSize: 28,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#eef0f2',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#378ADD',
    borderRadius: 4,
  },
});