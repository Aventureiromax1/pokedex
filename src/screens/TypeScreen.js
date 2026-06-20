import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { getTypeColor } from '../utils/colors';
import Loading from '../components/Loading';

export default function TypeScreen({ navigation }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTypes = () => {
    setLoading(true);
    setError(false);
    fetch('https://pokeapi.co/api/v2/type')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        // Exclude special/unknown/shadow types
        const filteredTypes = data.results.filter(
          (t) => t.name !== 'unknown' && t.name !== 'shadow'
        );
        setTypes(filteredTypes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  if (loading) {
    return <Loading message="Carregando tipos..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar tipos de Pokémon.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchTypes}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={types}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item }) => {
          const typeColor = getTypeColor(item.name);
          const capitalizedName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
          return (
            <TouchableOpacity
              style={[styles.typeCard, { backgroundColor: typeColor }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('TypeList', { typeName: item.name })}
            >
              <View style={styles.pokeballOutline} />
              <Text style={styles.typeText}>{capitalizedName}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 10,
  },
  typeCard: {
    flex: 1,
    height: 100,
    margin: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  pokeballOutline: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    right: -20,
    bottom: -20,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3F3F',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#FF3F3F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
