import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

import menu from "@/data/menu";

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
  toggleAvailability: (id: string) => void;
  updateMenuItem: (
    id: string,
    name: string,
    price: number,
    category: string
  ) => void;
  deleteMenuItem: (id: string) => void;
};

const MenuContext = createContext<
  MenuContextType | undefined
>(undefined);

export function MenuProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(menu);

  const toggleAvailability = (id: string) => {
    setMenuItems((previousMenu) =>
      previousMenu.map((item) =>
        item.id === id
          ? {
              ...item,
              isAvailable: !item.isAvailable,
            }
          : item
      )
    );
  };

  const updateMenuItem = (
    id: string,
    name: string,
    price: number,
    category: string
  ) => {
    setMenuItems((previousMenu) =>
      previousMenu.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              price,
              category,
            }
          : item
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((previousMenu) =>
      previousMenu.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        toggleAvailability,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error(
      "useMenu must be used inside MenuProvider"
    );
  }

  return context;
}