import React, { useState, useEffect, useContext } from 'react';
import { commentApi } from '../services/api';
import { UserContext } from '../contexts/UserContext';

function CommentSection({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await commentApi.getByRecipeId(recipeId);
      setComments(response.data);
      setLoading(false);
    } catch (err) {
      setError('댓글을 불러오는데 실패했습니다.');
      setLoading(false);
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      console.log(`댓글 작성 중... 사용자 ID: ${user.id}, 레시피 ID: ${recipeId}`);
      await commentApi.create(recipeId, user.id, newComment);
      setNewComment('');
      // 댓글 작성 후 서버에서 최신 댓글 목록을 다시 불러옵니다
      await fetchComments();
    } catch (err) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      await commentApi.update(recipeId, commentId, user.id, editContent);
      setEditingCommentId(null);
      setEditContent('');
      await fetchComments();
    } catch (err) {
      setError('댓글 수정에 실패했습니다.');
      console.error('Error updating comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setSubmitting(true);
      await commentApi.delete(recipeId, commentId, user.id);
      await fetchComments();
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.');
      console.error('Error deleting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="text-center my-3">
      <div className="spinner-border spinner-border-sm" style={{ color: '#ffcc29' }}></div>
      <span className="ms-2">댓글을 불러오는 중...</span>
    </div>
  );
  
  if (error) return <div className="alert alert-danger my-3">{error}</div>;

  return (
    <div className="mt-5">
      <h4>
        <i className="fas fa-comments"></i> 댓글 ({comments.length})
      </h4>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-start">
                <div className="comment-avatar me-3">
                  <i className="fas fa-user-circle" style={{ fontSize: '2rem', color: '#ffa41b' }}></i>
                  <div className="mt-1 text-center" style={{ fontSize: '0.8rem' }}>
                    {user.username}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <textarea 
                    className="form-control" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="맛있게 먹었어요! 댓글을 남겨주세요 😋"
                    rows="2"
                    disabled={submitting}
                  />
                  <div className="d-flex justify-content-end mt-2">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          등록 중...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> 등록
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="alert alert-warning">
          <i className="fas fa-info-circle"></i> 댓글을 작성하려면 로그인이 필요합니다.
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center my-4 py-5" style={{ backgroundColor: '#fff9e6', borderRadius: '15px' }}>
          <i className="fas fa-comment-slash" style={{ fontSize: '2rem', color: '#ffa41b' }}></i>
          <p className="mt-3">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id} className="card mb-3 border-0" style={{ backgroundColor: '#fff9e6' }}>
              <div className="card-body">
                <div className="d-flex">
                  <div className="comment-avatar me-3 text-center">
                    <i className="fas fa-user-circle" style={{ fontSize: '2rem', color: '#ffa41b' }}></i>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {comment.author.username}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea 
                          className="form-control mb-2" 
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows="2"
                          disabled={submitting}
                        />
                        <div className="d-flex justify-content-end gap-2">
                          <button 
                            className="btn btn-sm btn-primary" 
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={submitting}
                          >
                            <i className="fas fa-check"></i> 저장
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={handleCancelEdit}
                            disabled={submitting}
                          >
                            <i className="fas fa-times"></i> 취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="comment-bubble p-3" style={{ backgroundColor: 'white', borderRadius: '15px' }}>
                        {comment.content}
                        {user && user.id === comment.author.id && (
                          <div className="d-flex justify-content-end mt-2 gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary" 
                              onClick={() => handleEdit(comment)}
                            >
                              <i className="fas fa-edit"></i> 수정
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <i className="fas fa-trash"></i> 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;