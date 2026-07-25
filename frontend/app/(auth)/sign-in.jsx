import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput placeholder="��������" secureTextEntry style={styles.input} />
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Need an account?{' '}
        <Link href="/sign-up" style={styles.footerLink}>Sign up</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 28 },
  form: { width: '100%' },
  field: { marginBottom: 16 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f9fafb',
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { marginTop: 28, textAlign: 'center', color: '#6b7280', fontSize: 13 },
  footerLink: { color: '#2563eb', fontWeight: '700' },
});
