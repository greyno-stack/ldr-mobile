import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePairingStore } from '../../store/usePairingStore';
import { useAuthStore } from '../../store/useAuthStore';
import ScreenBackground from '../../components/ScreenBackground';

export default function Partner() {
  const { authUser } = useAuthStore();
  const {
    paired, partner, isLoadingStatus,
    inviteCode, isLoadingInvite,
    isJoining,
    getStatus, getInviteCode, joinWithCode,
  } = usePairingStore();

  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    getStatus();
  }, []);

  useEffect(() => {
    if (!isLoadingStatus && !paired && !inviteCode) {
      getInviteCode();
    }
  }, [isLoadingStatus, paired]);

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    joinWithCode(joinCode.trim().toUpperCase());
  };

  if (isLoadingStatus) {
    return (
      <ScreenBackground style={styles.container}>
        <ActivityIndicator />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <Text style={styles.title}>Partner</Text>

      {paired ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your pairing</Text>
          <Text style={styles.cardSubtitle}>{authUser?.username} and {partner?.username}</Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your invite code</Text>
            {isLoadingInvite ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.code}>{inviteCode}</Text>
            )}
            <Text style={styles.cardHint}>Share this with your partner</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Have a code?</Text>
            <TextInput
              placeholder="Enter partner's code"
              value={joinCode}
              onChangeText={setJoinCode}
              autoCapitalize="characters"
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.joinButton, isJoining && styles.disabledButton]}
              onPress={handleJoin}
              disabled={isJoining}
            >
              <Text style={styles.joinButtonText}>
                {isJoining ? 'Joining…' : 'Pair up'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, gap: 16 },
  title: {
    fontSize: 22,
    fontWeight: '600',
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
  cardHint: { fontSize: 12, color: '#8a8a8a' },
  code: { fontSize: 28, fontWeight: '700', letterSpacing: 2 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  joinButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#378ADD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.6 },
  joinButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});