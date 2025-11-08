import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { COLORS, SIZES } from '../../constants';
import { formatCurrency, formatRelativeTime } from '../../utils/formatCurrency';

export default function OrderDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { orderId, orderData } = route.params;

  const [order] = useState(orderData || {
    id: orderId,
    items: [],
    totalAmount: 0,
    deliveryAddress: null,
    paymentMethod: 'Paystack',
    status: 'processing',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date().toISOString(),
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          color: COLORS.warning,
          icon: 'time-outline',
          title: 'Processing',
          description: 'Your order is being prepared',
        };
      case 'shipped':
        return {
          color: COLORS.primary,
          icon: 'car-outline',
          title: 'Shipped',
          description: 'Your order is on the way',
        };
      case 'delivered':
        return {
          color: COLORS.success,
          icon: 'checkmark-circle-outline',
          title: 'Delivered',
          description: 'Order delivered successfully',
        };
      default:
        return {
          color: COLORS.textSecondary,
          icon: 'help-circle-outline',
          title: 'Unknown',
          description: 'Status unknown',
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const handleTrackOrder = () => {
    Alert.alert(
      'Track Order',
      'Would you like to call our support team to track your order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Support',
          onPress: () => Linking.openURL('tel:+2348000000000'),
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Customer Support',
      'How would you like to contact support?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+2348000000000'),
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@swiftbuy.com'),
        },
      ]
    );
  };

  const renderOrderStatus = () => (
    <View style={[styles.statusContainer, { backgroundColor: `${statusInfo.color}15` }]}>
      <View style={styles.statusHeader}>
        <Ionicons name={statusInfo.icon as any} size={32} color={statusInfo.color} />
        <View style={styles.statusTextContainer}>
          <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
            {statusInfo.title}
          </Text>
          <Text style={styles.statusDescription}>{statusInfo.description}</Text>
        </View>
      </View>
      <View style={styles.statusTimeline}>
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: statusInfo.color }]} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Order Placed</Text>
            <Text style={styles.timelineTime}>
              {formatRelativeTime(order.createdAt)}
            </Text>
          </View>
        </View>
        {order.status !== 'processing' && (
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: statusInfo.color }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Order Shipped</Text>
              <Text style={styles.timelineTime}>
                {formatRelativeTime(order.createdAt)}
              </Text>
            </View>
          </View>
        )}
        {order.status === 'delivered' && (
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: statusInfo.color }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Order Delivered</Text>
              <Text style={styles.timelineTime}>
                {formatRelativeTime(order.createdAt)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderOrderInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Order ID</Text>
        <Text style={styles.infoValue}>{order.id}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Payment Method</Text>
        <Text style={styles.infoValue}>{order.paymentMethod}</Text>
      </View>
      {order.estimatedDelivery && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated Delivery</Text>
          <Text style={styles.infoValue}>
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </Text>
        </View>
      )}
      {order.trackingNumber && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tracking Number</Text>
          <TouchableOpacity onPress={handleTrackOrder}>
            <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderDeliveryAddress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      {order.deliveryAddress ? (
        <View style={styles.addressContainer}>
          <View style={styles.addressItem}>
            <Ionicons name="home-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.addressText}>
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noAddress}>No delivery address available</Text>
      )}
    </View>
  );

  const renderOrderItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Items ({order.items.length})</Text>
      {order.items.map((item, index) => (
        <View key={index} style={styles.orderItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
          </View>
          <View style={styles.itemTotal}>
            <Text style={styles.itemTotalPrice}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        </View>
      ))}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(order.totalAmount - 1500)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>{formatCurrency(1500)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderOrderStatus()}
        {renderOrderInfo()}
        {renderDeliveryAddress()}
        {renderOrderItems()}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleTrackOrder}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  statusContainer: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  statusTextContainer: {
    marginLeft: SIZES.base,
    flex: 1,
  },
  statusTitle: {
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 4,
  },
  statusDescription: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  statusTimeline: {
    gap: SIZES.base,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SIZES.base,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.base / 4,
  },
  timelineTime: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base / 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  trackingNumber: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '500',
  },
  addressContainer: {
    gap: SIZES.base,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  noAddress: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SIZES.base,
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.base / 4,
  },
  itemQuantity: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 4,
  },
  itemPrice: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalPrice: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderSummary: {
    marginTop: SIZES.base,
    paddingTop: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  actionsContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: SIZES.base / 2,
  },
});