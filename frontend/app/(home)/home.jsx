// app/(home)/home.jsx
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';

export default function Home() {
  const { authUser } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Welcome back{authUser?.fullName ? `, ${authUser.fullName}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  greeting: { fontSize: 22, fontWeight: '600' },
});