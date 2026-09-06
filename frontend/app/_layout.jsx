// app/_layout.jsx
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import SafeScreen from '../components/SafeScreen';
import Toast from 'react-native-toast-message';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const content = (
    <SafeScreen>
      {isCheckingAuth ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <Slot />
      )}
      <Toast />
    </SafeScreen>
  );

  if (Platform.OS === 'web') {
    return <View style = {styles.webWrapper}>{content}</View>;
  }

  return content;
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    maxWidth: 430,
    marginHorizontal: 'auto',
    width: '100%',
    height: '100vh',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});