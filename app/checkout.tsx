import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useCartStore } from './services/cartStore';
import { useAuthStore } from './services/authStore';
import { DELIVERY_OPTIONS } from './constants';
import { formatCurrency, generateOrderReference } from './utils/formatCurrency';
import { COLORS, SIZES } from './constants';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [selectedCity, setSelectedCity] = useState(DELIVERY_OPTIONS[0]);
  const [processing, setProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: selectedCity.city,
    state: selectedCity.state,
    postalCode: '',
  });

  const subtotal = getTotalPrice();
  const deliveryFee = selectedCity.fee;
  const totalAmount = subtotal + deliveryFee;

  const handlePayment = async () => {
    if (!deliveryAddress.street.trim()) {
      Alert.alert('Missing Information', 'Please enter your delivery address');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const orderReference = generateOrderReference();

      Alert.alert(
        'Order Successful!',
        `Order ${orderReference} has been placed successfully.\n\nTotal: ${formatCurrency(totalAmount)}\n\nYou will receive delivery updates shortly.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              clearCart();
              navigation.navigate('OrderDetail', {
                orderId: orderReference,
                orderData: {
                  id: orderReference,
                  items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                  })),
                  totalAmount,
                  deliveryAddress: {
                    ...deliveryAddress,
                    id: '1',
                    isDefault: false,
                  },
                  paymentMethod: 'Paystack',
                  status: 'processing',
                  createdAt: new Date().toISOString(),
                  estimatedDelivery: new Date(Date.now() + selectedCity.estimatedDays * 24 * 60 * 60 * 1000).toISOString(),
                }
              });
            },
          },
          {
            text: 'Continue Shopping',
            onPress: () => {
              clearCart();
              navigation.navigate('index');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', 'Your payment could not be processed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.orderItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          </View>
          <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
        </View>
      ))}
    </View>
  );

  const renderDeliveryAddress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <View style={styles.addressForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Street Address</Text>
          <View style={styles.input}>
            <Ionicons name="home-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.inputText}>
              {deliveryAddress.street || 'Enter street address'}
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => {
              Alert.alert(
                'Select City',
                'Choose your delivery city',
                DELIVERY_OPTIONS.map((city) => ({
                  text: `${city.city}, ${city.state} - ${formatCurrency(city.fee)}`,
                  onPress: () => {
                    setSelectedCity(city);
                    setDeliveryAddress(prev => ({
                      ...prev,
                      city: city.city,
                      state: city.state,
                    }));
                  },
                }))
              );
            }}
          >
            <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.selectorText}>{selectedCity.city}, {selectedCity.state}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.deliveryInfo}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
          <Text style={styles.deliveryInfoText}>
            Estimated delivery: {selectedCity.estimatedDays} {selectedCity.estimatedDays === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
        <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate('index')}
        >
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderOrderSummary()}
        {renderDeliveryAddress()}
        {renderPaymentSummary()}

        <View style={styles.paymentMethod}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.paymentMethodText}>
            Secured by Paystack with 256-bit encryption
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabelBottom}>Total</Text>
          <Text style={styles.totalValueBottom}>{formatCurrency(totalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, processing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={20} color={COLORS.background} />
              <Text style={styles.payButtonText}>Pay Securely</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyTitle: {
    fontSize: SIZES.font + 2,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  shopNowText: {
    color: COLORS.background,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    fontSize: SIZES.font + 2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base / 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '600',
  },
  addressForm: {
    gap: SIZES.base,
  },
  inputGroup: {
    gap: SIZES.base / 2,
  },
  inputLabel: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectorText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginTop: SIZES.base / 2,
  },
  deliveryInfoText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font - 2,
    color: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base / 2,
  },
  summaryLabel: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.base / 2,
  },
  totalLabel: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.base,
    marginTop: SIZES.base,
  },
  paymentMethodText: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabelBottom: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 4,
  },
  totalValueBottom: {
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: SIZES.base / 2,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: COLORS.background,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});