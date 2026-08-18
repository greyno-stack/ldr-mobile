// app/_layout.jsx
import { Slot } from 'expo-router';
import SafeScreen from '../components/SafeScreen';
import Toast from 'react-native-toast-message';
import { View, StyleSheet, Platform } from 'react-native';

export default function RootLayout() {
  const content = (
    <SafeScreen>
      <Slot />
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
});