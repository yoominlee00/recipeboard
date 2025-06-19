import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [skipLoading, setSkipLoading] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 로그인 함수
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // 로그인 시 로딩 애니메이션 건너뛰기 플래그 설정
    setSkipLoading(true);
    
    // 3초 후에 플래그 초기화
    setTimeout(() => {
      setSkipLoading(false);
    }, 3000);
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, skipLoading }}>
      {children}
    </UserContext.Provider>
  );
};