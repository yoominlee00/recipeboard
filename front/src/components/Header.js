import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function Header() {
  // UserContext에서 사용자 정보와 로그아웃 함수 가져오기
  const { user, logout } = useContext(UserContext);

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-utensils"></i> 오늘 뭐 먹지? 🍽️
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">홈</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/create">
                  <i className="fas fa-plus-circle"></i> 새 레시피 공유하기
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    <i className="fas fa-user"></i> {user.username}님 안녕하세요!
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-dark" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> 로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt"></i> 로그인
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    <i className="fas fa-user-plus"></i> 회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;