import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  primary: string;
  primaryText: string;
  input: string;
  placeholder: string;
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const lightColors: ThemeColors = {
  background: "#F8F6F2",
  card: "#FFFFFF",
  text: "#222222",
  secondaryText: "#777777",
  border: "#E4E0DA",
  primary: "#222222",
  primaryText: "#FFFFFF",
  input: "#FFFFFF",
  placeholder: "#888888",
};

const darkColors: ThemeColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  secondaryText: "#B5B5B5",
  border: "#333333",
  primary: "#FFFFFF",
  primaryText: "#121212",
  input: "#1E1E1E",
  placeholder: "#888888",
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
