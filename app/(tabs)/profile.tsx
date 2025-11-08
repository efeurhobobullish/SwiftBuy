import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuthStore } from '../../services/authStore';
import { COLORS, SIZES } from '../../constants';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'orders',
      icon: 'bag-outline',
      title: 'My Orders',
      subtitle: 'View order history and tracking',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      id: 'addresses',
      icon: 'location-outline',
      title: 'Delivery Addresses',
      subtitle: 'Manage delivery addresses',
      onPress: () => navigation.navigate('Addresses'),
    },
    {
      id: 'payment',
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Add or remove payment methods',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help with your orders',
      onPress: () => navigation.navigate('Help'),
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      title: 'About SwiftBuy',
      subtitle: 'App version and information',
      onPress: () => Alert.alert('About', 'SwiftBuy v1.0.0\n\nFast, reliable shopping at your fingertips.'),
    },
  ];

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={40} color={COLORS.background} />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'guest@swiftbuy.com'}</Text>
        <Text style={styles.memberSince}>
          Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderProfileHeader()}

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.slice(0, 5).map(renderMenuItem)}
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>More</Text>
        {menuItems.slice(5).map(renderMenuItem)}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ in Nigeria</Text>
        <Text style={styles.footerText}>© 2024 SwiftBuy</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
    margin: SIZES.base,
    borderRadius: SIZES.radius,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SIZES.base,
  },
  profileName: {
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SIZES.base / 4,
  },
  profileEmail: {
    fontSize: SIZES.font,
    color: COLORS.background,
    opacity: 0.9,
    marginBottom: SIZES.base / 4,
  },
  memberSince: {
    fontSize: SIZES.font - 2,
    color: COLORS.background,
    opacity: 0.8,
  },
  editButton: {
    padding: SIZES.base,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
  },
  menuContainer: {
    margin: SIZES.base,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: SIZES.font + 2,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SIZES.base,
    marginBottom: SIZES.base,
    marginTop: SIZES.padding,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.base,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base / 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.base / 4,
  },
  menuSubtitle: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.base,
    padding: SIZES.padding,
    backgroundColor: '#ffebee',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  logoutText: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: SIZES.base,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
    marginBottom: SIZES.padding,
  },
  footerText: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
});