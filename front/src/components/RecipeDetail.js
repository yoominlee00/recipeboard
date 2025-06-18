import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeApi } from '../services/api';
import CommentSection from './CommentSection';
import { UserContext } from '../contexts/UserContext';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useContext(UserContext);

  // 음식 이모지 랜덤 선택
  const foodEmojis = ['🍕', '🍔', '🍜', '🍣', '🍰', '🍦', '🍗', '🥗', '🌮', '🥐'];
  const getRandomEmoji = () => {
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getById(id);
        setRecipe(response.data);
        setLoading(false);
      } catch (err) {
        setError('레시피를 불러오는데 실패했습니다.');
        setLoading(false);
        console.error('Error fetching recipe:', err);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (window.confirm('정말로 이 레시피를 삭제하시겠습니까?')) {
      try {
        setDeleting(true);
        await recipeApi.delete(id, user.username);
        alert('레시피가 삭제되었습니다.');
        navigate('/');
      } catch (err) {
        setError('레시피 삭제에 실패했습니다.');
        console.error('Error deleting recipe:', err);
        setDeleting(false);
      }
    }
  };

  if (loading) return (
    <div className="text-center my-5">
      <div className="spinner-border" style={{ color: '#ffcc29' }}></div>
      <p className="mt-3">맛있는 레시피를 가져오고 있어요...</p>
    </div>
  );
  
  if (error) return <div className="alert alert-danger my-3">{error}</div>;
  if (!recipe) return <div className="alert alert-warning my-3">레시피를 찾을 수 없습니다.</div>;

  const isAuthor = user && user.username === recipe.author;

  return (
    <div className="container my-4">
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>{recipe.title} {getRandomEmoji()}</h2>
          <div>
            {recipe.category && <span className="badge bg-warning me-2">{recipe.category}</span>}
            <small className="text-muted">작성자: {recipe.author}</small>
          </div>
        </div>
        
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            className="card-img-top" 
            alt={recipe.title}
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        ) : (
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ height: '200px', backgroundColor: '#fff9e6', fontSize: '5rem' }}
          >
            {getRandomEmoji()}
          </div>
        )}
        
        <div className="card-body">
          <p className="card-text" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>{recipe.content}</p>
        </div>
        
        <div className="card-footer text-muted d-flex justify-content-between">
          <div>
            작성일: {new Date(recipe.createdAt).toLocaleDateString()}
          </div>
          
          {isAuthor && (
            <div>
              <Link to={`/edit/${recipe.id}`} className="btn btn-sm btn-outline-primary me-2">
                <i className="fas fa-edit"></i> 수정
              </Link>
              <button 
                onClick={handleDelete} 
                className="btn btn-sm btn-outline-danger"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span> 삭제 중...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i> 삭제
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <CommentSection recipeId={id} />
      
      <div className="mt-3">
        <Link to="/" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default RecipeDetail;