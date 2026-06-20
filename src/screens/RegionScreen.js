import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';

const REGIONS = [
  { name: 'Kanto', offset: 0, limit: 151 },
  { name: 'Johto', offset: 151, limit: 100 },
  { name: 'Hoenn', offset: 251, limit: 135 },
  { name: 'Sinnoh', offset: 386, limit: 107 },
  { name: 'Unova', offset: 493, limit: 156 },
  { name: 'Kalos', offset: 649, limit: 72 },
];

export default function RegionScreen({ navigation }) {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${selectedRegion.limit}&offset=${selectedRegion.offset}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPokemonList(data.results);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedRegion]);

  const handleRetry = () => {
    // Force a re-fetch by setting the selected region object to a new reference
    setSelectedRegion({ ...selectedRegion });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectorContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {REGIONS.map((region) => {
            const isSelected = region.name === selectedRegion.name;
            return (
              <TouchableOpacity
                key={region.name}
                style={[
                  styles.regionBtn,
                  isSelected && styles.regionBtnActive
                ]}
                onPress={() => setSelectedRegion(region)}
              >
                <Text style={[
                  styles.regionText,
                  isSelected && styles.regionTextActive
                ]}>
                  {region.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <Loading message={`Carregando região ${selectedRegion.name}...`} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ocorreu um erro ao carregar os Pokémons.</Text>
          <TouchableOpacity 
            style={styles.retryBtn} 
            onPress={handleRetry}
          >
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <PokemonCard name={item.name} url={item.url} navigation={navigation} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  selectorContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEE',
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  regionBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: '#F0F2F5',
    borderWidth: 1,
    borderColor: '#E1E4EB',
  },
  regionBtnActive: {
    backgroundColor: '#FF3F3F',
    borderColor: '#FF3F3F',
  },
  regionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#656A79',
  },
  regionTextActive: {
    color: '#FFFFFF',
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
    fontSize: 14,
  },
});
