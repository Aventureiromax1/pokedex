import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { getTypeColor } from '../utils/colors';

export default function PokemonCard({ name, url, navigation }) {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract ID from URL
  const getPokemonId = (pokemonUrl) => {
    const parts = pokemonUrl.split('/');
    return parts[parts.length - 2];
  };

  const id = getPokemonId(url);
  const formattedId = `#${String(id).padStart(3, '0')}`;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  useEffect(() => {
    let isMounted = true;
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch details');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPokemonDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(`Erro ao buscar detalhes do Pokémon ${id}:`, err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const primaryType = pokemonDetails?.types?.[0]?.type?.name || '';
  const backgroundColor = getTypeColor(primaryType);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Detail', { pokemonName: name })}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.idText}>{formattedId}</Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {capitalizedName}
        </Text>
        
        <View style={styles.typesContainer}>
          {loading ? (
            <View style={styles.loadingBadge}>
              <Text style={styles.loadingText}>...</Text>
            </View>
          ) : (
            pokemonDetails?.types?.map((t, index) => {
              const typeName = t.type.name;
              return (
                <View 
                  key={index} 
                  style={styles.typeBadge}
                >
                  <Text style={styles.typeText}>
                    {typeName.toUpperCase()}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>

      <View style={styles.imageContainer}>
        {/* Subtle background Pokeball pattern effect using an overlay */}
        <View style={styles.pokeballPattern} />
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.pokemonImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 115,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // Android shadow
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  idText: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loadingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pokeballPattern: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    right: -25,
    bottom: -25,
    zIndex: 1,
  },
  pokemonImage: {
    width: 95,
    height: 95,
    zIndex: 2,
    transform: [{ translateY: -2 }],
  },
});
