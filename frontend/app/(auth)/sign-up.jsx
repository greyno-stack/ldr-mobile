// app/(auth)/sign-up.jsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
  const { signup, isSigningUp } = useAuthStore();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: "Passwords don't match" });
      return;
    }

    signup({ username: fullName, email, password });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/stargazer.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#475569" />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>LDR</Text>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              placeholder="Your full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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

          <View style={styles.field}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSigningUp && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={isSigningUp}
        >
          <Text style={styles.primaryButtonText}>
            {isSigningUp ? 'Creating account…' : 'Create account'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already have an account?{' '}
          <Link href="/sign-in" style={styles.footerLink}>Sign in</Link>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  primaryButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#378ADD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 20, paddingTop: 8 },
  footerLink: { color: '#378ADD', fontWeight: '600' },
});