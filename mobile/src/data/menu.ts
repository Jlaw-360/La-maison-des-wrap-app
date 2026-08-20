import { MenuItem, BreadOption } from '../types';

export const BREAD_OPTIONS: BreadOption[] = [
  { id: 'kebab', name_fr: 'Pain Kebab', name_en: 'Kebab Bread', price_modifier: 0.0 },
  { id: 'tortilla', name_fr: 'Pain Tortilla (Galette)', name_en: 'Tortilla Wrap', price_modifier: 1.0 },
  { id: 'naan', name_fr: 'Pain Naan Traditionnel', name_en: 'Traditional Naan Bread', price_modifier: 2.0 },
];

export const SAUCE_OPTIONS = [
  { id: 'mayo', name_fr: 'Mayonnaise', name_en: 'Mayonnaise' },
  { id: 'ketchup', name_fr: 'Ketchup', name_en: 'Ketchup' },
  { id: 'moutarde', name_fr: 'Moutarde', name_en: 'Mustard' },
  { id: 'harissa', name_fr: 'Harissa Épicée', name_en: 'Spicy Harissa' },
  { id: 'maison', name_fr: 'Sauce Maison', name_en: 'House Special Sauce' },
  { id: 'verte', name_fr: 'Sauce Verte Menthe', name_en: 'Green Mint Sauce' },
  { id: 'ail', name_fr: 'Sauce à l\'Ail', name_en: 'Garlic Sauce' },
  { id: 'thai', name_fr: 'Sauce Thaï Sweet Chili', name_en: 'Sweet Chili Thai' },
];

export const EXTRA_OPTIONS = [
  { id: 'egg', name_fr: 'Extra Œuf', name_en: 'Extra Egg', price: 0.99 },
  { id: 'cheese', name_fr: 'Extra Fromage Cheddar', name_en: 'Extra Cheddar Cheese', price: 0.99 },
];

export const SIDE_CHOICES = [
  { id: 'frites', name_fr: 'Frites Croustillantes', name_en: 'Crispy Fries', price: 0.0 },
  { id: 'patates_ail', name_fr: 'Patates à l\'Ail Maison', name_en: 'House Garlic Potatoes', price: 0.0 },
];

export const DRINK_CHOICES = [
  { id: 'canette', name_fr: 'Canette (Coke/Sprite/7Up)', name_en: 'Can (Coke/Sprite/7Up)', price: 0.0 },
  { id: 'eau', name_fr: 'Bouteille d\'Eau', name_en: 'Bottled Water', price: 0.0 },
  { id: 'jarritos', name_fr: 'Jarritos Mexicain (+1.00$)', name_en: 'Jarritos Soda (+1.00$)', price: 1.0 },
  { id: 'lassi', name_fr: 'Lassi Mangue Maison (+2.25$)', name_en: 'House Mango Lassi (+2.25$)', price: 2.25 },
];

export const MENU_CATEGORIES = [
  { id: 'wraps', name_fr: '🌯 Nos Wraps Signature', name_en: '🌯 Signature Wraps' },
  { id: 'paninis', name_fr: '🥪 Paninis Chauds', name_en: '🥪 Hot Paninis' },
  { id: 'curry', name_fr: '🍛 Bols de Curry & Combos', name_en: '🍛 Curry Bowls & Combos' },
  { id: 'biryani', name_fr: '🍚 Biryani Royal', name_en: '🍚 Royal Biryani' },
  { id: 'assiettes', name_fr: '🍽️ Nos Assiettes Complètes', name_en: '🍽️ Full Plates' },
  { id: 'burgers', name_fr: '🍔 Nos Burgers', name_en: '🍔 Burgers' },
  { id: 'poutines', name_fr: '🍟 Nos Poutines Gourmandes', name_en: '🍟 Gourmet Poutines' },
  { id: 'sides', name_fr: '🥟 Sides & Naans', name_en: '🥟 Sides & Naans' },
  { id: 'enfant', name_fr: '👶 Menu Enfant', name_en: '👶 Kids Menu' },
  { id: 'boissons', name_fr: '🥤 Boissons & Desserts', name_en: '🥤 Drinks & Desserts' },
];

export const LOCAL_MENU_ITEMS: MenuItem[] = [
  // Wraps
  {
    id: 'wrap-poulet-tikka',
    category: 'wraps',
    name_fr: 'Wrap Poulet Tikka',
    name_en: 'Chicken Tikka Wrap',
    description_fr: 'Morceaux de poulet mariné aux épices indiennes tandoori, salade fraîche et tomates.',
    description_en: 'Marinated chicken tikka in Indian tandoori spices with crisp salad and tomatoes.',
    price_cad: 8.95,
    points_cost: 350,
    is_available: true,
    allows_bread_selection: true,
    allows_trio: true,
  },
  {
    id: 'wrap-seekh-kebab',
    category: 'wraps',
    name_fr: 'Wrap Seekh Kebab (Bœuf)',
    name_en: 'Seekh Kebab Wrap (Beef)',
    description_fr: 'Bœuf haché assaisonné d\'herbes fraîches et grillé à la perfection.',
    description_en: 'Seasoned minced beef kebab grilled with fresh aromatic herbs.',
    price_cad: 8.95,
    points_cost: 350,
    is_available: true,
    allows_bread_selection: true,
    allows_trio: true,
  },
  {
    id: 'wrap-steak-fromage',
    category: 'wraps',
    name_fr: 'Wrap Steak & Fromage Fondant',
    name_en: 'Steak & Melted Cheese Wrap',
    description_fr: 'Lamelles de steak tendre sautées aux oignons avec fromage cheddar coulant.',
    description_en: 'Tender sauteed steak strips with caramelized onions and melted cheddar.',
    price_cad: 9.75,
    points_cost: 400,
    is_available: true,
    allows_bread_selection: true,
    allows_trio: true,
  },
  {
    id: 'wrap-mix-2-viandes',
    category: 'wraps',
    name_fr: 'Wrap Mixte 2 Viandes',
    name_en: 'Mixed 2 Meats Wrap',
    description_fr: 'Combinaison gourmande au choix (Poulet Tikka + Kebab ou Steak).',
    description_en: 'Savory combination of two premium meats of your choice.',
    price_cad: 9.95,
    points_cost: 420,
    is_available: true,
    allows_bread_selection: true,
    allows_trio: true,
  },
  {
    id: 'wrap-paneer-vege',
    category: 'wraps',
    name_fr: 'Wrap Paneer Tikka (Végétarien)',
    name_en: 'Paneer Tikka Wrap (Vegetarian)',
    description_fr: 'Fromage artisanal indien mariné et grillé avec poivrons et sauce menthe.',
    description_en: 'Marinated Indian cottage cheese grilled with bell peppers and mint sauce.',
    price_cad: 8.95,
    points_cost: 350,
    is_available: true,
    allows_bread_selection: true,
    allows_trio: true,
  },

  // Paninis
  {
    id: 'panini-poulet-tikka',
    category: 'paninis',
    name_fr: 'Panini Poulet Tikka Pressé',
    name_en: 'Pressed Chicken Tikka Panini',
    description_fr: 'Pain ciabatta croustillant garni de poulet tikka et fromage fondu.',
    description_en: 'Crispy pressed panini loaded with spiced chicken tikka and melted cheese.',
    price_cad: 9.25,
    points_cost: 360,
    is_available: true,
    allows_bread_selection: false,
    allows_trio: true,
  },

  // Curries
  {
    id: 'curry-poulet-beurre',
    category: 'curry',
    name_fr: 'Bol Poulet au Beurre (Butter Chicken)',
    name_en: 'Butter Chicken Bowl',
    description_fr: 'Sauce onctueuse et crémeuse aux tomates douces, beurre et épices avec riz basmati.',
    description_en: 'Rich creamy butter tomato gravy with tender chicken over aromatic basmati rice.',
    price_cad: 17.65,
    points_cost: 700,
    is_available: true,
    allows_bread_selection: false,
    allows_trio: false,
  },

  // Poutines
  {
    id: 'poutine-poulet-beurre',
    category: 'poutines',
    name_fr: 'Poutine au Poulet au Beurre',
    name_en: 'Butter Chicken Poutine',
    description_fr: 'Frites dorées du Québec, fromage en grains frais St-Guillaume et sauce poulet au beurre.',
    description_en: 'Golden Quebec fries, fresh cheese curds, smothered in authentic butter chicken sauce.',
    price_cad: 13.95,
    points_cost: 500,
    is_available: true,
    allows_bread_selection: false,
    allows_trio: false,
  },

  // Sides & Rewards
  {
    id: 'side-samosas',
    category: 'sides',
    name_fr: 'Samosas Végétariens (2 pcs)',
    name_en: 'Vegetarian Samosas (2 pcs)',
    description_fr: 'Chaussons dorés et croustillants farcis aux pommes de terre, petits pois et épices.',
    description_en: 'Golden crispy pastries stuffed with spiced potatoes and peas.',
    price_cad: 4.65,
    points_cost: 200,
    is_available: true,
    allows_bread_selection: false,
    allows_trio: false,
  },
  {
    id: 'side-naan-ail',
    category: 'sides',
    name_fr: 'Pain Naan à l\'Ail et Coriandre',
    name_en: 'Garlic & Cilantro Naan Bread',
    description_fr: 'Cuit au four tandoor traditionnel avec beurre clarifié et ail frais.',
    description_en: 'Baked in a traditional clay tandoor with clarified butter and fresh garlic.',
    price_cad: 3.50,
    points_cost: 150,
    is_available: true,
    allows_bread_selection: false,
    allows_trio: false,
  },
  {
    id: 'drink-lassi-mangue',
    category: 'boissons',
    name_fr: 'Lassi à la Mangue Fraîche',
    name_en: 'Fresh Mango Lassi',
    description_fr: 'Boisson rafraîchissante traditionnelle au yaourt et pulpe de mangue Alphonso.',
    description_en: 'Traditional chilled yogurt smoothie with sweet Alphonso mango pulp.',
    price_cad: 4.50,
    points_cost: 180,
    is_available: true,
    allows_bread_selection: false,
    allows_trio: false,
  },
];
