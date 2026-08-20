import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MenuItem, OrderItemOption } from '../types';
import { BREAD_OPTIONS, SAUCE_OPTIONS, EXTRA_OPTIONS, SIDE_CHOICES, DRINK_CHOICES } from '../data/menu';
import { useAuth } from '../context/AuthContext';

interface CustomizerModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, options: OrderItemOption) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  visible,
  item,
  onClose,
  onAddToCart,
}) => {
  const { language } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedBread, setSelectedBread] = useState<string>('kebab');
  const [selectedFormat, setSelectedFormat] = useState<'seul' | 'trio'>('seul');
  const [selectedSide, setSelectedSide] = useState<string>('frites');
  const [selectedDrink, setSelectedDrink] = useState<string>('canette');
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['maison']);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  if (!item) return null;

  // Calculate dynamic unit price
  let unitPrice = item.price_cad;
  if (item.allows_bread_selection) {
    if (selectedBread === 'tortilla') unitPrice += 1.0;
    if (selectedBread === 'naan') unitPrice += 2.0;
  }
  if (item.allows_trio && selectedFormat === 'trio') {
    unitPrice += 5.30;
    if (selectedDrink === 'jarritos') unitPrice += 1.0;
    if (selectedDrink === 'lassi') unitPrice += 2.25;
  }
  if (selectedExtras.includes('egg')) unitPrice += 0.99;
  if (selectedExtras.includes('cheese')) unitPrice += 0.99;

  const totalPrice = (unitPrice * quantity).toFixed(2);

  const toggleSauce = (sauceId: string) => {
    if (selectedSauces.includes(sauceId)) {
      setSelectedSauces(selectedSauces.filter((s) => s !== sauceId));
    } else {
      setSelectedSauces([...selectedSauces, sauceId]);
    }
  };

  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter((e) => e !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const handleAdd = () => {
    const options: OrderItemOption = {
      bread: item.allows_bread_selection ? selectedBread : undefined,
      format: item.allows_trio ? selectedFormat : 'seul',
      side_choice: selectedFormat === 'trio' ? selectedSide : undefined,
      drink_choice: selectedFormat === 'trio' ? selectedDrink : undefined,
      sauces: selectedSauces,
      extras: selectedExtras,
      notes: specialNotes.trim() || undefined,
    };
    onAddToCart(item, quantity, options);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{language === 'fr' ? item.name_fr : item.name_en}</Text>
              <Text style={styles.basePrice}>Base: ${item.price_cad.toFixed(2)} CAD</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Dish Photo Banner */}
            <View style={styles.dishImageBannerContainer}>
              <Image 
                source={{ uri: item.image_url || '/assets/food/wrap_kebab_poulet.png' }} 
                style={styles.dishImageBanner}
                resizeMode="cover"
              />
            </View>
            {/* Step 1: Bread Selection (Mandatory for Wraps) */}
            {item.allows_bread_selection && (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    1. {language === 'fr' ? 'Choix du Pain' : 'Bread Selection'}
                  </Text>
                  <Text style={styles.requiredBadge}>
                    {language === 'fr' ? 'Requis' : 'Required'}
                  </Text>
                </View>
                {BREAD_OPTIONS.map((bread) => (
                  <TouchableOpacity
                    key={bread.id}
                    style={[
                      styles.optionCard,
                      selectedBread === bread.id && styles.optionCardActive,
                    ]}
                    onPress={() => setSelectedBread(bread.id)}
                  >
                    <View style={styles.radio}>
                      {selectedBread === bread.id && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionText}>
                      {language === 'fr' ? bread.name_fr : bread.name_en}
                    </Text>
                    <Text style={styles.optionPrice}>
                      {bread.price_modifier > 0 ? `+${bread.price_modifier.toFixed(2)}$` : 'Inclus'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Step 2: Format (Seul vs Trio) */}
            {item.allows_trio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  2. {language === 'fr' ? 'Format Sandwich ou Trio ?' : 'Format Selection'}
                </Text>
                <View style={styles.formatRow}>
                  <TouchableOpacity
                    style={[styles.formatBtn, selectedFormat === 'seul' && styles.formatBtnActive]}
                    onPress={() => setSelectedFormat('seul')}
                  >
                    <Text style={[styles.formatBtnTitle, selectedFormat === 'seul' && styles.textActive]}>
                      🥪 {language === 'fr' ? 'Sandwich Seul' : 'Sandwich Only'}
                    </Text>
                    <Text style={styles.formatBtnSub}>Base</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.formatBtn, selectedFormat === 'trio' && styles.formatBtnActive]}
                    onPress={() => setSelectedFormat('trio')}
                  >
                    <Text style={[styles.formatBtnTitle, selectedFormat === 'trio' && styles.textActive]}>
                      🍟🥤 {language === 'fr' ? 'Format Trio (+5.30$)' : 'Trio (+5.30$)'}
                    </Text>
                    <Text style={styles.formatBtnSub}>+ Accompagnement & Boisson</Text>
                  </TouchableOpacity>
                </View>

                {/* Trio Choices if selected */}
                {selectedFormat === 'trio' && (
                  <View style={styles.trioSubSection}>
                    <Text style={styles.subSectionTitle}>
                      👉 {language === 'fr' ? 'Choisissez votre accompagnement :' : 'Choose Side:'}
                    </Text>
                    {SIDE_CHOICES.map((side) => (
                      <TouchableOpacity
                        key={side.id}
                        style={[styles.subOptionCard, selectedSide === side.id && styles.optionCardActive]}
                        onPress={() => setSelectedSide(side.id)}
                      >
                        <Text style={styles.optionText}>{language === 'fr' ? side.name_fr : side.name_en}</Text>
                        <Text style={styles.optionPrice}>Inclus</Text>
                      </TouchableOpacity>
                    ))}

                    <Text style={[styles.subSectionTitle, { marginTop: 12 }]}>
                      👉 {language === 'fr' ? 'Choisissez votre boisson :' : 'Choose Drink:'}
                    </Text>
                    {DRINK_CHOICES.map((drink) => (
                      <TouchableOpacity
                        key={drink.id}
                        style={[styles.subOptionCard, selectedDrink === drink.id && styles.optionCardActive]}
                        onPress={() => setSelectedDrink(drink.id)}
                      >
                        <Text style={styles.optionText}>{language === 'fr' ? drink.name_fr : drink.name_en}</Text>
                        <Text style={styles.optionPrice}>
                          {drink.price > 0 ? `+${drink.price.toFixed(2)}$` : 'Inclus'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Step 3: Sauces */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                3. {language === 'fr' ? 'Sauces (Sélectionnez vos préférées)' : 'Sauces'}
              </Text>
              <View style={styles.checkboxGrid}>
                {SAUCE_OPTIONS.map((sauce) => {
                  const isChecked = selectedSauces.includes(sauce.id);
                  return (
                    <TouchableOpacity
                      key={sauce.id}
                      style={[styles.checkboxCard, isChecked && styles.checkboxActive]}
                      onPress={() => toggleSauce(sauce.id)}
                    >
                      <Text style={[styles.checkboxText, isChecked && styles.textActive]}>
                        {isChecked ? '✓ ' : '+ '}
                        {language === 'fr' ? sauce.name_fr : sauce.name_en}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Step 4: Extras */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                4. {language === 'fr' ? 'Suppléments Gourmands' : 'Extras'}
              </Text>
              {EXTRA_OPTIONS.map((extra) => {
                const isChecked = selectedExtras.includes(extra.id);
                return (
                  <TouchableOpacity
                    key={extra.id}
                    style={[styles.optionCard, isChecked && styles.optionCardActive]}
                    onPress={() => toggleExtra(extra.id)}
                  >
                    <Text style={styles.optionText}>
                      {language === 'fr' ? extra.name_fr : extra.name_en}
                    </Text>
                    <Text style={styles.optionPrice}>+${extra.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Special Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                5. {language === 'fr' ? 'Instructions spéciales / Allergies' : 'Special Instructions'}
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder={language === 'fr' ? 'Ex. Sans oignons, sauce à part...' : 'E.g. No onions, sauce on side...'}
                placeholderTextColor="#777"
                value={specialNotes}
                onChangeText={setSpecialNotes}
              />
            </View>
          </ScrollView>

          {/* Footer Bar with Quantity and Add Button */}
          <View style={styles.modalFooter}>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addToCartBtn} onPress={handleAdd}>
              <Text style={styles.addToCartBtnText}>
                {language === 'fr' ? 'Ajouter au Panier' : 'Add to Cart'} · ${totalPrice} CAD
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  basePrice: {
    color: '#FF5500',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dishImageBannerContainer: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1E1E28',
  },
  dishImageBanner: {
    width: '100%',
    height: '100%',
  },
  scrollArea: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  requiredBadge: {
    backgroundColor: 'rgba(255, 85, 0, 0.2)',
    color: '#FF5500',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  optionCardActive: {
    borderColor: '#FF5500',
    backgroundColor: 'rgba(255, 85, 0, 0.08)',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5500',
  },
  optionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  optionPrice: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
  },
  formatRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formatBtn: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    alignItems: 'center',
  },
  formatBtnActive: {
    borderColor: '#FF5500',
    backgroundColor: 'rgba(255, 85, 0, 0.1)',
  },
  formatBtnTitle: {
    color: '#888',
    fontWeight: '700',
    fontSize: 13,
  },
  formatBtnSub: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },
  textActive: {
    color: '#FFF',
  },
  trioSubSection: {
    backgroundColor: '#141416',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#26262B',
  },
  subSectionTitle: {
    color: '#FF5500',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  subOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkboxCard: {
    backgroundColor: '#121212',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  checkboxActive: {
    borderColor: '#FF5500',
    backgroundColor: '#FF5500',
  },
  checkboxText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    fontSize: 13,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    gap: 12,
    alignItems: 'center',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  qtyText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#FF5500',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
