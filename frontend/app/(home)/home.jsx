import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useCountdownStore } from '../../store/useCountdownStore';
import CountdownCard from '../../components/Countdown/CountdownCard';
import AddCountdownButton from '../../components/Countdown/AddCountdownButton';

export default function Home() {
  const { authUser } = useAuthStore();
  const { countdown, getCountdown, createCountdown } = useCountdownStore();

  useEffect(() => {
    getCountdown();
  }, []);

  const handleAddCountdown = () => {
    // placeholder for now — next step is a date picker modal
    createCountdown({
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Welcome back{authUser?.fullName ? `, ${authUser.fullName}` : ''}
      </Text>

      {countdown ? (
        <CountdownCard countdown={countdown} />
      ) : (
        <AddCountdownButton onPress={handleAddCountdown} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff', gap: 20 },
  greeting: { fontSize: 22, fontWeight: '600' },
});