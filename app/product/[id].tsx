import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { ProductService } from '../../services/productService';
import { useCartStore } from '../../services/cartStore';
import { Product } from '../../types';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await ProductService.getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      Alert.alert(
        'Added to Cart',
        `${quantity} × ${product.name} added to your cart`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { text: 'View Cart', onPress: () => navigation.navigate('cart') },
        ]
      );
    }
  };

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      navigation.navigate('Checkout');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.inStock ? 10 : quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Text style={styles.reviewsText}>({product.reviews} reviews)</Text>
              </View>
            </View>
            <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          </View>

          <View style={styles.stockContainer}>
            <Ionicons
              name={product.inStock ? "checkmark-circle" : "close-circle"}
              size={16}
              color={product.inStock ? COLORS.success : COLORS.error}
            />
            <Text style={[
              styles.stockText,
              { color: product.inStock ? COLORS.success : COLORS.error }
            ]}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.features && product.features.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresContainer}>
                {product.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark" size={16} color={COLORS.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>SwiftBuy</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {product.inStock && (
        <View style={styles.bottomActions}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Ionicons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={20} color={COLORS.background} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buyNowButton}
              onPress={handleBuyNow}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    marginTop: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.error,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: COLORS.surface,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: SIZES.padding,
    left: SIZES.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    padding: SIZES.padding,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  productTitleContainer: {
    flex: 1,
    marginRight: SIZES.base,
  },
  productName: {
    fontSize: SIZES.font + 4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  productPrice: {
    fontSize: SIZES.font + 6,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  stockText: {
    fontSize: SIZES.font,
    fontWeight: '500',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: SIZES.font + 2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
    marginTop: SIZES.padding,
  },
  description: {
    fontSize: SIZES.font,
    color: COLORS.text,
    lineHeight: SIZES.font * 1.5,
  },
  featuresContainer: {
    marginBottom: SIZES.padding,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  featureText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  detailsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base / 2,
  },
  detailLabel: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  bottomActions: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SIZES.padding,
    paddingBottom: SIZES.padding + 20, // Extra padding for home indicator
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  quantityLabel: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '600',
    marginHorizontal: SIZES.base,
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  addToCartText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
    marginLeft: SIZES.base / 2,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  buyNowText: {
    color: COLORS.background,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});