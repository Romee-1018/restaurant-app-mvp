/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {string} image
 * @property {boolean} isSpecial
 * @property {boolean} isAvailable
 * @property {number} quantity
 * @property {string} note
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items
 * @property {string} promoCode
 * @property {number} discountPercent
 * @property {string} promoError
 */

/**
 * @typedef {Object} CartAction
 * @property {string} type
 * @property {any} [payload]
 */

/** @type {CartState} */
const initialState = {
  items: [],
  promoCode: "",
  discountPercent: 0,
  promoError: "",
};

/**
 * @param {CartState} state
 * @param {CartAction} action
 * @returns {CartState}
 */
export function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            quantity: 1,
            note: "",
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload
        ),
      };

    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "UPDATE_NOTE":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                note: action.payload.note,
              }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...initialState,
      };

    case "APPLY_PROMO": {
      const code = action.payload
        .trim()
        .toUpperCase();

      if (code === "WELCOME10") {
        return {
          ...state,
          promoCode: code,
          discountPercent: 10,
          promoError: "",
        };
      }

      if (code === "FEAST20") {
        return {
          ...state,
          promoCode: code,
          discountPercent: 20,
          promoError: "",
        };
      }

      return {
        ...state,
        promoCode: "",
        discountPercent: 0,
        promoError: "Invalid promo code.",
      };
    }

    case "REMOVE_PROMO":
      return {
        ...state,
        promoCode: "",
        discountPercent: 0,
        promoError: "",
      };

    default:
      return state;
  }
}