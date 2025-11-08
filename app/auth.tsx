import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../services/authStore';
import { COLORS, SIZES } from '../constants';

export default function AuthScreen() {
  const { login, isLoading } = useAuthStore();

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    await login(provider);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient
        colors={[COLORS.primary, '#1565c0']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>SwiftBuy</Text>
            <Text style={styles.tagline}>Fast, Reliable Shopping</Text>
          </View>

          <View style={styles.authContainer}>
            <View style={styles.authContent}>
              <Text style={styles.welcomeText}>Welcome to SwiftBuy</Text>
              <Text style={styles.subtitle}>
                Shop the best products at amazing prices
              </Text>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={24} color={COLORS.error} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
                {isLoading && (
                  <Ionicons name="reload" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877f2" />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                {isLoading && (
                  <Ionicons name="reload" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.features}>
            <Text style={styles.featuresTitle}>Why SwiftBuy?</Text>
            <View style={styles.feature}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
              <Text style={styles.featureText}>Secure Payments</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="flash" size={20} color={COLORS.accent} />
              <Text style={styles.featureText}>Fast Delivery</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="star" size={20} color={COLORS.accent} />
              <Text style={styles.featureText}>Quality Products</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: SIZES.base / 2,
  },
  tagline: {
    fontSize: SIZES.font,
    color: COLORS.background,
    opacity: 0.9,
  },
  authContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
    marginHorizontal: SIZES.padding,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  authContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: SIZES.padding,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    borderWidth: 1,
    width: '100%',
  },
  googleButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
  },
  facebookButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
  },
  socialButtonText: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SIZES.base,
    flex: 1,
    textAlign: 'center',
  },
  features: {
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  featureText: {
    fontSize: SIZES.font,
    color: COLORS.background,
    marginLeft: SIZES.base,
    opacity: 0.9,
  },
});