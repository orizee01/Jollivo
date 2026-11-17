export type Category = { id: string; name: string; emoji: string };

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  popular?: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  category: string;
  rating: number;
  reviews: number;
  time: string;
  fee: number;
  emoji: string;
  gradient: string;
  tag?: string;
  menu: MenuItem[];
};

export const categories: Category[] = [
  { id: "all", name: "All", emoji: "🍽️" },
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "sushi", name: "Sushi", emoji: "🍣" },
  { id: "african", name: "African", emoji: "🍲" },
  { id: "healthy", name: "Healthy", emoji: "🥗" },
  { id: "dessert", name: "Dessert", emoji: "🍩" },
];

export const restaurants: Restaurant[] = [
  {
    id: "mama-jollof",
    name: "Mama's Jollof House",
    cuisine: "Nigerian · Rice · Grill",
    category: "african",
    rating: 4.9,
    reviews: 1240,
    time: "20–30 min",
    fee: 0,
    emoji: "🍲",
    gradient: "from-[#f0b45c] to-[#c4472a]",
    tag: "Free delivery",
    menu: [
      { id: "jollof-chicken", name: "Smoky Jollof & Chicken", description: "Party-style jollof rice, grilled chicken, fried plantain", price: 14.5, emoji: "🍛", popular: true },
      { id: "suya-platter", name: "Suya Platter", description: "Spicy beef skewers, onions, tomatoes, yaji spice", price: 12, emoji: "🍢", popular: true },
      { id: "egusi", name: "Egusi & Pounded Yam", description: "Melon seed stew with spinach and assorted meat", price: 16, emoji: "🥘" },
      { id: "puff-puff", name: "Puff-Puff (8 pcs)", description: "Sweet fried dough balls dusted with sugar", price: 5, emoji: "🍩" },
      { id: "zobo", name: "Chilled Zobo", description: "Hibiscus drink with ginger and pineapple", price: 3.5, emoji: "🧃" },
    ],
  },
  {
    id: "stack-burger",
    name: "Stack Burger Co.",
    cuisine: "Burgers · Fries · Shakes",
    category: "burgers",
    rating: 4.7,
    reviews: 980,
    time: "15–25 min",
    fee: 1.99,
    emoji: "🍔",
    gradient: "from-[#f7d98e] to-[#d68a2a]",
    tag: "20% off",
    menu: [
      { id: "double-smash", name: "Double Smash", description: "Two smashed patties, cheddar, pickles, house sauce", price: 11.5, emoji: "🍔", popular: true },
      { id: "crispy-chicken", name: "Crispy Chicken Burger", description: "Buttermilk fried chicken, slaw, hot honey", price: 10.5, emoji: "🍗" },
      { id: "loaded-fries", name: "Loaded Fries", description: "Cheese sauce, bacon bits, scallions", price: 6, emoji: "🍟", popular: true },
      { id: "shake", name: "Vanilla Bean Shake", description: "Thick, creamy and made to order", price: 5.5, emoji: "🥤" },
    ],
  },
  {
    id: "napoli-slice",
    name: "Napoli Slice",
    cuisine: "Pizza · Italian",
    category: "pizza",
    rating: 4.8,
    reviews: 2110,
    time: "25–35 min",
    fee: 2.49,
    emoji: "🍕",
    gradient: "from-[#e9737d] to-[#9c132b]",
    menu: [
      { id: "margherita", name: "Margherita", description: "San Marzano tomato, fior di latte, basil", price: 13, emoji: "🍕", popular: true },
      { id: "pepperoni", name: "Hot Pepperoni", description: "Pepperoni, chilli oil, mozzarella, oregano", price: 15, emoji: "🌶️", popular: true },
      { id: "truffle", name: "Truffle Funghi", description: "Wild mushrooms, truffle cream, parmesan", price: 17, emoji: "🍄" },
      { id: "tiramisu", name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone", price: 6.5, emoji: "🍰" },
    ],
  },
  {
    id: "koi-sushi",
    name: "Koi Sushi Bar",
    cuisine: "Japanese · Sushi · Poke",
    category: "sushi",
    rating: 4.8,
    reviews: 760,
    time: "30–40 min",
    fee: 2.99,
    emoji: "🍣",
    gradient: "from-[#f3b9ad] to-[#c0506a]",
    tag: "New",
    menu: [
      { id: "salmon-set", name: "Salmon Lover Set", description: "8 nigiri, 6 maki, miso soup", price: 22, emoji: "🍣", popular: true },
      { id: "dragon-roll", name: "Dragon Roll", description: "Shrimp tempura, avocado, eel sauce", price: 14, emoji: "🐉" },
      { id: "poke", name: "Tuna Poke Bowl", description: "Ahi tuna, rice, edamame, mango, sesame", price: 15.5, emoji: "🥢", popular: true },
      { id: "mochi", name: "Mochi Trio", description: "Matcha, strawberry and mango", price: 6, emoji: "🍡" },
    ],
  },
  {
    id: "green-bowl",
    name: "Green Bowl",
    cuisine: "Healthy · Salads · Smoothies",
    category: "healthy",
    rating: 4.6,
    reviews: 540,
    time: "15–20 min",
    fee: 0.99,
    emoji: "🥗",
    gradient: "from-[#cdd893] to-[#6c8a3c]",
    menu: [
      { id: "harvest", name: "Harvest Bowl", description: "Quinoa, roast sweet potato, kale, tahini", price: 12.5, emoji: "🥗", popular: true },
      { id: "avocado-toast", name: "Avocado Toast", description: "Sourdough, smashed avocado, chilli, egg", price: 9, emoji: "🥑" },
      { id: "green-smoothie", name: "Green Glow Smoothie", description: "Spinach, mango, banana, coconut water", price: 6.5, emoji: "🥤", popular: true },
    ],
  },
  {
    id: "sugar-rush",
    name: "Sugar Rush Bakery",
    cuisine: "Desserts · Bakery · Coffee",
    category: "dessert",
    rating: 4.9,
    reviews: 1330,
    time: "10–20 min",
    fee: 1.49,
    emoji: "🍩",
    gradient: "from-[#dcb6c8] to-[#874a6c]",
    menu: [
      { id: "donut-box", name: "Glazed Donut Box (6)", description: "Classic, chocolate, strawberry sprinkles", price: 10, emoji: "🍩", popular: true },
      { id: "cookie", name: "Brown Butter Cookie", description: "Sea salt, dark chocolate chunks", price: 3.5, emoji: "🍪" },
      { id: "cheesecake", name: "Basque Cheesecake", description: "Burnt top, creamy centre", price: 7, emoji: "🍰", popular: true },
      { id: "latte", name: "Iced Caramel Latte", description: "Double shot, house caramel", price: 5, emoji: "🧋" },
    ],
  },
];

export function getRestaurant(id: string) {
  return restaurants.find((r) => r.id === id);
}

export function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}
