// app/(auth)/_layout.jsx
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';

export default function AuthLayout() {
  const { authUser } = useAuthStore();

  if (authUser) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}