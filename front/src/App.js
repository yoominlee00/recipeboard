import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 컨텍스트 import
import { UserProvider, UserContext } from './contexts/UserContext';

// 컴포넌트 import
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import Login from './components/Login';
import Signup from './components/Signup';

// 인증된 사용자만 접근 가능한 라우트를 위한 컴포넌트
const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="py-4">
          <Routes>
            {/* 메인 페이지 - 레시피 목록 */}
            <Route path="/" element={<RecipeList />} />
            
            {/* 레시피 상세 페이지 */}
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            
            {/* 레시피 작성 페이지 - 로그인 필요 */}
            <Route 
              path="/create" 
              element={
                <PrivateRoute>
                  <RecipeForm />
                </PrivateRoute>
              } 
            />
            
            {/* 레시피 수정 페이지 - 로그인 필요 */}
            <Route 
              path="/edit/:id" 
              element={
                <PrivateRoute>
                  <RecipeForm />
                </PrivateRoute>
              } 
            />
            
            {/* 로그인 페이지 */}
            <Route path="/login" element={<Login />} />
            
            {/* 회원가입 페이지 */}
            <Route path="/signup" element={<Signup />} />
            
            {/* 404 페이지 */}
            <Route path="*" element={
              <div className="container text-center my-5">
                <h2>404 - 페이지를 찾을 수 없습니다</h2>
                <p>요청하신 페이지가 존재하지 않습니다.</p>
              </div>
            } />
          </Routes>
        </main>
        <footer className="py-4 mt-5">
          <div className="container">
            <p className="mb-0">오늘 뭐 먹지? 🍕🍜🍰 &copy; {new Date().getFullYear()}</p>
            <p className="small mt-2">맛있는 레시피를 공유하고 발견하세요!</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;