const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Table = require("./models/Table");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();

    console.log("Old data cleared");

       // Users (passwords are hashed with bcrypt, never stored as plain text)
    const users = await User.insertMany([
      {
        name: "Restaurant Manager",
        email: "manager@restaurant.com",
        password: await bcrypt.hash("manager123", 10),
        role: "manager",
      },
      {
        name: "Ali",
        email: "ali@example.com",
        password: await bcrypt.hash("customer123", 10),
        role: "customer",
      },
    ]);

    console.log(`${users.length} users inserted`);

    // Menu items - same items as Assignment 1
    const menuItems = await MenuItem.insertMany([
      {
        name: "Crispy Chicken Wings",
        description: "Crispy and juicy chicken wings served with special sauce.",
        price: 850,
        category: "Starters",
        image:
          "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
        isSpecial: true,
        available: true,
      },
      {
        name: "Loaded Fries",
        description: "Crispy fries loaded with delicious toppings and sauce.",
        price: 550,
        category: "Starters",
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Garlic Bread",
        description: "Freshly baked garlic bread with butter and herbs.",
        price: 450,
        category: "Starters",
        image:
          "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Chicken Nuggets",
        description: "Crispy golden chicken nuggets served with dipping sauce.",
        price: 600,
        category: "Starters",
        image:
          "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Classic Beef Burger",
        description: "Juicy beef patty with fresh vegetables and special sauce.",
        price: 950,
        category: "Mains",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        isSpecial: true,
        available: true,
      },
      {
        name: "Grilled Chicken Burger",
        description: "Grilled chicken fillet burger with fresh vegetables and sauce.",
        price: 900,
        category: "Mains",
        image:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Creamy Alfredo Pasta",
        description: "Creamy pasta prepared with Alfredo sauce and herbs.",
        price: 1100,
        category: "Mains",
        image:
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=85",
        isSpecial: true,
        available: true,
      },
      {
        name: "Chicken Biryani",
        description: "Aromatic basmati rice cooked with tender chicken and spices.",
        price: 750,
        category: "Mains",
        image:
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Chicken Steak",
        description: "Juicy grilled chicken steak served with fresh sides.",
        price: 1250,
        category: "Mains",
        image:
          "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Chocolate Cake",
        description: "Rich and moist chocolate cake with delicious chocolate frosting.",
        price: 650,
        category: "Desserts",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
        isSpecial: true,
        available: true,
      },
      {
        name: "New York Cheesecake",
        description: "Classic creamy cheesecake with a smooth and rich texture.",
        price: 700,
        category: "Desserts",
        image:
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Chocolate Brownie",
        description: "Soft and fudgy chocolate brownie with a rich chocolate flavor.",
        price: 500,
        category: "Desserts",
        image:
          "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Vanilla Ice Cream",
        description: "Creamy vanilla ice cream served chilled.",
        price: 400,
        category: "Desserts",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Fresh Lemonade",
        description: "Refreshing homemade lemonade with fresh lemons.",
        price: 350,
        category: "Drinks",
        image:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=85",
        isSpecial: true,
        available: true,
      },
      {
        name: "Mango Shake",
        description: "Creamy mango shake made with fresh mangoes.",
        price: 500,
        category: "Drinks",
        image:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
      {
        name: "Cold Coffee",
        description: "Chilled creamy coffee topped with a smooth coffee flavor.",
        price: 450,
        category: "Drinks",
        image:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
        isSpecial: false,
        available: true,
      },
    ]);

    console.log(`${menuItems.length} menu items inserted`);

    // Tables
    const tables = await Table.insertMany([
      {
        tableNumber: 1,
        seats: 2,
        status: "available",
      },
      {
        tableNumber: 2,
        seats: 2,
        status: "available",
      },
      {
        tableNumber: 3,
        seats: 4,
        status: "available",
      },
      {
        tableNumber: 4,
        seats: 4,
        status: "available",
      },
      {
        tableNumber: 5,
        seats: 6,
        status: "available",
      },
      {
        tableNumber: 6,
        seats: 8,
        status: "available",
      },
    ]);

    console.log(`${tables.length} tables inserted`);

    console.log("Seed completed successfully");

    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedData();