import axios from 'axios';

// API 인스턴스 생성 (proxy 설정으로 인해 baseURL은 필요 없음)
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  config => {
    console.log('API 요청:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  response => {
    console.log('API 응답:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API 오류:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// 레시피 관련 API
export const recipeApi = {
  // 모든 레시피 가져오기
  getAll: () => api.get('/recipes'),
  
  // 특정 레시피 상세 정보 가져오기
  getById: (id) => api.get(`/recipes/${id}`),
  
  // 새 레시피 생성
  create: (recipeData) => api.post('/recipes', recipeData),
  
  // 레시피 수정
  update: (id, recipeData) => {
    console.log('레시피 수정 요청:', id, recipeData);
    return api.put(`/recipes/${id}`, recipeData);
  },
  
  // 레시피 삭제
  delete: (id, author) => api.delete(`/recipes/${id}?author=${author}`),
};

// 댓글 관련 API
export const commentApi = {
  // 특정 레시피의 모든 댓글 가져오기
  getByRecipeId: (recipeId) => api.get(`/recipes/${recipeId}/comments`),
  
  // 새 댓글 작성
  create: (recipeId, userId, content) => {
    console.log(`댓글 API 호출: recipeId=${recipeId}, userId=${userId}, content=${content}`);
    return api.post(`/recipes/${recipeId}/comments?userId=${userId}&content=${encodeURIComponent(content)}`);
  },
  
  // 댓글 수정
  update: (recipeId, commentId, userId, content) => {
    console.log(`댓글 수정 API 호출: recipeId=${recipeId}, commentId=${commentId}, userId=${userId}`);
    return api.put(`/recipes/${recipeId}/comments/${commentId}?userId=${userId}&content=${encodeURIComponent(content)}`);
  },
  
  // 댓글 삭제
  delete: (recipeId, commentId, userId) => {
    console.log(`댓글 삭제 API 호출: recipeId=${recipeId}, commentId=${commentId}, userId=${userId}`);
    return api.delete(`/recipes/${recipeId}/comments/${commentId}?userId=${userId}`);
  }
};

// 인증 관련 API
export const authApi = {
  // 회원가입
  signup: (username, password) => 
    api.post(`/auth/signup?username=${username}&password=${password}`),
  
  // 로그인
  login: (username, password) => 
    api.post(`/auth/login?username=${username}&password=${password}`),
};

export default api;