import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

// =======================================================
// FITUR 1 (Axios) - Anggota 1: API & Network Specialist
// Mengambil data repository GitHub bertema robotika
// menggunakan GitHub Search API (publik, tidak perlu API key)
// =======================================================
export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('robotics');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const searchRepos = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: searchTerm,
          sort: 'stars',
          order: 'desc',
          per_page: 20,
        },
        timeout: 10000, // contoh handling timeout
      });
      setRepos(response.data.items);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Coba lagi.');
      } else {
        setError('Gagal mengambil data. Periksa koneksi internet kamu.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchRepos(query);
  }, []);

  // Simpan repo yang baru dibuka ke AsyncStorage (state lokal) -> riwayat dilihat
  const openDetail = async (item) => {
    try {
      const recent = await AsyncStorage.getItem('recentRepos');
      let list = recent ? JSON.parse(recent) : [];
      list = [item, ...list.filter((r) => r.id !== item.id)].slice(0, 10);
      await AsyncStorage.setItem('recentRepos', JSON.stringify(list));
    } catch (e) {
      // gagal simpan lokal tidak perlu menghentikan navigasi
    }
    navigation.navigate('Detail', { repo: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🤖 Jelajahi Project Robotika</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Cari repo robotika..."
          onSubmitEditing={() => searchRepos(query)}
        />
        <Button title="Cari" onPress={() => searchRepos(query)} />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={repos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openDetail(item)}>
            <Text style={styles.cardTitle}>{item.full_name}</Text>
            <Text numberOfLines={2} style={styles.cardDesc}>
              {item.description || 'Tidak ada deskripsi'}
            </Text>
            <Text style={styles.stars}>⭐ {item.stargazers_count}  |  {item.language || '-'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>Tidak ada hasil. Coba kata kunci lain.</Text>
        }
      />

      <Button title="Logout" onPress={logout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  searchRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardDesc: { color: '#555', marginTop: 4 },
  stars: { marginTop: 6, color: '#888', fontSize: 12 },
  error: { color: 'red', textAlign: 'center', marginVertical: 8 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
});
