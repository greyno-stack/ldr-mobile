import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';

export default function Settings() {
  const { logout, authUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(authUser?.fullName ?? authUser?.username);
    router.replace('/sign-in');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24 },
  logoutButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0393e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { color: '#e0393e', fontSize: 15, fontWeight: '600' },
});