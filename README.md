# SAVORIA — Restaurant App MVP

Savoria is a frontend-only Restaurant App MVP developed for the Fall 2026 Mobile App Development assignment.

The app is built with React Native and Expo. It allows customers to browse restaurant food, search for menu items, add items to a cart, use promo codes, make table reservations, place orders, and track their orders.

The app also includes a separate Manager Dashboard where the manager can manage orders, reservations, and menu items.

The project uses local mock data and React state management. No backend, Firebase, real payment system, or external API is used.

---

## Project Overview

Savoria has two main user roles:

### Customer

A customer can:

- Create an account
- Log in
- Browse the restaurant menu
- Search for food items
- Filter menu items by category
- Sort menu items
- Add items to the cart
- Increase or decrease item quantity
- Remove items from the cart
- Add special instructions to items
- Apply promo codes
- View the order summary
- Reserve a restaurant table
- View reservations
- Cancel reservations
- Place an order
- Track order progress
- View their profile
- Change the app theme between light and dark mode

### Manager

A manager can:

- Log in using the manager account
- Open the Manager Dashboard
- View incoming orders
- Change order status
- View reservations
- Confirm or cancel reservations
- Manage menu items
- Add new menu items
- Edit menu prices
- Change menu item availability

---

# Main Features

## Authentication

The app uses local mock users instead of a backend authentication service.

There are two roles:

- Customer
- Manager

The authenticated user is stored and shared through `AuthContext`.

### Mock Customer Account

Email:

```text
roman@gmail.com