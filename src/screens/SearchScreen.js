import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  const handleQueryChange = (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResult(null);
      setSearched(false);
      setError(false);
    }
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    let cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return;

    // Normalize numeric queries (e.g. "025" -> "25") because PokéAPI returns 404 for IDs with leading zeros
    if (/^\d+$/.test(cleanQuery)) {
      cleanQuery = parseInt(cleanQuery, 10).toString();
    }

    setLoading(true);
    setError(false);
    setResult(null);
    setSearched(true);

    fetch(`https://pokeapi.co/api/v2/pokemon/${cleanQuery}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8A8D9F" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar por Nome ou ID..."
            placeholderTextColor="#8A8D9F"
            value={query}
            onChangeText={handleQueryChange}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleQueryChange('')}>
              <Ionicons name="close-circle" size={18} color="#8A8D9F" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.resultContainer}
        contentContainerStyle={styles.resultScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Loading message="Pesquisando na PokéAPI..." />
        ) : error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={64} color="#FF3F3F" />
            <Text style={styles.errorTitle}>Ops! Pokémon não encontrado</Text>
            <Text style={styles.errorSub}>
              Nenhum Pokémon encontrado para "{query}". Verifique a grafia ou o ID digitado!
            </Text>
          </View>
        ) : result ? (
          <View style={styles.cardWrapper}>
            <Text style={styles.resultHeading}>Resultado da Busca:</Text>
            <PokemonCard 
              name={result.name} 
              url={`https://pokeapi.co/api/v2/pokemon/${result.id}/`} 
              navigation={navigation}
            />
          </View>
        ) : searched ? (
          <View style={styles.infoBox}>
            <Ionicons name="search-outline" size={64} color="#C4C6D0" />
            <Text style={styles.infoTitle}>Nenhum resultado ainda</Text>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Ionicons name="search-outline" size={64} color="#C4C6D0" />
            <Text style={styles.infoTitle}>Busque por um Pokémon</Text>
            <Text style={styles.infoSub}>
              Digite o nome exato ou o ID numérico do Pokémon para visualizar seus detalhes.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEE',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E1E4EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2024',
    fontWeight: '600',
    height: '100%',
  },
  searchButton: {
    backgroundColor: '#FF3F3F',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  resultContainer: {
    flex: 1,
    paddingTop: 20,
  },
  resultScrollContent: {
    flexGrow: 1,
  },
  cardWrapper: {
    paddingHorizontal: 4,
  },
  resultHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#656A79',
    marginLeft: 16,
    marginBottom: 10,
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2024',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
    color: '#656A79',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#656A79',
    marginTop: 16,
    marginBottom: 8,
  },
  infoSub: {
    fontSize: 14,
    color: '#8A8D9F',
    textAlign: 'center',
    lineHeight: 20,
  },
});
