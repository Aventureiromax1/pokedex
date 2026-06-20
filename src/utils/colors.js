// Pokémon types color palette mapping
export const colors = {
  grass: '#4AD0B0',
  fire: '#FB6C6C',
  water: '#76BDFE',
  bug: '#A8C545',
  normal: '#B5B9C4',
  poison: '#BE7CF3',
  electric: '#FFD86F',
  ground: '#F4D28C',
  fairy: '#F4B1F4',
  fighting: '#EB4971',
  psychic: '#F85888',
  rock: '#D5C399',
  ghost: '#7C88C3',
  ice: '#98D8D8',
  dragon: '#7673DA',
  dark: '#757575',
  steel: '#A8C2D4',
  flying: '#A890F0',
  shadow: '#5A6076',
  unknown: '#9DA0B3',
};

// Text color contrast variants for displaying label text inside tags
export const textColors = {
  grass: '#1C6050',
  fire: '#7A1C1C',
  water: '#1C407A',
  bug: '#4E550E',
  normal: '#4A4C52',
  poison: '#532153',
  electric: '#775E19',
  ground: '#6E5D31',
  fairy: '#752A75',
  fighting: '#691A15',
  psychic: '#7C1A37',
  rock: '#5C501C',
  ghost: '#3B2E50',
  ice: '#385F5F',
  dragon: '#3E1C8F',
  dark: '#382D24',
  steel: '#3D4A52',
  flying: '#513D75',
  shadow: '#2A2E3D',
  unknown: '#40424D',
};

export const getTypeColor = (type) => {
  if (!type) return '#B5B9C4';
  const cleanType = type.toLowerCase().trim();
  return colors[cleanType] || '#B5B9C4';
};

export const getTypeTextColors = (type) => {
  if (!type) return '#FFFFFF';
  const cleanType = type.toLowerCase().trim();
  return textColors[cleanType] || '#FFFFFF';
};
