import React, { useEffect, useState } from 'react';

const LoadingChef = ({ isLoading }) => {
  const [visible, setVisible] = useState(false);
  const [loadingText, setLoadingText] = useState('조리 중...');
  const [dots, setDots] = useState('');
  const [ingredients, setIngredients] = useState(['🥕', '🍅', '🧅', '🥩', '🍄', '🧀', '🌶️', '🥔']);

  // 로딩 상태에 따라 표시 여부 결정
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // 로딩이 끝나도 애니메이션을 더 길게 보여주기 위해 타임아웃 설정
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // 3초 동안 더 표시
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // 로딩 텍스트 애니메이션
  useEffect(() => {
    const textAnimation = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(textAnimation);
  }, []);

  // 요리 단계 표시
  useEffect(() => {
    if (!visible) return;
    
    const cookingSteps = [
      '재료 준비 중...',
      '양념 섞는 중...',
      '불 켜는 중...',
      '조리 중...',
      '맛있게 완성!'
    ];
    
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
      setLoadingText(cookingSteps[currentStep]);
      currentStep = (currentStep + 1) % cookingSteps.length;
    }, 2000);
    
    return () => clearInterval(stepInterval);
  }, [visible]);

  // 랜덤 재료 선택
  const getRandomIngredients = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * ingredients.length);
      result.push(ingredients[randomIndex]);
    }
    return result;
  };

  // 귀여운 주방장 SVG (인라인으로 정의)
  const chefSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- 주방장 모자 -->
      <ellipse cx="50" cy="30" rx="25" ry="20" fill="#FFFFFF" />
      <ellipse cx="50" cy="25" rx="22" ry="15" fill="#FFFFFF" />
      
      <!-- 얼굴 -->
      <circle cx="50" cy="50" r="20" fill="#FFE0B2" />
      
      <!-- 눈 -->
      <circle cx="43" cy="45" r="3" fill="#5C3C10" />
      <circle cx="57" cy="45" r="3" fill="#5C3C10" />
      
      <!-- 웃는 입 -->
      <path d="M42,55 Q50,65 58,55" stroke="#5C3C10" stroke-width="2" fill="none" />
      
      <!-- 주방장 모자 상단 -->
      <rect x="35" y="15" width="30" height="15" fill="#FFFFFF" />
      <ellipse cx="50" cy="15" rx="15" ry="5" fill="#FFFFFF" />
    </svg>
  `;

  const randomIngredients = getRandomIngredients();

  return (
    <div className={`loading-popup ${visible ? 'show' : ''}`}>
      <div className="chef-container">
        <div 
          className="chef chef-cooking" 
          style={{ 
            backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(chefSvg)}')`
          }}
        ></div>
        <div className="pot">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="flame"></div>
        </div>
        
        {/* 떠다니는 재료들 */}
        <div className="ingredient">{randomIngredients[0]}</div>
        <div className="ingredient">{randomIngredients[1]}</div>
        <div className="ingredient">{randomIngredients[2]}</div>
        <div className="ingredient">{randomIngredients[3]}</div>
      </div>
      <div className="loading-text">
        {loadingText}{dots}
      </div>
    </div>
  );
};

export default LoadingChef;