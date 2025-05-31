import { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVORITES":
      return [...state, action.payload];
    case "REMOVE_FROM_FAVORITES":
      return state.filter((item) => item.id !== action.payload.id);
    case "LOAD_FAVORITES":
      return action.payload;
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        dispatch({ type: "LOAD_FAVORITES", payload: parsedFavorites });
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        localStorage.removeItem("favorites");
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    if (isFavorite) {
      dispatch({ type: "REMOVE_FROM_FAVORITES", payload: product });
    } else {
      dispatch({ type: "ADD_TO_FAVORITES", payload: product });
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};