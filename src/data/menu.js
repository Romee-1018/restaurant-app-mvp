const menu = [
  // =========================
  // STARTERS
  // =========================
  {
    id: "1",
    name: "Crispy Chicken Wings",
    description: "Golden fried chicken wings served with spicy sauce.",
    price: 850,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Loaded Fries",
    description: "Crispy fries topped with cheese and special sauce.",
    price: 550,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs.",
    price: 450,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "4",
    name: "Chicken Nuggets",
    description: "Crispy golden chicken nuggets with dipping sauce.",
    price: 600,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },

  // =========================
  // MAINS
  // =========================
  {
    id: "5",
    name: "Classic Beef Burger",
    description:
      "Juicy beef patty with cheese, lettuce and house sauce.",
    price: 950,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: "6",
    name: "Grilled Chicken Burger",
    description:
      "Grilled chicken breast with fresh vegetables and sauce.",
    price: 900,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "7",
    name: "Creamy Alfredo Pasta",
    description:
      "Creamy pasta with parmesan cheese and herbs.",
    price: 1100,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=85",
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: "8",
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice with tender chicken and spices.",
    price: 750,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "9",
    name: "Chicken Steak",
    description:
      "Grilled chicken steak served with vegetables and fries.",
    price: 1250,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },

  // =========================
  // DESSERTS
  // =========================
  {
    id: "10",
    name: "Chocolate Cake",
    description:
      "Rich chocolate cake with creamy chocolate frosting.",
    price: 650,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: "11",
    name: "New York Cheesecake",
    description:
      "Classic creamy cheesecake with a buttery crust.",
    price: 700,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "12",
    name: "Chocolate Brownie",
    description:
      "Warm fudgy brownie with rich chocolate flavor.",
    price: 500,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "13",
    name: "Vanilla Ice Cream",
    description:
      "Smooth and creamy classic vanilla ice cream.",
    price: 400,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },

  // =========================
  // DRINKS
  // =========================
  {
    id: "14",
    name: "Fresh Lemonade",
    description:
      "Refreshing homemade lemonade with fresh lemons.",
    price: 350,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=85",
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: "15",
    name: "Mango Shake",
    description:
      "Creamy mango shake made with fresh mangoes.",
    price: 500,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: "16",
    name: "Cold Coffee",
    description:
      "Chilled coffee blended with milk and ice.",
    price: 450,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    isSpecial: false,
    isAvailable: true,
  },
];

export default menu;