// FavouritesContext.js
import React, { createContext, useState, useEffect } from 'react';

export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setfavourites] = useState(() => {
    const saved = localStorage.getItem('favouriteRecipes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favouriteRecipes', JSON.stringify(favourites));
  }, [favourites]);

  const addfavourite = (recipe) => {
    if (!favourites.some(item => item.id === recipe.id)) {
      setfavourites(prev => [...prev, recipe]);
    }
  };

  const removefavourite = (recipeId) => {
    setfavourites(prev => prev.filter(item => item.id !== recipeId));
  };

  const isfavourite = (recipeId) => {
    return favourites.some(item => item.id === recipeId);
  };

  return (
    <FavouritesContext.Provider 
      value={{ 
        favourites, 
        addfavourite, 
        removefavourite, 
        isfavourite 
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};