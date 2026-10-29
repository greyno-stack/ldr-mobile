import { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/useAuthStore';
import { useCountdownStore } from '../../store/useCountdownStore';
import { usePairingStore } from '../../store/usePairingStore';
import { useNoteStore } from '../../store/useNoteStore';
import ScreenBackground from '../../components/ScreenBackground';
import CountdownCard from '../../components/Countdown/CountdownCard';
import AddCountdownButton from '../../components/Countdown/AddCountdownButton';
import SetCountdownModal from '../../components/Countdown/SetCountdownModal';
import NoteCard from '../../components/Home/NoteCard';

export default function Home() {
  const { authUser } = useAuthStore();
  const { countdown, getCountdown, createCountdown, deleteCountdown, isCreating } = useCountdownStore();
  const { paired, getStatus } = usePairingStore();
  const { notes, getNotes, dismissNote } = useNoteStore();

  const [countdownModalVisible, setCountdownModalVisible] = useState(false);

  useEffect(() => {
    getStatus();
  }, []);

  useEffect(() => {
    if (paired) {
      getCountdown();
      getNotes();
    }
  }, [paired]);

  const handleAddCountdown = () => {
    if (!paired) {
      Toast.show({ type: 'error', text1: 'Unable to add countdown, find a partner first' });
      return;
    }
    setCountdownModalVisible(true);
  };

  const handleSetCountdown = async (durationMs) => {
    const success = await createCountdown({
      targetDate: new Date(Date.now() + durationMs).toISOString(),
    });
    if (success) {
      setCountdownModalVisible(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          Welcome back{authUser?.username ? `, ${authUser.username}` : ''}
        </Text>

        {countdown ? (
          <CountdownCard countdown={countdown} onDelete={deleteCountdown} />
        ) : (
          <AddCountdownButton onPress={handleAddCountdown} />
        )}

        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDismiss={() => dismissNote(note.id)} />
        ))}
      </ScrollView>

      <SetCountdownModal
        visible={countdownModalVisible}
        onClose={() => setCountdownModalVisible(false)}
        onSet={handleSetCountdown}
        setting={isCreating}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 32, gap: 20 },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
