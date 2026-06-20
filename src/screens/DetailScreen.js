import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { getTypeColor, getTypeTextColors } from '../utils/colors';
import Loading from '../components/Loading';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }) {
  const { pokemonName } = route.params || {};
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'perfil' | 'jogos'

  const fetchDetails = () => {
    if (!pokemonName) return;
    setLoading(true);
    setError(false);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, [pokemonName]);

  if (loading) {
    return <Loading message="Buscando dados do Pokémon..." />;
  }

  if (error || !details) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color="#FF3F3F" />
        <Text style={styles.errorText}>Erro ao carregar detalhes deste Pokémon.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchDetails}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const primaryType = details.types?.[0]?.type?.name || 'normal';
  const themeColor = getTypeColor(primaryType);
  const themeTextColor = getTypeTextColors(primaryType);
  const formattedId = `#${String(details.id).padStart(3, '0')}`;
  const capitalizedName = details.name.charAt(0).toUpperCase() + details.name.slice(1);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png`;

  const translateStat = (name) => {
    const mapping = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      'special-attack': 'Atk. Esp.',
      'special-defense': 'Def. Esp.',
      speed: 'Velocidade',
    };
    return mapping[name] || name;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      {/* Top Header Section */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.idText}>{formattedId}</Text>
            <Text style={styles.nameText}>{capitalizedName}</Text>
            <View style={styles.typesContainer}>
              {details.types?.map((t, index) => {
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
              })}
            </View>
          </View>
          {/* Subtle background PokeBall inside the header background */}
          <View style={styles.headerPokeballBg} />
        </View>
      </SafeAreaView>

      {/* Floating Image Wrapper */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Info Sheet */}
      <View style={styles.sheet}>
        {/* Custom Segmented Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'status' && styles.tabButtonActive]}
            onPress={() => setActiveTab('status')}
          >
            <Text style={[styles.tabText, activeTab === 'status' && styles.tabTextActive]}>Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'perfil' && styles.tabButtonActive]}
            onPress={() => setActiveTab('perfil')}
          >
            <Text style={[styles.tabText, activeTab === 'perfil' && styles.tabTextActive]}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'jogos' && styles.tabButtonActive]}
            onPress={() => setActiveTab('jogos')}
          >
            <Text style={[styles.tabText, activeTab === 'jogos' && styles.tabTextActive]}>Jogos</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Contents */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'status' && (
            <View style={styles.tabContent}>
              {details.stats?.map((s, index) => {
                const statName = translateStat(s.stat.name);
                const statValue = s.base_stat;
                const percentage = Math.min(100, (statValue / 150) * 100);

                return (
                  <View key={index} style={styles.statRow}>
                    <Text style={styles.statLabel}>{statName}</Text>
                    <Text style={styles.statValue}>{statValue}</Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${percentage}%`, backgroundColor: themeColor }
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {activeTab === 'perfil' && (
            <View style={styles.tabContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>ALTURA</Text>
                  <Text style={styles.infoValue}>{(details.height / 10).toFixed(1)} m</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>PESO</Text>
                  <Text style={styles.infoValue}>{(details.weight / 10).toFixed(1)} kg</Text>
                </View>
              </View>

              <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Habilidades</Text>
                <View style={styles.badgeWrap}>
                  {details.abilities?.map((a, index) => {
                    const abilityName = a.ability.name.replace('-', ' ');
                    return (
                      <View key={index} style={styles.abilityBadge}>
                        <Text style={styles.abilityText}>
                          {abilityName.charAt(0).toUpperCase() + abilityName.slice(1)}
                        </Text>
                        {a.is_hidden && <Text style={styles.hiddenText}> (Oculta)</Text>}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'jogos' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Jogos onde aparece</Text>
              <View style={styles.gamesBadgeWrap}>
                {details.game_indices?.length > 0 ? (
                  details.game_indices.map((g, index) => {
                    const gameName = g.version.name.replace('-', ' ');
                    return (
                      <View key={index} style={styles.gameBadge}>
                        <Text style={styles.gameText}>
                          {gameName.charAt(0).toUpperCase() + gameName.slice(1)}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noGamesText}>Nenhum registro de jogos encontrado.</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerSafeArea: {
    zIndex: 1,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 80, // Space for navigation bar back button
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  idText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerPokeballBg: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    right: -20,
    top: 50,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 55, // Extra padding to clear floating image
    marginTop: 130, // Offset sheet to overlap under image
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#FF3F3F',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8A8D9F',
  },
  tabTextActive: {
    color: '#FF3F3F',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  tabContent: {
    paddingVertical: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statLabel: {
    width: 85,
    fontSize: 14,
    fontWeight: '700',
    color: '#656A79',
  },
  statValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2024',
    textAlign: 'right',
    marginRight: 15,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F2F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A8D9F',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2024',
  },
  detailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2024',
    marginBottom: 12,
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  abilityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A4C52',
  },
  hiddenText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FF883F',
  },
  gamesBadgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gameBadge: {
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  gameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#656A79',
  },
  noGamesText: {
    color: '#8A8D9F',
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3F3F',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
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
