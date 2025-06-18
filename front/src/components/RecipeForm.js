import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { UserContext } from '../contexts/UserContext';

function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { user } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: '',
    author: user ? user.username : ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 사용자가 변경될 때마다 작성자 업데이트
    setFormData(prev => ({
      ...prev,
      author: user.username
    }));

    if (isEditMode) {
      const fetchRecipe = async () => {
        try {
          const response = await recipeApi.getById(id);
          const recipe = response.data;
          
          // 작성자만 수정 가능
          if (recipe.author !== user.username) {
            alert('자신이 작성한 레시피만 수정할 수 있습니다.');
            navigate(`/recipe/${id}`);
            return;
          }
          
          setFormData({
            title: recipe.title || '',
            content: recipe.content || '',
            imageUrl: recipe.imageUrl || '',
            category: recipe.category || '',
            author: recipe.author || ''
          });
          setLoading(false);
        } catch (err) {
          setError('레시피를 불러오는데 실패했습니다.');
          setLoading(false);
          console.error('Error fetching recipe:', err);
        }
      };

      fetchRecipe();
    }
  }, [id, isEditMode, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditMode) {
        console.log('레시피 수정 요청 데이터:', formData);
        await recipeApi.update(id, formData);
        alert('레시피가 수정되었습니다.');
        navigate(`/recipe/${id}`);
      } else {
        const response = await recipeApi.create(formData);
        alert('레시피가 등록되었습니다.');
        navigate(`/recipe/${response.data.id}`);
      }
    } catch (err) {
      setError('레시피 저장에 실패했습니다: ' + (err.response?.data || err.message));
      console.error('Error saving recipe:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="text-center my-5">
      <div className="spinner-border" style={{ color: '#ffcc29' }}></div>
      <p className="mt-3">레시피 정보를 불러오는 중...</p>
    </div>
  );
  
  if (error) return <div className="alert alert-danger my-3">{error}</div>;

  return (
    <div className="container my-4">
      <h2>{isEditMode ? '레시피 수정' : '새 레시피 작성'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">제목</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="category" className="form-label">카테고리</label>
          <input
            type="text"
            className="form-control"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="예: 한식, 양식, 디저트 등"
            disabled={submitting}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">이미지 URL</label>
          <input
            type="url"
            className="form-control"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="이미지 URL을 입력하세요 (선택사항)"
            disabled={submitting}
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="미리보기" 
                className="img-thumbnail" 
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
        </div>
        
        <div className="mb-3">
          <label htmlFor="content" className="form-label">내용</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
            disabled={submitting}
          />
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {isEditMode ? '수정 중...' : '등록 중...'}
              </>
            ) : (
              isEditMode ? '수정하기' : '등록하기'
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(isEditMode ? `/recipe/${id}` : '/')}
            disabled={submitting}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;