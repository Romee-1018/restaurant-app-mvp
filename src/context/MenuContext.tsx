import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { request } from "../api/client";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isSpecial: boolean;
  isAvailable: boolean;
};

type MenuContextType = {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string;

  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<boolean>;

  toggleAvailability: (id: string, isAvailable: boolean) => Promise<boolean>;

  updateMenuItem: (
    id: string,
    name: string,
    price: number,
    category: string
  ) => Promise<boolean>;

  deleteMenuItem: (id: string) => Promise<boolean>;

  refreshMenu: () => Promise<void>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Convert a server document into the shape the screens already use
const formatItem = (item: any): MenuItem => ({
  id: item._id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  image: item.image || "",
  isSpecial: item.isSpecial || false,
  isAvailable: item.available,
});

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Always reloads the list from the server
  const fetchMenu = async () => {
    try {
      setError("");
      const data = await request("/api/menu");
      setMenuItems(data.map(formatItem));
    } catch (err) {
      console.error("Menu fetch error:", err);
      setError((err as Error).message || "Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // CREATE (manager only, token is added by request())
  const addMenuItem = async (item: Omit<MenuItem, "id">): Promise<boolean> => {
    try {
      await request("/api/menu", {
        method: "POST",
        body: {
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
          isSpecial: item.isSpecial,
          available: item.isAvailable,
        },
      });
      await fetchMenu(); // reload from the server after the change
      return true;
    } catch (err) {
      console.error("Add menu item error:", err);
      return false;
    }
  };

  // UPDATE availability
  const toggleAvailability = async (
    id: string,
    isAvailable: boolean
  ): Promise<boolean> => {
    try {
      await request(`/api/menu/${id}`, {
        method: "PUT",
        body: { available: isAvailable },
      });
      await fetchMenu();
      return true;
    } catch (err) {
      console.error("Availability update error:", err);
      return false;
    }
  };

  // UPDATE name, price, category
  const updateMenuItem = async (
    id: string,
    name: string,
    price: number,
    category: string
  ): Promise<boolean> => {
    try {
      await request(`/api/menu/${id}`, {
        method: "PUT",
        body: { name, price, category },
      });
      await fetchMenu();
      return true;
    } catch (err) {
      console.error("Update menu item error:", err);
      return false;
    }
  };

  // DELETE
  const deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      await request(`/api/menu/${id}`, { method: "DELETE" });
      await fetchMenu();
      return true;
    } catch (err) {
      console.error("Delete menu item error:", err);
      return false;
    }
  };

   const refreshMenu = async () => {
    // Show the full-screen loader only if there is nothing on screen yet
    if (error || menuItems.length === 0) {
      setIsLoading(true);
    }
    await fetchMenu();
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isLoading,
        error,
        addMenuItem,
        toggleAvailability,
        updateMenuItem,
        deleteMenuItem,
        refreshMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used inside MenuProvider");
  }

  return context;
}