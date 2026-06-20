import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RegionScreen from '../screens/RegionScreen';
import TypeScreen from '../screens/TypeScreen';
import TypeListScreen from '../screens/TypeListScreen';
import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createStackNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#FF3F3F',
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '800',
    fontSize: 20,
  },
  headerTitleAlign: 'center',
  cardStyle: { backgroundColor: '#F5F7FA' },
};

export function RegionStackNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen 
        name="RegionList" 
        component={RegionScreen} 
        options={{ title: 'Regiões' }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ 
          title: 'Detalhes',
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
}

export function TypeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen 
        name="TypeGrid" 
        component={TypeScreen} 
        options={{ title: 'Tipos' }}
      />
      <Stack.Screen 
        name="TypeList" 
        component={TypeListScreen} 
        options={({ route }) => ({ 
          title: route.params?.typeName ? route.params.typeName.toUpperCase() : 'Tipo' 
        })}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ 
          title: 'Detalhes',
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
}

export function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen 
        name="SearchMain" 
        component={SearchScreen} 
        options={{ title: 'Pesquisa' }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ 
          title: 'Detalhes',
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
}
