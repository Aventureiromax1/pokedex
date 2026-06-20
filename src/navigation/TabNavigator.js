import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RegionStackNavigator, TypeStackNavigator, SearchStackNavigator } from './StackNavigators';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'RegionTab') {
            iconName = focused ? 'earth' : 'earth-outline';
          } else if (route.name === 'TypeTab') {
            iconName = focused ? 'color-palette' : 'color-palette-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Ionicons name={iconName} size={size || 22} color={color} />;
        },
        tabBarActiveTintColor: '#FF3F3F',
        tabBarInactiveTintColor: '#8A8D9F',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EAEAEE',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen 
        name="RegionTab" 
        component={RegionStackNavigator} 
        options={{ title: 'Regiões' }}
      />
      <Tab.Screen 
        name="TypeTab" 
        component={TypeStackNavigator} 
        options={{ title: 'Tipos' }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStackNavigator} 
        options={{ title: 'Pesquisa' }}
      />
    </Tab.Navigator>
  );
}
