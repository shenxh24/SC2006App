import React, { useContext } from 'react';
import { FavouritesContext } from './FavouritesContext';
import { Link } from 'react-router-dom';
import '../App.css';

function FavouritesPage({ user }) {
  const { favourites = [], removefavourite } = useContext(FavouritesContext);

  return (
    <div className="favourites-page">
      <h1>Your Favourites</h1>
      {!favourites || favourites.length === 0 ? (
        <p>You don’t have any favourite recipes yet—let’s find some delicious ones!</p>
      ) : (
        <div className="favourites-grid">
          {favourites.map(recipe => (
            <div key={recipe.id} className="favourite-card">
              <Link to={`/recipe/${recipe.id}`}>
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
              </Link>
              <button 
                onClick={() => removefavourite(recipe.id)}
                className="remove-favourite-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;