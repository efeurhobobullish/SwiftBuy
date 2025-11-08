import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProductService } from '../../services/productService';
import { useCartStore } from '../../services/cartStore';
import { Product } from '../../types';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    // In a real app, load from AsyncStorage
    setSearchHistory(['iPhone', 'Nike shoes', 'Laptop', 'Makeup kit']);
  };

  const performSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      const results = await ProductService.searchProducts(query);
      setSearchResults(results);

      // Add to search history
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.resultDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.resultMeta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
          <Text style={styles.resultPrice}>{formatCurrency(item.price)}</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addItem(item)}
        >
          <Ionicons name="cart-outline" size={16} color={COLORS.background} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = (item: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.recentSearchItem}
      onPress={() => {
        setSearchQuery(item);
        performSearch(item);
      }}
    >
      <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
      <Text style={styles.recentSearchText}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          setSearchHistory(prev => prev.filter((_, i) => i !== index));
        }}
      >
        <Ionicons name="close-outline" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (searchQuery && searchResults.length > 0) {
      return (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (searchQuery && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try different keywords</Text>
        </View>
      );
    }

    return (
      <View style={styles.recentSearchesContainer}>
        {searchHistory.length > 0 && (
          <>
            <View style={styles.recentSearchesHeader}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={() => setSearchHistory([])}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.map(renderRecentSearch)}
          </>
        )}

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Popular Searches</Text>
          {['Electronics', 'Fashion', 'Beauty', 'Home'].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setSearchQuery(category);
                performSearch(category);
              }}
            >
              <Ionicons name="trending-up" size={16} color={COLORS.primary} />
              <Text style={styles.suggestionText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => performSearch(searchQuery)}
              placeholderTextColor={COLORS.textSecondary}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {renderContent()}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: SIZES.base,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.base / 2,
    fontSize: SIZES.font,
    color: COLORS.text,
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
  resultsContainer: {
    padding: SIZES.base,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    padding: SIZES.base,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.surface,
  },
  resultInfo: {
    flex: 1,
    marginLeft: SIZES.base,
    justifyContent: 'space-between',
  },
  resultName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base / 4,
  },
  resultDescription: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
    lineHeight: SIZES.font,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: SIZES.font - 2,
    color: COLORS.text,
    marginLeft: 2,
    fontWeight: '500',
  },
  reviewsText: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  resultPrice: {
    fontSize: SIZES.font + 2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    paddingVertical: SIZES.base / 3,
  },
  addToCartText: {
    color: COLORS.background,
    fontSize: SIZES.font - 2,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
  },
  emptySubtext: {
    fontSize: SIZES.font - 2,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
  },
  recentSearchesContainer: {
    flex: 1,
    padding: SIZES.base,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  recentSearchesTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentSearchText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  suggestionsContainer: {
    marginTop: SIZES.padding,
  },
  suggestionsTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  suggestionText: {
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
});