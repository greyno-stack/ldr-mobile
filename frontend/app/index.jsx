import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const { authUser } = useAuthStore();

  return <Redirect href={authUser ? '/home' : '/sign-in'} />;
}