import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, Linking, ScrollView } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

// =======================================================
// FITUR 2 (Axios + UI) - Anggota 1
// Menampilkan detail data yang sudah diambil via Axios
// =======================================================
// FITUR 3 (Firestore) - Anggota 2: Cloud Database Specialist
// Menyimpan repo favorit + catatan ke Cloud Firestore
// =======================================================
export default function DetailScreen({ route }) {
  const { repo } = route.params;
  const { user } = useAuth();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await addDoc(collection(db, 'savedRepos'), {
        userId: user.uid,
        repoId: repo.id,
        fullName: repo.full_name,
        url: repo.html_url,
        description: repo.description || '',
        stars: repo.stargazers_count,
        note: note,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Berhasil', 'Repository disimpan ke Favorit');
      setNote('');
    } catch (err) {
      Alert.alert('Gagal menyimpan', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{repo.full_name}</Text>
      <Text style={styles.desc}>{repo.description || 'Tidak ada deskripsi'}</Text>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>⭐ {repo.stargazers_count}</Text>
        <Text style={styles.stat}>🍴 {repo.forks_count}</Text>
        <Text style={styles.stat}>🐞 {repo.open_issues_count}</Text>
      </View>

      <Text style={styles.meta}>Bahasa utama: {repo.language || '-'}</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(repo.html_url)}>
        🔗 Buka di GitHub
      </Text>

      <Text style={styles.label}>Catatan pribadi:</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Tulis catatan kamu tentang repo ini..."
        value={note}
        onChangeText={setNote}
        multiline
      />
      <Button
        title={saving ? 'Menyimpan...' : 'Simpan ke Favorit'}
        onPress={handleSave}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  desc: { marginBottom: 12, color: '#444' },
  statsRow: { flexDirection: 'row', marginBottom: 8 },
  stat: { marginRight: 16, color: '#666' },
  meta: { marginBottom: 4, color: '#666' },
  link: { color: '#0066cc', marginVertical: 8 },
  label: { marginTop: 16, fontWeight: 'bold' },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    marginVertical: 8,
    textAlignVertical: 'top',
  },
});
