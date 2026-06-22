import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Perhatian', 'Nama, email, dan password wajib diisi');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Perhatian', 'Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    try {
      // Kirim displayName ke fungsi register yang sudah diupdate
      await register(email, password, name);
      // Setelah berhasil, AuthContext otomatis update -> App.js pindah ke MainTabs
    } catch (error) {
      Alert.alert('Registrasi gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Buat Akun RoboHub</Text>
      <Text style={styles.subtitle}>Data kamu akan tersimpan di Firebase</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min. 6 karakter)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? 'Menyimpan...' : 'Daftar'}
        onPress={handleRegister}
        disabled={loading}
      />

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Sudah punya akun? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  link: { marginTop: 16, color: '#0066cc', textAlign: 'center' },
});