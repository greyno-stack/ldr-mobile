import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../../components/ScreenBackground';
import { usePairingStore } from '../../store/usePairingStore';
import { useAuthStore } from '../../store/useAuthStore';

function formatTogetherDuration(since) {
  const start = new Date(since).getTime();
  const now = Date.now();
  const totalDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

  if (totalDays < 1) return 'Together since today';

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays - years * 365 - months * 30;

  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  if (!years && days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);

  return `Together for ${parts.join(', ')}`;
}

export default function Profile() {
  const router = useRouter();
  const { authUser } = useAuthStore();
  const { paired, partner, since, getStatus } = usePairingStore();

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <ScreenBackground style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {paired && since ? (
        <Text style={styles.duration}>{formatTogetherDuration(since)}</Text>
      ) : null}

      {paired ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your pairing</Text>
          <Text style={styles.cardSubtitle}>{authUser?.username} and {partner?.username}</Text>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, gap: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  duration: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cardTitle: { fontSize: 14, color: '#8a8a8a' },
  cardSubtitle: { fontSize: 16, fontWeight: '500' },
});
