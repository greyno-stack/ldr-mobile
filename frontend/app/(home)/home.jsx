import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/useAuthStore';
import { useCountdownStore } from '../../store/useCountdownStore';
import { usePairingStore } from '../../store/usePairingStore';
import ScreenBackground from '../../components/ScreenBackground';
import CountdownCard from '../../components/Countdown/CountdownCard';
import AddCountdownButton from '../../components/Countdown/AddCountdownButton';

export default function Home() {
  const { authUser } = useAuthStore();
  const { countdown, getCountdown, createCountdown } = useCountdownStore();
  const { paired, getStatus } = usePairingStore();

  useEffect(() => {
    getStatus();
  }, []);

  useEffect(() => {
    if (paired) {
      getCountdown();
    }
  }, [paired]);

  const handleAddCountdown = () => {
    if (!paired) {
      Toast.show({ type: 'error', text1: 'Unable to add countdown, find a partner first' });
      return;
    }
    // placeholder for now — next step is a date picker modal
    createCountdown({
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  return (
    <ScreenBackground style={styles.container}>
      <Text style={styles.greeting}>
        Welcome back{authUser?.username ? `, ${authUser.username}` : ''}
      </Text>

      {countdown ? (
        <CountdownCard countdown={countdown} />
      ) : (
        <AddCountdownButton onPress={handleAddCountdown} />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, gap: 20 },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});