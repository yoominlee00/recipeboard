import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { UserContext } from '../contexts/UserContext';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await recipeApi.getAll();
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        setError('레시피를 불러오는데 실패했습니다.');
        setLoading(false);
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);

  const foodEmojis = ['🍕', '🍔', '🍜', '🍣', '🍰', '🍦', '🍗', '🥗', '🌮', '🥐'];
  const getRandomEmoji = () => {
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" style={{ color: '#8aaa5b' }}></div>
        <p className="mt-3">레시피를 불러오는 중...</p>
      </div>
    );
  }
  
  if (error) return <div className="alert alert-danger my-3">{error}</div>;

  return (
    <div className="container-fluid px-4">
      {user && (
        <div className="welcome-banner">
          <h3>{user.username}님, 오늘은 어떤 요리를 해볼까요? {getRandomEmoji()}</h3>
        </div>
      )}
      
      {recipes.length === 0 ? (
        <div className="text-center my-5">
          <h3>아직 등록된 레시피가 없어요</h3>
          <p>첫 번째 레시피를 공유해보세요!</p>
          <Link to="/create" className="btn btn-primary mt-3">
            레시피 공유하기
          </Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card">
              {recipe.imageUrl ? (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title}
                  className="recipe-image"
                />
              ) : (
                <div 
                  className="recipe-image"
                  style={{ 
                    backgroundColor: '#fff9e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem'
                  }}
                >
                  {getRandomEmoji()}
                </div>
              )}
              <div className="recipe-overlay">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div>
                  {recipe.category && (
                    <span className="recipe-category">{recipe.category}</span>
                  )}
                  <span className="recipe-author">by {recipe.author}</span>
                </div>
              </div>
              <div className="recipe-emoji">
                {getRandomEmoji()}
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {user && (
        <Link 
          to="/create" 
          className="btn btn-primary"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          <i className="fas fa-plus"></i>
        </Link>
      )}
    </div>
  );
}

export default RecipeList;