import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useCartStore } from '../../services/cartStore';
import { CartItem } from '../../types';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeItem(itemId) },
        ]
      );
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty. Add some products to checkout.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
          >
            <Ionicons name="add-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalPrice}>
          {formatCurrency(item.price * item.quantity)}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>
        Add some products to get started
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('index')}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({totalItems})</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{formatCurrency(1500)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalPrice + 1500)}</Text>
            </View>
          </View>

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.itemsContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.checkoutContainer}>
            <View style={styles.checkoutInfo}>
              <Text style={styles.checkoutItems}>{totalItems} items</Text>
              <Text style={styles.checkoutTotal}>
                {formatCurrency(totalPrice + 1500)}
              </Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    margin: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: 0,
  },
  summaryTitle: {
    fontSize: SIZES.font + 2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
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
  itemsContainer: {
    padding: SIZES.base,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.base,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.surface,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SIZES.base,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.base / 4,
  },
  itemPrice: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SIZES.base / 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '600',
    marginHorizontal: SIZES.base,
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotalPrice: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  removeButton: {
    padding: SIZES.base / 2,
  },
  checkoutContainer: {
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutItems: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 4,
  },
  checkoutTotal: {
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  checkoutButtonText: {
    color: COLORS.background,
    fontSize: SIZES.font,
    fontWeight: '600',
    marginRight: SIZES.base / 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyTitle: {
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base / 2,
  },
  emptySubtext: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
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
});