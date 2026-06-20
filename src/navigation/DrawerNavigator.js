import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
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
        drawerActiveTintColor: '#FF3F3F',
        drawerInactiveTintColor: '#4A4C52',
        drawerLabelStyle: {
          fontWeight: '700',
          fontSize: 14,
          marginLeft: -10,
        },
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 260,
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{ 
          title: 'Pokédex',
          drawerLabel: 'Início',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 20} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}
