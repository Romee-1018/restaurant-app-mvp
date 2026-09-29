import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/context/MenuContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ThemeProvider } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <MenuProvider>
            <OrdersProvider>
              <AnimatedSplashOverlay />

              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                {/* Customer Screens */}
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="explore" />
                <Stack.Screen name="cart" />
                <Stack.Screen name="order-summary" />
                <Stack.Screen name="order-confirmation" />
                <Stack.Screen name="order-tracking" />
                <Stack.Screen name="profile" />

                {/* Manager Screens */}
                <Stack.Screen name="manager-dashboard" />
                <Stack.Screen name="incoming-orders" />
                <Stack.Screen name="reservations" />
                <Stack.Screen name="menu-management" />
              </Stack>
            </OrdersProvider>
          </MenuProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}