import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (city) => {
    if (!favorites.find(item => item.id === city.id)) {
      setFavorites([...favorites, city]);
    }
  };

  const removeFromFavorites = (cityId) => {
    setFavorites(favorites.filter(item => item.id !== cityId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
