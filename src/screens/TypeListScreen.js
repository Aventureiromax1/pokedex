import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';

export default function TypeListScreen({ route, navigation }) {
  const { typeName } = route.params || {};
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPokemonByType = () => {
    if (!typeName) return;
    setLoading(true);
    setError(false);

    fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        // Map data.pokemon array to fit the format required by PokemonCard
        const mappedList = data.pokemon.map((p) => ({
          name: p.pokemon.name,
          url: p.pokemon.url,
        }));
        setPokemonList(mappedList);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPokemonByType();
  }, [typeName]);

  if (loading) {
    return <Loading message={`Buscando Pokémons do tipo ${typeName}...`} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar Pokémons do tipo {typeName}.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchPokemonByType}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <PokemonCard name={item.name} url={item.url} navigation={navigation} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum Pokémon deste tipo encontrado.</Text>
          </View>
        }
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
    paddingVertical: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#656A79',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
