import { router } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import { useTheme } from "@/context/ThemeContext";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isSpecial: boolean;
  isAvailable: boolean;
};

const categories = [
  "All",
  "Starters",
  "Mains",
  "Desserts",
  "Drinks",
];

const sortOptions = [
  "Default",
  "Price: Low → High",
  "Price: High → Low",
  "Name: A → Z",
];

export default function ExploreScreen() {
  const { state, addItem } = useCart();
  const { colors } = useTheme();
  const { menuItems: sharedMenuItems } = useMenu();

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [searchHistory, setSearchHistory] =
    useState<string[]>([]);

  const [favoriteIds, setFavoriteIds] =
    useState<string[]>([]);

  const [selectedSort, setSelectedSort] =
    useState("Default");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [showBackToTop, setShowBackToTop] =
    useState(false);

  const showBackToTopRef = useRef(false);

  const searchInputRef =
    useRef<TextInput>(null);

  const debounceRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const flatListRef =
    useRef<FlatList<MenuItem>>(null);

  /*
   * Load shared menu
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
      } catch {
        setError("Unable to load menu.");
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  /*
   * Search debounce
   */
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const cleanedSearch =
        searchText.trim();

      setSearchQuery(cleanedSearch);

      if (cleanedSearch.length > 0) {
        setSearchHistory((previous) => {
          const updated = [
            cleanedSearch,
            ...previous.filter(
              (item) =>
                item.toLowerCase() !==
                cleanedSearch.toLowerCase()
            ),
          ];

          return updated.slice(0, 5);
        });
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText]);

  /*
   * Filter + search + sorting
   */
  const filteredItems = useMemo(() => {
    let result = [...sharedMenuItems];

    if (selectedCategory !== "All") {
      result = result.filter(
        (item) =>
          item.category === selectedCategory
      );
    }

    if (searchQuery.length > 0) {
      const query =
        searchQuery.toLowerCase();

      result = result.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(query) ||
          item.description
            .toLowerCase()
            .includes(query) ||
          item.category
            .toLowerCase()
            .includes(query)
      );
    }

    if (
      selectedSort ===
      "Price: Low → High"
    ) {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (
      selectedSort ===
      "Price: High → Low"
    ) {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (
      selectedSort ===
      "Name: A → Z"
    ) {
      result.sort((a, b) =>
        a.name
          .trim()
          .toLowerCase()
          .localeCompare(
            b.name.trim().toLowerCase()
          )
      );
    }

    return result;
  }, [
    sharedMenuItems,
    selectedCategory,
    searchQuery,
    selectedSort,
  ]);

  /*
   * Add to cart
   */
  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      if (!item.isAvailable) {
        return;
      }

      addItem(item);
    },
    [addItem]
  );

  /*
   * Favorites
   */
  const handleToggleFavorite =
    useCallback((id: string) => {
      setFavoriteIds((previous) =>
        previous.includes(id)
          ? previous.filter(
              (itemId) => itemId !== id
            )
          : [...previous, id]
      );
    }, []);

  /*
   * Pull to refresh
   */
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setError("");

    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  }, []);

  /*
   * Retry
   */
  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  /*
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchText("");
    setSearchQuery("");
    Keyboard.dismiss();
  }, []);

  /*
   * Search history selection
   */
  const selectSearchTerm =
    useCallback((term: string) => {
      setSearchText(term);
      setSearchQuery(term);
    }, []);

  /*
   * Category
   */
  const handleCategorySelect =
    useCallback((category: string) => {
      setSelectedCategory(category);
    }, []);

  /*
   * Sort
   */
  const handleSortSelect =
    useCallback((sort: string) => {
      setSelectedSort(sort);
    }, []);

  /*
   * Back to top
   */
  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, []);

  /*
   * Scroll listener
   */
  const handleScroll = useCallback(
    (event: any) => {
      const offsetY =
        event.nativeEvent.contentOffset.y;

      const shouldShow =
        offsetY > 300;

      if (
        shouldShow !==
        showBackToTopRef.current
      ) {
        showBackToTopRef.current =
          shouldShow;

        setShowBackToTop(
          shouldShow
        );
      }
    },
    []
  );

  /*
   * Cart quantity
   */
  const getItemQuantity =
    useCallback(
      (id: string) => {
        const item =
          state.items.find(
            (cartItem) =>
              cartItem.id === id
          );

        return item?.quantity ?? 0;
      },
      [state.items]
    );

  /*
   * Render menu item
   */
  const renderMenuItem =
    useCallback(
      ({
        item,
      }: {
        item: MenuItem;
      }) => {
        const quantity =
          getItemQuantity(item.id);

        return (
          <MenuItemCard
            item={item}
            quantity={quantity}
            isFavorite={favoriteIds.includes(
              item.id
            )}
            onAddToCart={
              handleAddToCart
            }
            onToggleFavorite={
              handleToggleFavorite
            }
          />
        );
      },
      [
        favoriteIds,
        getItemQuantity,
        handleAddToCart,
        handleToggleFavorite,
      ]
    );

  const keyExtractor =
    useCallback(
      (item: MenuItem) => item.id,
      []
    );

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.text,
            },
          ]}
        >
          Loading Savoria menu...
        </Text>
      </View>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.errorTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Something went wrong
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {error}
        </Text>

        <Pressable
          onPress={handleRetry}
          style={[
            styles.retryButton,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.retryButtonText,
              {
                color:
                  colors.primaryText,
              },
            ]}
          >
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text
            style={[
              styles.brand,
              {
                color: colors.text,
              },
            ]}
          >
            SAVORIA
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Our Menu
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {filteredItems.length} items
            available
          </Text>
        </View>

        <View
          style={styles.headerActions}
        >
          <Pressable
            onPress={() =>
              router.push(
                "/profile"
              )
            }
            style={[
              styles.profileButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.profileIcon,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              👤
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push("/cart")
            }
            style={[
              styles.cartButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.cartIcon,
                {
                  color:
                    colors.primaryText,
                },
              ]}
            >
              🛒
            </Text>

            {state.items.length >
              0 && (
              <View
                style={
                  styles.cartBadge
                }
              >
                <Text
                  style={
                    styles.cartBadgeText
                  }
                >
                  {state.items.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      item.quantity,
                    0
                  )}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* SEARCH */}

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor:
              colors.input,
            borderColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={styles.searchIcon}
        >
          🔍
        </Text>

        <TextInput
          ref={searchInputRef}
          value={searchText}
          onChangeText={
            setSearchText
          }
          placeholder="Search menu..."
          placeholderTextColor={
            colors.placeholder
          }
          style={[
            styles.searchInput,
            {
              color:
                colors.text,
            },
          ]}
          returnKeyType="search"
        />

        {searchText.length >
          0 && (
          <Pressable
            onPress={
              clearSearch
            }
            style={
              styles.clearButton
            }
          >
            <Text
              style={[
                styles.clearText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              ✕
            </Text>
          </Pressable>
        )}
      </View>

      {/* SEARCH HISTORY */}

      {searchText.length ===
        0 &&
        searchHistory.length >
          0 && (
          <View
            style={
              styles.historySection
            }
          >
            <Text
              style={[
                styles.historyTitle,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Recent searches
            </Text>

            <View
              style={
                styles.historyRow
              }
            >
              {searchHistory.map(
                (term) => (
                  <Pressable
                    key={term}
                    onPress={() =>
                      selectSearchTerm(
                        term
                      )
                    }
                    style={[
                      styles.historyChip,
                      {
                        backgroundColor:
                          colors.card,
                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyChipText,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {term}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
        )}

      {/* CATEGORIES */}

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) =>
          item
        }
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.categoryList
        }
        renderItem={({
          item,
        }) => (
          <Pressable
            onPress={() =>
              handleCategorySelect(
                item
              )
            }
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory ===
                  item
                    ? colors.primary
                    : colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory ===
                    item
                      ? colors.primaryText
                      : colors.text,
                },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      {/* SORT */}

      <View
        style={styles.sortSection}
      >
        <Text
          style={[
            styles.sortTitle,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Sort by
        </Text>

        <FlatList
          horizontal
          data={sortOptions}
          keyExtractor={(item) =>
            item
          }
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.sortList
          }
          renderItem={({
            item,
          }) => (
            <Pressable
              onPress={() =>
                handleSortSelect(
                  item
                )
              }
              style={[
                styles.sortChip,
                {
                  backgroundColor:
                    selectedSort ===
                    item
                      ? colors.primary
                      : colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.sortText,
                  {
                    color:
                      selectedSort ===
                      item
                        ? colors.primaryText
                        : colors.text,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* MENU */}

      <FlatList
        ref={flatListRef}
        data={filteredItems}
        keyExtractor={
          keyExtractor
        }
        renderItem={
          renderMenuItem
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          filteredItems.length ===
          0
            ? styles.emptyList
            : styles.menuList
        }
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor={
              colors.primary
            }
          />
        }
        onScroll={
          handleScroll
        }
        scrollEventThrottle={
          16
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text
              style={
                styles.emptyIcon
              }
            >
              🍽️
            </Text>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              No items found
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Try another search
              or category.
            </Text>
          </View>
        }
      />

      {/* BACK TO TOP */}

      {showBackToTop && (
        <Pressable
          onPress={
            scrollToTop
          }
          style={[
            styles.backToTop,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.backToTopText,
              {
                color:
                  colors.primaryText,
              },
            ]}
          >
            ↑
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 58,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flex: 1,
  },

  brand: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },

  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  headerActions: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 10,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 20,
  },

  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  cartIcon: {
    fontSize: 20,
  },

  cartBadge: {
    position: "absolute",
    right: -4,
    top: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor:
      "#C9953C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  clearButton: {
    padding: 5,
  },

  clearText: {
    fontSize: 16,
  },

  historySection: {
    marginTop: 12,
    paddingHorizontal: 20,
  },

  historyTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  historyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  historyChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  historyChipText: {
    fontSize: 11,
    fontWeight: "600",
  },

  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },

  categoryChip: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingVertical: 9,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "800",
  },

  sortSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  sortTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  sortList: {
    gap: 8,
  },

  sortChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  sortText: {
    fontSize: 11,
    fontWeight: "700",
  },

  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  emptyText: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },

  backToTop: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  backToTopText: {
    fontSize: 24,
    fontWeight: "800",
  },
});