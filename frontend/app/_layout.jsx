// app/_layout.jsx
import { Slot } from 'expo-router';
import SafeScreen from '../components/SafeScreen';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <SafeScreen>
      <Slot />
      <Toast />
    </SafeScreen>
  );
}

