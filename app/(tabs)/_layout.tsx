import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import HomeScreen from './index';
import SearchScreen from './search';
import CartScreen from './cart';
import ProfileScreen from './profile';
import { useCartStore } from '../../services/cartStore';
import { COLORS } from '../../constants';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTintColor: COLORS.text,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: 'SwiftBuy',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          headerShown: true,
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: COLORS.background,
    borderBottomColor: COLORS.border,
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.accent,
    color: COLORS.background,
    fontSize: 10,
    minWidth: 18,
    height: 18,
  },
});