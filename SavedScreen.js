import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Linking, Alert
} from 'react-native';
import {
  collection, query, where,
  onSnapshot, deleteDoc, doc
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

export default function SavedScreen() {
  const { user, userProfile } = useAuth();
  const [saved, setSaved] = useState([]);
  const [recent, setRecent] = useState([]);

  // Ambil favorit dari Firestore (realtime)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'savedRepos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSaved(items);
    });
    return unsubscribe;
  }, [user]);

  // Ambil riwayat dari AsyncStorage (lokal HP)
  useEffect(() => {
    AsyncStorage.getItem('recentRepos').then((data) => {
      if (data) setRecent(JSON.parse(data));
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'savedRepos', id));
    } catch (err) {
      Alert.alert('Gagal menghapus', err.message);
    }
  };

  return (
    <View style={styles.container}>

      {/* Info profil user dari Firestore */}
      {userProfile && (
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>👤 {userProfile.displayName}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>
      )}

      <Text style={styles.section}>⭐ Repository Favorit (Firestore)</Text>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text
              style={styles.cardTitle}
              onPress={() => Linking.openURL(item.url)}
            >
              {item.fullName}
            </Text>
            {item.note ? (
              <Text style={styles.note}>📝 {item.note}</Text>
            ) : null}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>🗑 Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada repo favorit.</Text>
        }
      />

      <Text style={styles.section}>🕒 Riwayat Dilihat (Lokal HP)</Text>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardSmall}>
            <Text>{item.full_name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada riwayat.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  profileCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  profileName: { fontWeight: 'bold', fontSize: 16 },
  profileEmail: { color: '#666', marginTop: 2 },
  section: { fontWeight: 'bold', fontSize: 16, marginVertical: 8 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  cardSmall: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  cardTitle: { fontWeight: 'bold', color: '#0066cc' },
  note: { color: '#555', marginTop: 4 },
  delete: { color: 'red', marginTop: 8 },
  empty: { color: '#888', fontStyle: 'italic', marginBottom: 16 },
});