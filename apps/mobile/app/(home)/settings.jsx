import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import ScreenBackground from '../../components/ScreenBackground';

export default function Settings() {
  const { logout, authUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(authUser?.fullName ?? authUser?.username);
    router.replace('/sign-in');
  };

  return (
    <ScreenBackground style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  logoutButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0393e',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  logoutText: { color: '#e0393e', fontSize: 15, fontWeight: '600' },
});
