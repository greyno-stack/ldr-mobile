// app/(auth)/verify-email.jsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/useAuthStore';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmail() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const { verifyEmail, resendCode, isVerifying, isResending } = useAuthStore();

  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (!email) {
      router.replace('/sign-up');
    }
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (value = code) => {
    if (isVerifying) return;
    if (value.length !== CODE_LENGTH) {
      Toast.show({ type: 'error', text1: `Enter the ${CODE_LENGTH}-digit code` });
      return;
    }

    const success = await verifyEmail({ email, code: value });
    if (success) {
      router.replace('/home');
    } else {
      setCode('');
    }
  };

  const handleChangeCode = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) {
      handleVerify(digits);
    }
  };

  const handleResend = async () => {
    const { success, retryAfterSeconds } = await resendCode(email);
    if (success) {
      setCode('');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } else if (retryAfterSeconds) {
      setCooldown(retryAfterSeconds);
    }
  };

  const canResend = cooldown <= 0 && !isResending;

  return (
    <ImageBackground
      source={require('../../assets/images/stargazer.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#475569" />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>LDR</Text>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Verification code</Text>
          <TextInput
            placeholder="000000"
            value={code}
            onChangeText={handleChangeCode}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            autoFocus
            style={styles.codeInput}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, (isVerifying || code.length !== CODE_LENGTH) && styles.disabledButton]}
          onPress={() => handleVerify()}
          disabled={isVerifying || code.length !== CODE_LENGTH}
        >
          <Text style={styles.primaryButtonText}>
            {isVerifying ? 'Verifying…' : 'Verify email'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleResend} disabled={!canResend}>
          <Text style={[styles.resendText, canResend && styles.resendTextActive]}>
            {isResending
              ? 'Sending…'
              : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Didn't get a code? Resend"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
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
  email: { fontSize: 14, fontWeight: '600', color: '#959fb4', marginTop: 2 },
  form: { marginTop: 'auto' },
  label: { fontSize: 12, color: '#475569', marginBottom: 6 },
  codeInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 10,
    textAlign: 'center',
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
  resendButton: { alignItems: 'center', marginTop: 20, paddingVertical: 8 },
  resendText: { fontSize: 13, color: '#475569' },
  resendTextActive: { color: '#378ADD', fontWeight: '600' },
});
