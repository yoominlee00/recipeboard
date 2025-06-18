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

  // 음식 이모지 랜덤 선택
  const foodEmojis = ['🍕', '🍔', '🍜', '🍣', '🍰', '🍦', '🍗', '🥗', '🌮', '🥐'];
  const getRandomEmoji = () => {
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  };

  if (loading) return (
    <div className="text-center my-5">
      <div className="spinner-border" style={{ color: '#ffcc29' }}></div>
      <p className="mt-3">맛있는 레시피를 가져오고 있어요...</p>
    </div>
  );
  
  if (error) return <div className="alert alert-danger my-3">{error}</div>;

  return (
    <div className="container my-4">
      <div className="text-center mb-5">
        <h2 className="display-4 mb-3">오늘 뭐 먹지? <span className="float-icon">🤔</span></h2>
        {user && (
          <div className="alert alert-warning mb-3">
            <strong>{user.username}</strong>님 안녕하세요! 오늘은 어떤 요리를 해볼까요?
          </div>
        )}
        <p className="lead">맛있는 레시피를 찾아보세요!</p>
      </div>
      
      {recipes.length === 0 ? (
        <div className="text-center my-5">
          <h3>아직 등록된 레시피가 없어요</h3>
          <p>첫 번째 레시피를 공유해보세요!</p>
          <Link to="/create" className="btn btn-primary mt-3">
            레시피 공유하기
          </Link>
        </div>
      ) : (
        <div className="row">
          {recipes.map(recipe => (
            <div className="col-md-4 mb-4" key={recipe.id}>
              <div className="card h-100">
                {recipe.imageUrl ? (
                  <img 
                    src={recipe.imageUrl} 
                    className="card-img-top" 
                    alt={recipe.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="card-img-top d-flex align-items-center justify-content-center"
                    style={{ height: '200px', backgroundColor: '#fff9e6', fontSize: '5rem' }}
                  >
                    {getRandomEmoji()}
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text text-muted">
                    {recipe.category && <span className="badge bg-warning me-2">{recipe.category}</span>}
                    <small>작성자: {recipe.author}</small>
                  </p>
                  <p className="card-text">
                    {recipe.content.length > 100 
                      ? `${recipe.content.substring(0, 100)}...` 
                      : recipe.content}
                  </p>
                  <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
                    레시피 보기 <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
                <div className="card-footer text-muted">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;