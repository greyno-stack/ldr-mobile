import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePairingStore } from '../../store/usePairingStore';

export default function Partner() {
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
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner</Text>

      {paired ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your pairing</Text>
          <Text style={styles.cardSubtitle}>{partner?.fullName}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff', gap: 16 },
  title: { fontSize: 22, fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    gap: 8,
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