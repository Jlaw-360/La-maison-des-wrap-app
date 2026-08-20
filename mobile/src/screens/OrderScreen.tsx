import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MENU_CATEGORIES, LOCAL_MENU_ITEMS } from '../data/menu';
import { MenuItem } from '../types';
import { CustomizerModal } from './CustomizerModal';
import { CartModal } from './CartModal';

interface OrderScreenProps {
  onNavigateToTracking: () => void;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({ onNavigateToTracking }) => {
  const { language } = useAuth();
  const { items, subtotal, addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('wraps');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const filteredItems = LOCAL_MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      item.name_fr.toLowerCase().includes(query) ||
      item.name_en.toLowerCase().includes(query) ||
      item.description_fr.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'fr' ? '🔍 Rechercher wrap, poutine, curry...' : '🔍 Search wrap, poutine, curry...'}
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills Bar */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {MENU_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {language === 'fr' ? cat.name_fr : cat.name_en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Item Cards List */}
      <ScrollView style={styles.itemList} contentContainerStyle={styles.itemListContent}>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => setCustomizingItem(item)}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>
                  {language === 'fr' ? item.name_fr : item.name_en}
                </Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {language === 'fr' ? item.description_fr : item.description_en}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.itemPrice}>${item.price_cad.toFixed(2)} CAD</Text>
                {item.points_cost && (
                  <Text style={styles.pointsCostText}>🌟 {item.points_cost} pts</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setCustomizingItem(item)}
              >
                <Text style={styles.addBtnText}>+ {language === 'fr' ? 'Personnaliser' : 'Customize'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <View style={styles.floatingCartBar}>
          <TouchableOpacity style={styles.cartButton} onPress={() => setIsCartOpen(true)}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartBarTitle}>
              {language === 'fr' ? 'Voir le Panier' : 'View Cart'}
            </Text>
            <Text style={styles.cartBarPrice}>${subtotal.toFixed(2)} CAD ➔</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Item Customizer Modal */}
      <CustomizerModal
        visible={!!customizingItem}
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={(item, qty, opts) => addItem(item, qty, opts)}
      />

      {/* Cart Sheet Modal */}
      <CartModal
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderCompleted={() => onNavigateToTracking()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  categoriesWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#202024',
  },
  categoryScroll: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  categoryPillActive: {
    backgroundColor: '#FF5500',
    borderColor: '#FF5500',
  },
  categoryText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  itemList: {
    flex: 1,
  },
  itemListContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  menuCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  itemName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#888',
    fontSize: 12,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#242428',
  },
  itemPrice: {
    color: '#FF5500',
    fontSize: 15,
    fontWeight: '800',
  },
  pointsCostText: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#2A2A2E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF5500',
  },
  addBtnText: {
    color: '#FF5500',
    fontSize: 13,
    fontWeight: '700',
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  cartButton: {
    backgroundColor: '#FF5500',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#FF5500',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cartCountBadge: {
    backgroundColor: '#121212',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  cartBarTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cartBarPrice: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
