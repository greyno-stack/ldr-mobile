import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function SignIn() {
  const { login, isLoggingIn } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const success = await login({ email, password });
    if (success) {
      router.replace('/home');
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/images/stargazer.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>LDR</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton}
          style={[styles.primaryButton, isLoggingIn && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={isLoggingIn}
        >
          <Text style={styles.primaryButtonText}>
            {isLoggingIn ? 'Signing in…' : 'Sign in'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Need an account?{' '}
          <Link href="/sign-up" style={styles.footerLink}>Sign up</Link>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  disabledButton: { opacity: 0.6 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  backgroundImageStyle: { resizeMode: 'cover' },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  header: { alignItems: 'center', marginBottom: 20 },
  appTitle: { fontSize: 32, fontWeight: '700', marginBottom: 8, color: '#a5adc2', letterSpacing: 1.5 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 4, color: '#959fb4' },
  subtitle: { fontSize: 14, color: '#475569' },
  form: { gap: 14, marginTop: 'auto' },
  field: {},
  label: { fontSize: 12, color: '#475569', marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  primaryButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#378ADD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 20, paddingTop: 8 },
  footerLink: { color: '#378ADD', fontWeight: '600' },
});
